angular.module('starter.login.controllers',
['starter.controllers','starter.perfil.controllers','starter.seguro.controllers',
'ngMap','ngStorage','ng-token-auth','ngCordova'])

// LOGIN CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('LoginCtrl',
  function($scope, $state, $rootScope, $window,
    $localStorage, $auth, $ionicLoading,
    $ionicPopup, $ionicHistory, $cordovaSQLite,
    HeadersSave, UserData){

  console.log('LoginCtrl');

  $ionicLoading.show({templateUrl: 'templates/comprobando.html'});
  $auth.validateUser().then(function(resp){
    $state.go('app.directorio');
  }).catch(function(resp){
    $ionicLoading.hide();
    $window.localStorage.clear();
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
  });

  // VARS
  $scope.$storage = $localStorage;
  $scope.loginData = {};
  $scope.registerData = {};
  $scope.btnCont = true;
  $scope.loginForm = true;
  $scope.registerForm = false;

  if ($scope.$storage.guest) {
    $state.go('app.directorio');
  }

  // METHODS
  $scope.showForm = function (form,estado){
    if(estado === 'open'){
      $scope.btnCont = false;
      if(form === "register"){
        $scope.loginForm = false;
        $scope.registerForm = true;
      }
    }else if (estado === 'close'){
      $scope.btnCont=true;
      $scope.loginForm = true;
      $scope.registerForm = false;
    }
  }

  $scope.loginClick = function (){
    $ionicLoading.show({templateUrl: 'templates/iniciando.html'});
    $auth.submitLogin($scope.loginData)
      .then(function(resp) {
        HeadersSave.setHeaders(resp);
        var sesion = JSON.parse(localStorage.auth_headers.replace("-","_"));
        $scope.$storage.headers= sesion;
        $scope.$storage.id = resp.id;
        $scope.$storage.custId = resp.customer_id;

        UserData.getUserData(resp.id, $scope.$storage.headers.uid).then(function(response){
          $scope.$storage.user = response;
          $ionicLoading.hide();
          $state.go('app.directorio');
        }).catch(function(response){
          $ionicLoading.hide();
          $scope.showAlert2();
        });

      })
      .catch(function(resp) {
        $scope.showAlert();
        $ionicLoading.hide();
    });
  }

  $scope.regBtnClick = function() {
    $scope.registerData.user_roles = {"add_role":"appuser"}
    $auth.submitRegistration($scope.registerData)
      .then(function(resp) {
        var sesion = JSON.parse(localStorage.auth_headers.replace("-","_"));
        $scope.$storage.headers = sesion;
        $scope.$storage.guest = false;
        $scope.$storage.id = resp.data.data.id;

        UserData.getUserData(resp.data.data.id, $scope.$storage.headers.uid).then(function(response){
          $scope.$storage.user = response;
          $ionicLoading.hide();
          $state.go('location');
        }).catch(function(response){
          $ionicLoading.hide();
          $scope.showAlert2();
        });

      })
      .catch(function(resp) {
        $scope.showAlert2();
      });

  };
  $scope.guestClick = function(){
    console.log('guestClick');
    $scope.$storage.guest = true;
    $state.go('location')
  }

  // An alert dialog
  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Intento fallido',
      template: 'El usuario o la contraseña que ingresaste son incorrectos'
    });
  };
  $scope.showAlert2 = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Algo salió mal',
      template: 'Algo ocurrió mientras intentabamos recuperar tus datos, intenta de nuevo'
    });
  };

  $scope.insert = function(obj) {
      console.log($rootScope.db);
      var query = "INSERT INTO people (usrId, firstname, username, family, pic, carpic, guest) VALUES (?,?,?,?,?,?)";
      console.log(query);
      $cordovaSQLite.execute($rootScope.db, query, [0, obj.firstname, obj.user, obj.family, obj.pic, obj.carpic, 1]).then(function(res) {
          console.log("INSERT ID -> " + res.insertId);
      }, function (err) {
          console.error(err);
      });
  }

})// END LOGIN CONTROLLER



