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
  $scope.userData = {};
  $scope.objU = {};
  $scope.objU.app_user;
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

  // Inicio de sesión
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

  // Registro de nuevo usuario
  $scope.regBtnClick = function() {
    if($scope.verifyRegistration()){
      $ionicLoading.show({templateUrl: 'templates/enviando.html'});
      console.log('verifyRegistration is true')

      $scope.objU.app_user = $scope.userData;
      console.log($scope.objU);
      $auth.submitRegistration($scope.registerData).then(function(resp) {
        var sesion = JSON.parse(localStorage.auth_headers.replace("-","_"));
        $scope.$storage.headers = sesion;
        $scope.$storage.guest = false;
        $scope.$storage.id = resp.data.data.id;

        UserData.updateUser(resp.data.data.id, $scope.objU).then(function(response){
          $scope.$storage.user = response;
          $ionicLoading.hide();
          $state.go('location');
        }).catch(function(response){
          $ionicLoading.hide();
          $scope.showAlert2();
        });

      })
      .catch(function(resp) {
        $ionicLoading.hide();
        $scope.showAlert2();
      });
    }

  };


  $scope.verifyRegistration = function(){
    if($scope.registerData.email != null &&
      $scope.userData.name != null &&
      $scope.userData.lastnames != null &&
      $scope.registerData.password != null &&
      $scope.registerData.password_confirmation != null){
      if($scope.registerData.password === $scope.registerData.password_confirmation){
        if($scope.registerData.password.length >= 8 ){
          return true;
        }else{
          $scope.customAlert(
            'Error',
            'la contraseña debe ser de 8 caractéres o más'
          );
          return false;
        }
      }else{
        $scope.customAlert(
          'Error',
          'Las contraseñas no coinciden'
        );
        return false;
      }
    }else{
      $scope.customAlert(
        'Error',
        'Debes de llenar todos los campos'
      );
      return false;
    }
  }

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

  // custom alert
  $scope.customAlert = function(msj1,msj2){
    var alertPopup = $ionicPopup.alert({
      title: msj1,
      template: msj2
    });
  }

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
  $scope.showState = false;
  $scope.showCity = false;
  $scope.showButton = false;

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
    $scope.showState = true;
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
    $scope.showCity = true;
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    LocationData.getCities(paisId,estadoId).then(function(resp){
      $scope.ciudades = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      $ionicLoading.hide();
    });
  }

// Show the button to continue
  $scope.showButtonFn = function(){
    $scope.showButton = true;
  }

// go to Car registration
  $scope.goAuto = function(city){
    console.log('goAuto()');
    $scope.usuarioData.city_id = city.id;
    console.log($scope.usuarioData);
    if($scope.$storage.guest){
      console.log('guest is true');
      $state.$storage.guestUser = {};
      $state.$storage.guestUser.city_id = city.id;
      $state.go('welcome');
    }else{
      console.log('guest is false');
      $ionicLoading.show({templateUrl: 'templates/enviando.html'});
      UserData.updateUser($scope.$storage.id,$scope.usuarioData).then(function(resp){
        $scope.$storage.user = resp;
        $ionicLoading.hide();
        $state.go('autoReg');
      }).catch(function(resp){
        $ionicLoading.hide();
        console.log(resp);
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
function ($scope, $state, $filter, $localStorage, $ionicLoading, $cordovaCamera,
  SegurosData, UserData, AutosData, ImageUploadFactory) {

  $scope.$storage = $localStorage;
  $scope.userId = $scope.$storage.user.id;
  $scope.marcas = [];
  $scope.modelos = [];
  $scope.descripciones = [];
  $scope.objV = {};
  $scope.objV.vehicle={};
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

  $scope.saveCar = function(){
    console.log('saveCar()');
    $ionicLoading.show({templateUrl:'templates/enviando.html'});
    if($scope.imgRegAuto !== undefined){
      ImageUploadFactory.uploadImage($scope.imgRegAuto, 'yegoapp').then(function(result){
        $scope.url = result.url;
        $scope.myCar.imageurl = $scope.url;
        console.log($scope.myCar);
        $scope.objV.vehicle = $scope.myCar;
        // Una vez subida la foto, se suben los datos del auto
        AutosData.nuevoAuto($scope.objV).then(function(response){
          console.log(response);

          UserData.getUserData($scope.$storage.id).then(function(resp){
            $scope.$storage.user = resp;
            console.log(resp);
            $ionicLoading.hide();
          }).catch(function(resp){
            console.log(resp);
            $ionicLoading.hide();
          });
          $state.go('welcome');
        }).catch(function(response){
          console.log(response);
          $ionicLoading.hide();
        });

      }).catch(function(err) {
        $ionicLoading.hide();
        console.log('ImageUploadFactory().catch');
        // Do something with the error here
        console.log(err);
        $cordovaCamera.cleanup();
      });
    }else{
      console.log('A LA VERGA PINCHE APP :3')
      $ionicLoading.hide();
    }
  }

  // Abre la camara para tomar foto
  $scope.takePicture = function($event) {
    console.log('takePicture()')
    var options = {
      quality : 70,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 800,
      targetHeight: 450,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true
    };
    // $event.stopPropagation();
    $cordovaCamera.getPicture(options).then(function(imageData) {
      console.log(options)
      // console.log(imageData)
      $scope.imgRegAuto = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // An error occured. Show a message to the user
    });
  }

  $scope.selectPicture = function() {
    console.log('selectPicture()')
    var options = {
      quality : 70,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 800,
      targetHeight: 450,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      console.log(options)
      $scope.imgRegAuto = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // An error occured. Show a message to the user
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
