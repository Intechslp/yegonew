angular.module('starter.cargas.controllers',
['starter.controllers','starter.login.controllers','starter.seguro.controllers',
'starter.autos.controllers',
'ngMap','ngStorage','ng-token-auth','ngCordova'])

// CARGAS CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('CargasCtrl',
function($state, $scope, $window, $rootScope, $stateParams,
  $ionicLoading, $localStorage, $ionicModal, $ionicHistory, $ionicPopup, $auth,
  GasolinasData) {

  $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
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
  elCarro = $scope.$storage.user.driver_of_vehicles[0];
  userId = $scope.$storage.user.id;
  $scope.mainCar = elCarro.brand+' '+elCarro.description+' '+elCarro.model;
  $scope.carId = $scope.$storage.user.driver_of_vehicles[0].id;
  $scope.objG = {};
  $scope.objG.fuel_refill = {};
  $scope.carga = {};
  $scope.meses = [];

  $scope.usrId = $scope.$storage.id;
  var usrUid = $scope.$storage.headers.uid;

  GasolinasData.getFuelRefills(userId,$scope.carId).then(function(resp){
    console.log(resp);
    $scope.cargas_registradas = resp;
    console.log($scope.cargas_registradas.length);
    $scope.mes = Object.keys($scope.cargas_registradas);
    console.log($scope.mes)
    $ionicLoading.hide();
  }).catch(function(resp){
    console.log(resp);
    $ionicLoading.hide();
  });

  $scope.setMonth = function(key){

    switch (key) {
      case "1":
        return 'Enero'
        break;
      case "2":
        return 'Febrero'
        break;
      case "3":
        return 'Marzo'
        break;
      case "4":
        return 'Abril'
        break;
      case "5":
        return 'Mayo'
        break;
      case "6":
        return 'Junio'
        break;
      case "7":
        return 'Julio'
        break;
      case "8":
        return 'Agosto'
        break;
      case "9":
        return 'Septiembre'
        break;
      case "10":
        return 'Octubre'
        break;
      case "11":
        return 'Noviembre'
        break;
      case "12":
        return 'Diciembre'
        break;
      default:

    }
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
      GasolinasData.getGasStations().then(function(resp){
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
  $scope.goResumen = function(){
    $state.go('app.resumenMes', {cargaId: 1});
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
function($state, $scope, $window, $rootScope, $stateParams,
  $ionicLoading, $localStorage, $ionicModal, $ionicHistory, AutosData,UserData, $cordovaCamera, ImageUploadFactory) {


})// END CARGAS SINGLE CONTROLLER
//**********
;
