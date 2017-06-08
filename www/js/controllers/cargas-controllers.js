angular.module('starter.cargas.controllers',
['starter.controllers','starter.login.controllers','starter.seguro.controllers',
'starter.autos.controllers',
'ngMap','ngStorage','ng-token-auth','ngCordova'])

// CARGAS CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('CargasCtrl',
function($state, $scope, $window, $rootScope, $stateParams, $filter, $timeout,
  $ionicLoading, $localStorage, $ionicModal, $ionicHistory, $ionicPopup, $auth,
  GasolinasData) {

  // Comprobación de sesión
  $auth.validateUser().then(function(resp){
  }).catch(function(resp){
    $ionicLoading.hide();
    $window.localStorage.clear();
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $state.go('login');
  });

  $scope.$storage = $localStorage;
  $scope.theresCar = false;
  $scope.carga = {};
  $scope.objG = {};
  $scope.chooseCar = true;
  var userId = $scope.$storage.user.id;

  $scope.cars = $scope.$storage.user.driver_of_vehicles;

  if($scope.cars.length > 0){
    $scope.theresCar = true;
  }
  $scope.goSingleCar = function(car){
    GasolinasData.setCar(car);
    $state.go('app.cargasSingle');
  }


// se declara el modal para dar de alta una carga de gasolina
  $ionicModal.fromTemplateUrl('templates/cargas/nuevaCarga.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

// funcion para abrir el modal
  $scope.openModal = function() {
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    GasolinasData.getFuels().then(function(resp){
      $scope.gasolinas = resp;
      console.log(resp);
      GasolinasData.getGasStations($scope.userCity).then(function(resp){
        $scope.gasolineras = resp;
        $ionicLoading.hide();
        console.log(resp);
      }).catch(function(resp){
        $ionicLoading.hide();
        console.log(resp);
        $scope.showAlert(
          'Error',
          'Algo a ocurrido mientras intentabamos recuperar las gasolineras, intenta más tarde'
        );
      });

    }).catch(function(resp){
      console.log(resp);
      $ionicLoading.hide();
      $scope.showAlert(
        'Error',
        'Algo a ocurrido mientras intentabamos recuperar las gasolinas, intenta más tarde'
      );
    });
    $scope.modal.show();
  };

// funcion para cerrar el modal
  $scope.closeModal = function() {
    $scope.modal.hide();
    $state.go('app.cargas', $stateParams, {reload: true, inherit: false});
  };

// funcion para crear una nueva carga de gasolina
  $scope.nuevaCarga = function() {
    console.log($scope.carga);
    if($scope.comprobarCarga()){
      $ionicLoading.show({templateUrl:'templates/enviando.html'});
      $scope.objG.fuel_refill = $scope.carga;
      GasolinasData.NewFuelRefill(userId,$scope.objG).then(function(resp){
        console.log(resp);
        $ionicLoading.hide();
        $scope.showAlert(
          '¡Éxito!',
          'Tu carga ha sido guardada éxitosamente'
        );
        $scope.closeModal();
      }).catch(function(resp){
        console.log(resp);
        $ionicLoading.hide();
        $scope.showAlert(
          'Error',
          'Algo salio mal mientras intentabamos enviar los datos de tu carga'
        );
      });
    }else{
      $scope.showAlert(
        'Error',
        'Debes de llenar todos los campos'
      );
    }
  }

// funcion para comprobar que estén todos los datos
  $scope.comprobarCarga = function(){
    console.log($scope.carga);
    if(
      $scope.carga.fuel_id !== null ||
      $scope.carga.quantity !== null ||
      $scope.carga.price !== null ||
      $scope.carga.kilometers !== null
    ){
      return true
    }else{
      return false
    }
  }

// funcion que envía a la pantalla de mis autos
  $scope.goAutos = function(){
    $ionicHistory.nextViewOptions({
      historyRoot: true
    })
    $state.go('app.autos');
  }

  $scope.showAlert = function(msj1,msj2) {
    var alertPopup = $ionicPopup.alert({
     title: msj1,
     template: msj2
    });
  }


})// END CARGAS CONTROLLER
//**********


