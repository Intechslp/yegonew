angular.module('starter.cargas.controllers',
['starter.controllers','starter.login.controllers','starter.seguro.controllers',
'starter.autos.controllers',
'ngMap','ngStorage','ng-token-auth','ngCordova'])

// CARGAS CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('CargasCtrl',
function($state, $scope, $window, $rootScope, $stateParams, $filter,
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
  var elCarro = $scope.$storage.user.driver_of_vehicles[0];
  var userId = $scope.$storage.user.id;
  if(elCarro !== undefined){
    console.log('El carro está definido');
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    $scope.mainCar = elCarro.brand+' '+elCarro.description+' '+elCarro.model;
    $scope.carId = $scope.$storage.user.driver_of_vehicles[0].id;
    $scope.theresCar = true;
    $scope.objG = {};
    $scope.objG.fuel_refill = {};
    $scope.carga = {};
    $scope.meses = [];
    $scope.cargaTotal = [];
    $scope.costoTotal = [];

    $scope.usrId = $scope.$storage.id;
    var usrUid = $scope.$storage.headers.uid;
    $scope.userCity = $scope.$storage.user.city.id;

    GasolinasData.getFuelRefills(userId,$scope.carId).then(function(resp){
      console.log(resp);
      $scope.theMonths = _.groupBy(resp, 'month_year');
      console.log($scope.theMonths);
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
      $ionicLoading.hide();
    }).catch(function(resp){
      console.log(resp);
      $ionicLoading.hide();
    });
  }else{
    $scope.theresCar = false;
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


})// END CARGAS CONTROLLER
//**********

// CARGAS SINGLE CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('ResumenMesCtrl',
function($state, $scope, $window, $rootScope, $stateParams, $ionicLoading,
  $localStorage, $ionicModal, $ionicHistory, GasolinasData) {

$scope.theMonth = GasolinasData.getSingleMonth();

})// END CARGAS SINGLE CONTROLLER
//**********
;
