 angular.module('starter.autos.controllers',
['starter.controllers','starter.login.controllers','starter.seguro.controllers',
'starter.autos.controllers',
'ngMap','ngStorage','ng-token-auth','ngCordova'])

// AUTOS CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('AutosCtrl',
function($state, $scope, $window, $rootScope, $stateParams, $timeout,
  $ionicLoading, $localStorage, $ionicModal, $ionicHistory, $auth, $jrCrop,
  SegurosData, AutosData, UserData, TeamData, $cordovaCamera, ImageUploadFactory) {

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
  $scope.usrId = $scope.$storage.id;
  var usrUid = $scope.$storage.headers.uid;
  $scope.theresCars = false;
  $scope.marcas = [];
  $scope.modelos = [];
  $scope.descripciones = [];
  $scope.objV = {};
  $scope.objV.vehicle={};
  $scope.myCar = {};
  $scope.allCars = [];


  $ionicLoading.show({templateUrl:'templates/obteniendo.html'});

  var misautos_to = $timeout(function(){
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

  //obtener todos los autos del usuario
  AutosData.getMisAutos($scope.usrId,usrUid).then(function(resp){
    $timeout.cancel(misautos_to);
    $scope.allCars = resp;
    $scope.$storage.user.driver_of_vehicles = resp;
    if($scope.allCars.length > 0){
      $scope.theresCars = true;
    }
    $ionicLoading.hide();
  }).catch(function(resp){
    console.log(resp);
    $ionicLoading.hide();
  });

  // Cargar el modal
  $ionicModal.fromTemplateUrl('templates/autos/newCar.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.newCarModal = modal;
  });

  $scope.newCar = function(){
    $scope.newCarModal.show();
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});

    SegurosData.getMarcas().then(function(response){
      $ionicLoading.hide();
      var brands = JSON.parse(response);
      $scope.marcas = brands.Marcas;
    }).catch(function(response){
      $ionicLoading.hide();
      console.log(response);
      $ionicLoading.hide();
      $scope.showAlert('fail',response);
    });
  }

  $scope.cerrarModal =  function(){
    $scope.newCarModal.hide();
    $state.go('app.autos', $stateParams, {reload: true, inherit: false});
  }

  $scope.saveCar = function(){
    if($scope.comprobarAuto()){
      $ionicLoading.show({templateUrl:'templates/enviando.html'});
      if($scope.imgURI2 !== undefined){
        var tmp = new Date();
        var timestring = ''+tmp.getFullYear()+tmp.getMonth()+tmp.getDay()+tmp.getHours()+tmp.getMinutes()+tmp.getSeconds();
        var publicId = 'vehiculos/'+timestring+'-'+$scope.userId;
        ImageUploadFactory.uploadImage($scope.imgURI2, 'yegoapp',publicId).then(function(result){
          $scope.url = result.url;
          $scope.myCar.main = $scope.principal;
          $scope.myCar.imageurl = $scope.url;
          $scope.myCar.photoid = 'autos/'+publicId;
          $scope.objV.vehicle = $scope.myCar;
          AutosData.nuevoAuto($scope.objV).then(function(response){ //ORIGINAL
            $ionicLoading.hide();
            $cordovaCamera.cleanup();
            $scope.cerrarModal();
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
        $scope.objV.vehicle = $scope.myCar;
        AutosData.nuevoAuto($scope.objV).then(function(response){ //ORIGINAL
          $ionicLoading.hide();
          $cordovaCamera.cleanup();
          $scope.cerrarModal();
        }).catch(function(response){
          console.log(response);
          $ionicLoading.hide();
        });
      }
    }else{
      $scope.showAlert(
        'Error',
        'Debes de llenar al menos los campos requeridos (*)'
      );
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

  $scope.goForModels = function(brand){
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    SegurosData.getModelos(brand).then(function(response){
      $ionicLoading.hide();
      var models = JSON.parse(response);
      $scope.modelos = models.Modelos;
    }).catch(function(response){
      $ionicLoading.hide();
      console.log(response);
      // $scope.showAlert('fail',response);
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
      // $scope.showAlert('fail',response);
    });
  }

// función para calcular el tamaño del crop window para jrCrop
  $scope.cropWindowCalculator = function(){
    var cropHeight = Math.round((900*window.innerWidth)/1600);
    var constraints = [window.innerWidth,cropHeight];
    return constraints;
  }

// función de prueba para debuguear la proporción de la camara
//  $scope.pruebaImagen = function(){
//    var constraints =  $scope.cropWindowCalculator();
//    $jrCrop.crop({
//        url: 'http://res.cloudinary.com/omakase/image/upload/v1485138935/autos/vehiculos/201700203532-41.jpg',
//        width: constraints[0],
//        height: constraints[1],
//        title: 'Ajusta la Imágen'
//    }).then(function(canvas) {
//        // success!
//        var imagen = canvas.toDataURL();
//    }, function() {
//        // User canceled or couldn't load image.
//        console.log("not cropped");
//    });
//  }

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
      $scope.imgURI2 = "data:image/jpeg;base64," + imageData;
      $jrCrop.crop({
          url: $scope.imgURI2,
          width: constraints[0],
          height: constraints[1],
          title: 'Ajusta la Imágen'
      }).then(function(canvas) {
          // success!
          $scope.imgURI2 = canvas.toDataURL();
      }, function() {
          // User canceled or couldn't load image.
          console.log("couldn't load the image");
      });
    }, function(err) {
      // An error occured. Show a message to the user
    });
  }

// función que abre la biblioteca fotográfica del dispositivo para tomar una foto
  $scope.selectPicture = function() {
    var options = {
      quality : 90,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      var constraints =  $scope.cropWindowCalculator();
      $scope.imgURI2 = "data:image/jpeg;base64," + imageData;
      $jrCrop.crop({
          url: $scope.imgURI2,
          width: constraints[0],
          height: constraints[1],
          title: 'Ajusta la Imágen'
      }).then(function(canvas) {
          // success!
          $scope.imgURI2 = canvas.toDataURL();
      }, function() {
          // User canceled or couldn't load image.
          console.log("couldn't load the image");
      });
    }, function(err) {
      // An error occured. Show a message to the user
    });
  }

  $scope.goSingleCar = function(car){
    AutosData.setTheCar(car);
    $state.go('app.autoSingle',{autoId:car.id});
  }

  $scope.showAlert = function(msj1,msj2) {
    var alertPopup = $ionicPopup.alert({
     title: msj1,
     template: msj2
    });
  }
})// END AUTOS CONTROLLER
//**********


