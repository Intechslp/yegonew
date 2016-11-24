angular.module('starter.negocios.controllers',
['starter.perfil.controllers','starter.login.controllers','starter.seguro.controllers',
'ngMap','ngStorage','ng-token-auth','ngCordova'])
// MI NEGOCIO CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('NegociosCtrl',
function($state, $scope, $rootScope, $stateParams, $filter, $auth,
$localStorage, $ionicLoading, $ionicModal, $ionicPopup,
EstablecimientosData, NegociosData, ServiciosData, LocationData) {

// Comprobación de sesión
  $auth.validateUser().then(function(resp){
  }).catch(function(resp){
    $ionicLoading.hide();
    $window.localStorage.clear();
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $state.go('login');
  });

// Declaración de variables
  $scope.$storage = $localStorage;
  $scope.myNegocio = {};
  $scope.mySucursal = {};
  $scope.servicios = {};
  $scope.myNegocio.subcategory_ids = [];
  $scope.mySucursal.business_id = null;
  $scope.categorias = {};
  $scope.category = {};
  $scope.subcategorias = {};
  $scope.showSubcategory = false;
  $scope.negocioPropio = false;
  $scope.theresNegocio = false;
  $scope.userId = $scope.$storage.id;
  $scope.negocios = [];
  $scope.country;
  $scope.state;
  $scope.city = {};
  $scope.showState = false;
  $scope.showCity = false;
  $scope.showButton = false;
  $scope.negocioID;
  //VARIABLE DE PRUEBA
  // $scope.negocioID = 3753;//BORRAR DESPUES DE COMPROBAR SU FINCIONAMIENTO

  $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
  NegociosData.getUserNegocios($scope.userId).then(function(resp){
    console.log(resp);
    $scope.negocios = resp;
    if ($scope.negocios.length > 0) {
      $scope.theresNegocio = true;
    }
    $ionicLoading.hide();
  }).catch(function(resp){
    console.log(resp);
    $ionicLoading.hide();
  });

// Se crea el modal para nuevo negocio
  $ionicModal.fromTemplateUrl('templates/negocios/nuevoNegocio.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    console.log('se crea el modal de negocio');
    $scope.nuevoNegocioModal = modal;
  });

// Se crea el modal para nueva sucursal
  $ionicModal.fromTemplateUrl('templates/negocios/nuevaSucursal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal2) {
    console.log('se crea el modal de sucursal');
    $scope.nuevaSucursalModal = modal2;
  });

// Se abre el modal de nuevo Negocio
  $scope.abrirModalNeg = function(propio) {
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    if(propio == true){
      $scope.negocioPropio = true;
    }
    $scope.nuevoNegocioModal.show();
    EstablecimientosData.getCategorias().then(function(resp){
      console.log(resp);
      $scope.categorias = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      console.log(resp);
      $ionicLoading.hide();
    });
  };

// Función para cargar las subcategorías de los negocios
  $scope.goForSubs = function(catId){
    console.log('goForSubs');
    var the_cat = $filter('filter')($scope.categorias,{id:catId});
    $scope.subcategorias = the_cat[0].subcategories;
    $scope.showSubcategory = true;
  }

// Se abre el modal de nueva Sucursal
  $scope.abrirModalSuc = function(propio) {
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    LocationData.getCountries().then(function(resp){
      $scope.paises = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      $ionicLoading.hide();
    });
    $scope.nuevaSucursalModal.show();
    ServiciosData.getServicios().then(function(resp){
      console.log(resp);
      $scope.servicios = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      console.log(resp);
      $ionicLoading.hide();
    });
  };

// Carga la lista de estados en función del país
  $scope.loadStates = function(paisId){
    console.log('loadStates()');
    console.log(paisId);
    $scope.showState = true;
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    LocationData.getStates(paisId).then(function(resp){
      $scope.estados = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      $ionicLoading.hide();
    });
  }

// Carga la lista de ciudades en función del estado
  $scope.loadCities = function(paisId,estadoId){
    console.log('loadCities()');
    console.log(estadoId);
    $scope.showCity = true;
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    LocationData.getCities(paisId,estadoId).then(function(resp){
      $scope.ciudades = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      $ionicLoading.hide();
    });
  }

// cerrar el modal de Negocio
  $scope.cerrarModalNeg = function(){
    $scope.nuevoNegocioModal.hide();
    $state.go('app.negocios', $stateParams, {reload: true, inherit: false});
  }

// cerrar el modal de Sucursal
  $scope.cerrarModalSuc = function(){
    console.log('cerrarModalSuc');
    $scope.nuevaSucursalModal.hide();
    $state.go('app.negocios', $stateParams, {reload: true, inherit: false});
  }

// Crear Negocio en base de datos
  $scope.enviarNegocio = function(){
    $ionicLoading.show({templateUrl:'templates/enviando.html'});
    console.log('Enviar Negocio');
    $scope.myNegocio.subcategory_ids[0] = "24";
    $scope.myNegocio.subcategory_ids[1] = "6";
    console.log($scope.myNegocio);
    NegociosData.createNegocio($scope.myNegocio).then(function(resp){
      $ionicLoading.hide();
      $scope.mySucursal.business_id  = resp.id;
      // $scope.nuevoNegocioModal.hide();
      // $scope.abrirModalSuc();
    }).catch(function(resp){
      $scope.showAlert(
        'Error',
        'Ocurrio un error desconocido, intenta más tarde'
      );
      $ionicLoading.hide();
    });
  }


// Se asigna la ciudad a la Sucursal
$scope.asignarCiudad = function(city){
  $scope.mySucursal.city_id = city.id;
}

// Crear Sucursal en base de datos
$scope.enviarSucursal = function(){
  $ionicLoading.show({templateUrl:'templates/enviando.html'});
  console.log('Enviar Sucursal');
  // $scope.mySucursal.business_id = $scope.negocioID;
  console.log($scope.mySucursal);
  EstablecimientosData.createSucursal($scope.mySucursal).then(function(resp){
    $ionicLoading.hide();
    $scope.showAlert(
      'Información enviada con éxito',
      'Los datos seran analizados, por el momento el negocio se encuentra como \'pendiente\', te avisaremos si es aceptado o rechazado'
    );
  }).catch(function(resp){
    $scope.showAlert(
      'Error',
      'Ocurrio un error desconocido, intenta más tarde'
    );
    $ionicLoading.hide();
  });
}


// An alert dialog
 $scope.showAlert = function(msj1,msj2) {
   var alertPopup = $ionicPopup.alert({
     title: msj1,
     template: msj2
   });
   alertPopup.then(function(res) {
     $scope.cerrarModalSuc();
   });
 };
})//END MI NEGOCIO CONTROLLER
//**********


// SINGLE NEGOCIO CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('SingleNegocioCtrl', function($state, $scope, $rootScope, $stateParams, NgMap, $ionicLoading, $ionicNavBarDelegate) {

})//END SINGLE NEGOCIO CONTROLLER
//**********


// MI SUCURSAL CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('SucursalesCtrl', function($state, $scope, $rootScope, $stateParams, NgMap, $ionicLoading, $ionicNavBarDelegate) {

})//END MI SUCURSAL CONTROLLER
//**********


// SINGLE SUCURSAL CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('SingleSucursalCtrl', function($state, $scope, $rootScope, $stateParams, NgMap, $ionicLoading, $ionicNavBarDelegate) {

})//END SINGLE SUCURSAL CONTROLLER
//**********
;
