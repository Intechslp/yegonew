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

  // VARS
  $scope.$storage = $localStorage;

  if($scope.$storage.guest === undefined || !$scope.$storage.guest){
    $ionicLoading.show({templateUrl: 'templates/comprobando.html'});
    $auth.validateUser().then(function(resp){
      $state.go('app.directorio');
    }).catch(function(resp){
      $ionicLoading.hide();
      $localStorage.$reset();
      $window.localStorage.clear();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
    });
  }else if($scope.$storage.guest){
    $state.go('app.directorio');
  }

  // VARS
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
    if($scope.checkLoginFields()){
      $auth.submitLogin($scope.loginData)
        .then(function(resp) {
          HeadersSave.setHeaders(resp);
          var sesion = JSON.parse(localStorage.auth_headers.replace("-","_"));
          $scope.$storage.headers= sesion;
          $scope.$storage.id = resp.id;
          $scope.$storage.custId = resp.customer_id;

          UserData.getUserData(resp.id, $scope.$storage.headers.uid).then(function(response){
            $scope.$storage.user = response;
            // console.log(response);
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
    }else{
      $scope.customAlert('Error','Debes de rellenar los campos de usuario y contraseña, no deben de estar vacíos.');
      $ionicLoading.hide();
    }
  }

  // Registro de nuevo usuario
  $scope.regBtnClick = function() {
    if($scope.verifyRegistration()){
      $ionicLoading.show({templateUrl: 'templates/enviando.html'});
      // console.log('verifyRegistration is true')

      $scope.objU.app_user = $scope.userData;
      // console.log($scope.objU);
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
    // console.log('guestClick');
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

  $scope.checkLoginFields = function(){
    if($scope.loginData.email !== '' && $scope.loginData.email !== null &&
      $scope.loginData.email !== undefined && $scope.loginData.password !== '' &&
      $scope.loginData.password !== null && $scope.loginData.password !== undefined){
      return true;
    }else{
      return false;
    }
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
    $scope.usuarioData.city_id = city.id;
    if($scope.$storage.guest){
      $scope.$storage.guestUser = {'city_id': city.id};
      $state.go('welcome');
    }else{
      $ionicLoading.show({templateUrl: 'templates/enviando.html'});
      UserData.updateUser($scope.$storage.id,$scope.usuarioData).then(function(resp){
        $scope.$storage.user = resp;
        $ionicLoading.hide();
        $state.go('autoReg');
      }).catch(function(resp){
        $ionicLoading.hide();
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
  SegurosData, UserData, AutosData, ImageUploadFactory, $jrCrop) {

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
    $ionicLoading.hide();
    var brands = JSON.parse(response);
    $scope.marcas = brands.Marcas;
  }).catch(function(response){
    $ionicLoading.hide();
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
      $scope.showAlert('fail',response);
    });
  }

  $scope.saveCar = function(){
    if($scope.comprobarAuto()){
      $ionicLoading.show({templateUrl:'templates/enviando.html'});
      if($scope.imgRegAuto !== undefined){
        var tmp = new Date();
        var timestring = ''+tmp.getFullYear()+tmp.getMonth()+tmp.getDay()+tmp.getHours()+tmp.getMinutes()+tmp.getSeconds();
        var publicId = 'vehiculos/'+timestring+'-'+$scope.userId;
        ImageUploadFactory.uploadImage($scope.imgRegAuto, 'yegoapp', publicId).then(function(result){
          $scope.url = result.url;
          $scope.myCar.imageurl = $scope.url;
          $scope.myCar.photoid = 'autos/'+publicId;
          $scope.objV.vehicle = $scope.myCar;
          // Una vez subida la foto, se suben los datos del auto
          AutosData.nuevoAuto($scope.objV).then(function(response){
            UserData.getUserData($scope.$storage.id).then(function(resp){
              $scope.$storage.user = resp;
              $ionicLoading.hide();
            }).catch(function(resp){
              $ionicLoading.hide();
            });
            $state.go('welcome');
          }).catch(function(response){
            $ionicLoading.hide();
          });

        }).catch(function(err) {
          $ionicLoading.hide();
          // Do something with the error here
          $cordovaCamera.cleanup();
        });
      }else{
        $scope.objV.vehicle = $scope.myCar;
        AutosData.nuevoAuto($scope.objV).then(function(response){
          UserData.getUserData($scope.$storage.id).then(function(resp){
            $scope.$storage.user = resp;
            $ionicLoading.hide();
          }).catch(function(resp){
            $ionicLoading.hide();
          });
          $state.go('welcome');
        }).catch(function(response){
          $ionicLoading.hide();
        });
      }
    }
  }

  $scope.comprobarAuto = function(){
    if(
      $scope.myCar.brand !== null ||
      $scope.myCar.model !== null ||
      $scope.myCar.description !== null
    ){
      return true;
    }else{
      return false;
    }
  }

  // función para calcular el tamaño del crop window para jrCrop
  $scope.cropWindowCalculator = function(){
    var cropHeight = Math.round((900*window.innerWidth)/1600);
    var constraints = [window.innerWidth,cropHeight];
    return constraints;
  }

  // función que abre la camara del dispositivo para tomar una foto
  $scope.takePicture = function() {
    var options = {
      quality : 90,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true,
      correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      var constraints =  $scope.cropWindowCalculator();
      $scope.imgRegAuto = "data:image/jpeg;base64," + imageData;
      $jrCrop.crop({
          url: $scope.imgRegAuto,
          width: constraints[0],
          height: constraints[1],
          title: 'Ajusta la Imágen'
      }).then(function(canvas) {
          // success!
          $scope.imgRegAuto = canvas.toDataURL();
      }).catch(function(err) {
          // User canceled or couldn't load image.
          // console.log("couldn't load the image");
          // console.log(err);
      });
    }).catch(function(err) {
      // An error occured. Show a message to the user
      // console.log(err);
    });
  }

  // función que abre la biblioteca fotográfica del dispositivo para tomar una foto
  $scope.selectPicture = function() {
    // console.log('selectPicture()')
    var options = {
      quality : 90,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      var constraints =  $scope.cropWindowCalculator();
      $scope.imgRegAuto = "data:image/jpeg;base64," + imageData;
      $jrCrop.crop({
          url: $scope.imgRegAuto,
          width: constraints[0],
          height: constraints[1],
          title: 'Ajusta la Imágen'
      }).then(function(canvas) {
          // success!
          $scope.imgRegAuto = canvas.toDataURL();
      }).catch(function(err) {
          // User canceled or couldn't load image.
          // console.log("couldn't load the image");
          // console.log(err);
      });
    }).catch(function(err) {
      // An error occured. Show a message to the user
      // console.log(err);
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