// LOCATION CONTROLLER
.controller('LocationCtrl',
function ($scope, $state, $filter,
  $localStorage,LocationData,$ionicLoading, $ionicPopup,
  UserData) {
  $scope.$storage = $localStorage;
  $scope.country;
  $scope.state;
  $scope.city = {};
  $scope.usuarioData = {};

  $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
  LocationData.getCountries().then(function(resp){
    $scope.paises = resp;
    $ionicLoading.hide();
  }).catch(function(resp){
    $ionicLoading.hide();
  });

  $scope.loadStates = function(paisId){
    console.log('loadStates()');
    console.log(paisId);
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    LocationData.getStates(paisId).then(function(resp){
      $scope.estados = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      $ionicLoading.hide();
    });
  }
  $scope.loadCities = function(paisId,estadoId){
    console.log('loadCities()');
    console.log(estadoId);
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    LocationData.getCities(paisId,estadoId).then(function(resp){
      $scope.ciudades = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      $ionicLoading.hide();
    });
  }

  $scope.goAuto = function(city){
    $scope.usuarioData.city_id = city.id;
    // console.log($scope.usuarioData);
    if($scope.$storage.guest){
      $state.$storage.guestUser = {};
      $state.$storage.guestUser.city_id = city.id;
      $state.go('welcome');
    }else{
      $ionicLoading.show({templateUrl: 'templates/enviando.html'});
      UserData.updateUser($scope.$storage.id,$scope.usuarioData).then(function(){
        $state.go('autoReg');
      }).catch(function(){
        $scope.showAlert('Error','Hubo un problema al envar tus datos, intenta más tarde');
      });

    }
  }

  // An alert dialog
  $scope.showAlert = function(msj1,msj2) {
    var alertPopup = $ionicPopup.alert({
      title: msj1,
      template: msj2
    });
  };

})// END LOCATION CONTROLLER



// AUTOREG CONTROLLER
.controller('AutoRegCtrl',
function ($scope, $state, $filter, $localStorage, $ionicLoading, SegurosData, UserData, AutosData) {
  $scope.marcas = [];
  $scope.modelos = [];
  $scope.descripciones = [];

  $scope.myCar = {};
  $ionicLoading.show({templateUrl:'templates/obteniendo.html'});

  SegurosData.getMarcas().then(function(response){
    console.log(response);
    $ionicLoading.hide();
    var brands = JSON.parse(response);
    $scope.marcas = brands.Marcas;
  }).catch(function(response){
    $ionicLoading.hide();
    console.log(response);
    $ionicLoading.hide();
    $scope.showAlert('fail',response);
  });

  $scope.goForModels = function(brand){
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    SegurosData.getModelos(brand).then(function(response){
      $ionicLoading.hide();
      var models = JSON.parse(response);
      $scope.modelos = models.Modelos;
    }).catch(function(response){
      $ionicLoading.hide();
      console.log(response);
      $scope.showAlert('fail',response);
    });
  }

  $scope.goForDescriptions = function(brand,model){
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    SegurosData.getDescripciones(brand,model).then(function(response){
      $ionicLoading.hide();
      var descriptions = JSON.parse(response);
      $scope.descripciones = descriptions.Descripciones;
    }).catch(function(response){
      $ionicLoading.hide();
      console.log(response);
      $scope.showAlert('fail',response);
    });
  }

  $scope.$storage = $localStorage;

  $scope.saveCar = function(){
    $ionicLoading.show({templateUrl:'templates/enviando.html'});
    AutosData.nuevoAuto($scope.myCar).then(function(response){ //ORIGINAL
    // AutosData.nuevoAuto($scope.pruebaCar).then(function(response){ // PRUEBA
      console.log(response);
      $ionicLoading.hide();
      $state.go('welcome');
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });
  }

})// END AUTOREG CONTROLLER


// WELCOME CONTROLLER
.controller('WelcomeCtrl', function ($scope, $state, $filter, $localStorage) {
  $scope.$storage = $localStorage;
  if($scope.$storage.guest){
    $scope.registered = false;
  }else{
    $scope.registered = true;
  }
})// END WELCOME CONTROLLER
;