// AUTOS SINGLE CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('AutoSingleCtrl',
function($state, $stateParams, $scope, $rootScope, $window, $jrCrop,
  $ionicLoading, $localStorage, $ionicModal, $ionicHistory, $ionicPopup,
  $auth, $cordovaCamera, AutosData,TeamData, ImageUploadFactory) {

  $scope.usrId = $rootScope.userId;
  $scope.teamId = $rootScope.user.family_id;
  var autoId = $stateParams.autoId;

  if ($ionicHistory.backView() != null) {
    var sourceState = $ionicHistory.backView().stateId;
  }else{
    var sourceState = 'none';
  }
  console.log(sourceState);
  if(sourceState !== 'app.autos'){
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    AutosData.getTheCarFromUrl($scope.usrId,autoId).then(function(response){
      $scope.theCar = response;
      $ionicLoading.hide();
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });
  }else{
    $scope.theCar = AutosData.getTheCar();
    console.log($scope.theCar);
  }
  $scope.carId = $stateParams.id;
  $scope.principal = $scope.theCar.main;
  $scope.changeDriver = false;
  $scope.objV = {};
  $scope.objV.vehicle = {};
  $scope.myCar = {};

  // Cargar el modal
  $ionicModal.fromTemplateUrl('templates/autos/editCar.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.editCarModal = modal;
  });

  $scope.editCar = function(){
    $scope.editCarModal.show();
  }

  $scope.cerrarModal = function(){
    $scope.editCarModal.hide();
  }
  $scope.theChange = function(){
    $scope.changeDriver = !$scope.changeDriver;
    if ($scope.changeDriver) {
      $ionicLoading.show({templateUrl:'templates/obteniendo.html'})
      TeamData.getTeam($scope.teamId).then(function(resp){
        $scope.teammates = resp[0].app_users;
        $ionicLoading.hide();
      }).catch(function(resp){
        console.log(resp);
        $ionicLoading.hide();
      });
    }
  }
  $scope.changePrincipal = function(boolean){
    console.log('changePrincipal()');
    console.log(boolean);
    if (boolean){
      $scope.principal = true;
      $scope.myCar.driver_id = $scope.usrId;
      console.log($scope.theCar.imageurl);
      console.log($scope.$storage.user.driver_of_vehicles[0].imageurl);
      $scope.$storage.user.driver_of_vehicles[0].imageurl = $scope.theCar.imageurl;
      console.log($scope.$storage.user.driver_of_vehicles[0].imageurl);
    }else{
      $scope.principal = false;
    }
  }

  // A confirm dialog
  $scope.deleteCarConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
     title: '¿Eliminar '+$scope.theCar.description+' '+$scope.theCar.model+'?',
     template: 'Una vez eliminado no se podrá acceder al automóvil ni a los servicios relacionados, como seguros y recargas de gasolina, y esta información no podrá ser recuperada.'
    });

    confirmPopup.then(function(res) {
     if(res) {
       console.log('adios carrito');
       $scope.deleteCar();
     } else {
       console.log('dice mi mamá que siempre no :3');
     }
    });
  };

  $scope.deleteCar = function(){
    $ionicLoading.show({templateUrl:'templates/eliminando.html'});
    AutosData.borrarAuto($scope.theCar).then(function(response){
      console.log(response);
      $ionicLoading.hide();
      $state.go('app.autos', $stateParams, {reload: true, inherit: false});
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });
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
      $scope.imgURI2 = "data:image/jpeg;base64," + imageData;
      $jrCrop.crop({
          url: $scope.imgURI2,
          width: constraints[0],
          height: constraints[1],
          title: 'Ajusta la Imágen'
      }).then(function(canvas) {
          // success!
          $scope.imgURI2 = canvas.toDataURL();
      }).catch(function(err) {
          // User canceled or couldn't load image.
          console.log("couldn't load the image");
          console.log(err);
      });
    }).catch(function(err) {
      // An error occured. Show a message to the user
      console.log(err);
    });
  }

  // función que abre la biblioteca fotográfica del dispositivo para tomar una foto
  $scope.selectPicture = function() {
    console.log('selectPicture()')
    var options = {
      quality : 90,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      var constraints =  $scope.cropWindowCalculator();
      $scope.imgURI2 = "data:image/jpeg;base64," + imageData;
      $jrCrop.crop({
          url: $scope.imgURI2,
          width: constraints[0],
          height: constraints[1],
          title: 'Ajusta la Imágen'
      }).then(function(canvas) {
          // success!
          $scope.imgURI2 = canvas.toDataURL();
      }).catch(function(err) {
          // User canceled or couldn't load image.
          console.log("couldn't load the image");
          console.log(err);
      });
    }).catch(function(err) {
      // An error occured. Show a message to the user
      console.log(err);
    });
  }

  $scope.updateCar = function(){
    $ionicLoading.show({templateUrl:'templates/actualizando.html'});
    if($scope.imgURI2 !== undefined){
      console.log('IMG defined');
      var tmp = new Date();
      var timestring = ''+tmp.getFullYear()+tmp.getMonth()+tmp.getDay()+tmp.getHours()+tmp.getMinutes()+tmp.getSeconds();
      var publicId = 'vehiculos/'+timestring+'-'+$scope.userId;
      ImageUploadFactory.uploadImage($scope.imgURI2, 'yegoapp',publicId).then(function(result){
        console.log('Imagen subida con éxito');
        $scope.url = result.url;
        $scope.myCar.imageurl = $scope.url;
        $scope.myCar.photoid = 'autos/'+publicId;
        $scope.myCar.main = $scope.principal;
        console.log('before Update: '+$scope.myCar.main);
        $scope.objV.vehicle = $scope.myCar;
        console.log($scope.objV);
        AutosData.editarAuto($scope.objV).then(function(response){
          AutosData.getTheCarFromUrl($rootScope.userId,$scope.myCar.id).then(function(response){
            console.log('after Update: '+response.main);
            AutosData.setTheCar(response);
            $ionicLoading.hide();
            $cordovaCamera.cleanup();
            $scope.editCarModal.hide();
            $state.go('app.autoSingle', $stateParams, {reload: true, inherit: false});
          }).catch(function(response){
            console.log(response)
          });
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
      console.log('IMG undefined');
      $scope.myCar.main = $scope.principal;
      console.log('before Update: '+$scope.myCar.main);
      $scope.objV.vehicle = $scope.myCar;
      console.log($scope.objV);
      AutosData.editarAuto($scope.objV).then(function(response){
        AutosData.getTheCarFromUrl($rootScope.userId,$scope.myCar.id).then(function(response){
          console.log('after Update: '+response.main);
          AutosData.setTheCar(response);
          $ionicLoading.hide();
          $scope.editCarModal.hide();
          $state.go('app.autoSingle', $stateParams, {reload: true, inherit: false});
        }).catch(function(response){
          console.log(response)
        });
      }).catch(function(response){
        console.log(response);
        $ionicLoading.hide();
      });
    }

  }

})// END AUTOS SINGLE CONTROLLER
//**********
;