// CARGAS SINGLE CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('CargasSingleCtrl',
function($state, $scope, $window, $rootScope, $stateParams, $filter, $timeout,
  $ionicLoading, $localStorage, $ionicModal, $ionicHistory, $ionicPopup, $auth,
  GasolinasData) {

  $scope.$storage = $localStorage;
  $scope.cars = $scope.$storage.user.driver_of_vehicles;
  $scope.the_car = GasolinasData.getCar();
  console.log($scope.the_car);
  var userId = $scope.$storage.user.id;
  $scope.chooseCar = false;

  $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
  $scope.mainCar = $scope.the_car.brand+' '+$scope.the_car.description+' '+$scope.the_car.model;
  console.log($scope.mainCar);
  $scope.carId = $scope.the_car.id;
  $scope.theresCar = true;
  $scope.objG = {};
  $scope.objG.fuel_refill = {};
  $scope.carga = {};
  $scope.carga.vehicle_id = $scope.carId;
  $scope.meses = [];
  $scope.cargaTotal = [];
  $scope.costoTotal = [];

  // $scope.userCity = $scope.$storage.user.city.id;

  var gasolineras_to = $timeout(function(){
    //en caso de que la petición tarde demasiado se cancela el loading
    $ionicLoading.hide();
    $scope.showConfirm('¡Vaya!',
    'Parece que ha habido un error accediendo a la base de datos o tu conexión'+
    ' a internet no es óptima para que Yego funcione correctamente');
    console.log('Time Out :(');
  },7000);

  // A confirm dialog
 $scope.showConfirm = function(msj1, msj2) {
   var confirmPopup = $ionicPopup.confirm({
     title: msj1,
     template: msj2,
     cancelText: 'Cancelar',
     okText: 'Reintentar'
   });
   confirmPopup.then(function(res) {
     if(res) {
       $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
       console.log('You are sure');
     } else {
       console.log('You are not sure');
     }
   });
 };

  GasolinasData.getFuelRefills(userId,$scope.carId).then(function(resp){
    $timeout.cancel(gasolineras_to);
    $scope.theMonths = _.groupBy(resp, 'month_year');
    for (var prop in $scope.theMonths) {
      if ($scope.theMonths.hasOwnProperty(prop)) {
        var cargaSum = 0;
        var costoSum = 0;
        for (var i = 0; i < $scope.theMonths[prop].length; i++) {
          cargaSum += $scope.theMonths[prop][i].quantity;
          costoSum += $scope.theMonths[prop][i].price;
        }
        $scope.cargaTotal.push(cargaSum);
        $scope.costoTotal.push(costoSum);
      }
    }
    console.log($scope.theMonths);
    $ionicLoading.hide();
  }).catch(function(resp){
    console.log(resp);
    $ionicLoading.hide();
  });


// se declara el modal para dar de alta una carga de gasolina
  $ionicModal.fromTemplateUrl('templates/cargas/nuevaCarga.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

// funcion para abrir el modal
  $scope.openModal = function() {
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    GasolinasData.getFuels().then(function(resp){
      $scope.gasolinas = resp;
      console.log(resp);
      GasolinasData.getGasStations($scope.userCity).then(function(resp){
        $scope.gasolineras = resp;
        $ionicLoading.hide();
        console.log(resp);
      }).catch(function(resp){
        $ionicLoading.hide();
        console.log(resp);
        $scope.showAlert(
          'Error',
          'Algo a ocurrido mientras intentabamos recuperar las gasolineras, intenta más tarde'
        );
      });

    }).catch(function(resp){
      console.log(resp);
      $ionicLoading.hide();
      $scope.showAlert(
        'Error',
        'Algo a ocurrido mientras intentabamos recuperar las gasolinas, intenta más tarde'
      );
    });
    $scope.modal.show();
  };

// funcion para cerrar el modal
  $scope.closeModal = function() {
    $scope.modal.hide();
    $state.go('app.cargas', $stateParams, {reload: true, inherit: false});
  };

// funcion para crear una nueva carga de gasolina
  $scope.nuevaCarga = function() {
    if($scope.comprobarCarga()){
      $ionicLoading.show({templateUrl:'templates/enviando.html'});
      $scope.objG.fuel_refill = $scope.carga;
      GasolinasData.NewFuelRefill(userId,$scope.objG).then(function(resp){
        console.log(resp);
        $ionicLoading.hide();
        $scope.showAlert(
          '¡Éxito!',
          'Tu carga ha sido guardada éxitosamente'
        );
        $scope.closeModal();
      }).catch(function(resp){
        console.log(resp);
        $ionicLoading.hide();
        $scope.showAlert(
          'Error',
          'Algo salio mal mientras intentabamos enviar los datos de tu carga'
        );
      });
    }else{
      $scope.showAlert(
        'Error',
        'Debes de llenar todos los campos'
      );
    }
  }

// funcion para comprobar que estén todos los datos
  $scope.comprobarCarga = function(){
    console.log($scope.carga);
    if(
      $scope.carga.fuel_id !== null ||
      $scope.carga.gas_station_id !== null ||
      $scope.carga.quantity !== null ||
      $scope.carga.price !== null ||
      $scope.carga.kilometers !== null
    ){
      return true
    }else{
      return false
    }
  }

// funcion que envía al resumen de cargas del mes
  $scope.goResumen = function(key,month,indx){
    console.log(month);
    GasolinasData.setSingleMonth(key,month,$scope.cargaTotal[indx],$scope.costoTotal[indx]);
    $state.go('app.resumenMes', {cargaId: 1});
  }

// funcion que envía a la pantalla de mis autos
  $scope.goAutos = function(){
    $ionicHistory.nextViewOptions({
      historyRoot: true
    })
    $state.go('app.autos');
  }

// funcion para comprobar si el objeto está vacío
  $scope.objectIsEmpty = function(){
    if(angular.equals($scope.theMonths, {}) ){
      return true;
    }else{
      return false;
    }
  }

  $scope.showAlert = function(msj1,msj2) {
    var alertPopup = $ionicPopup.alert({
     title: msj1,
     template: msj2
    });
  }

})// END CARGAS SINGLE CONTROLLER
//**********


// CARGAS RESUMEN CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('ResumenMesCtrl',
function($state, $scope, $window, $rootScope, $stateParams, $ionicLoading,
  $localStorage, $ionicModal, $ionicHistory, GasolinasData) {

$scope.theMonth = GasolinasData.getSingleMonth();

})// END CARGAS RESUMEN CONTROLLER
//**********
;
