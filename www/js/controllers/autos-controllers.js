 angular.module('starter.autos.controllers',
['starter.controllers','starter.login.controllers','starter.seguro.controllers',
'starter.autos.controllers',
'ngMap','ngStorage','ng-token-auth','ngCordova'])

// AUTOS CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('AutosCtrl',
function($state, $scope, $window, $rootScope, $stateParams,
  $ionicLoading, $localStorage, $ionicModal, $ionicHistory, $auth,
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
  $scope.marcas = [];
  $scope.modelos = [];
  $scope.descripciones = [];
  $scope.objV = {};
  $scope.objV.vehicle={};
  $scope.myCar = {};
  $scope.allCars = {};


  $ionicLoading.show({templateUrl:'templates/obteniendo.html'});

  //obtener todos los autos del usuario
  AutosData.getMisAutos($scope.usrId,usrUid).then(function(resp){
    $scope.allCars = resp;
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
          $scope.myCar.imageurl = $scope.url;
          $scope.myCar.photoid = publicId;
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

  $scope.takePicture = function() {
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

    $cordovaCamera.getPicture(options).then(function(imageData) {
      console.log(options)
      // console.log(imageData)
      $scope.imgURI2 = "data:image/jpeg;base64," + imageData;
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
      $scope.imgURI2 = "data:image/jpeg;base64," + imageData;
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
function($state, $stateParams, $scope, $rootScope, $window, NgMap,
  $ionicLoading, $localStorage, $ionicModal, $ionicHistory, $ionicPopup,
  $auth, AutosData,TeamData) {

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
  $scope.principal;
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
        console.log(resp);
        $ionicLoading.hide();
      }).catch(function(resp){
        console.log(resp);
        $ionicLoading.hide();
      });
    }
  }
  $scope.changePrincipal = function(principal){
    console.log(principal);
    if (principal){
      $scope.myCar.main = 1;
      $scope.myCar.driver_id = $scope.usrId;
      console.log($scope.theCar.imageurl);
      console.log($scope.$storage.user.driver_of_vehicles[0].imageurl);
      $scope.$storage.user.driver_of_vehicles[0].imageurl = $scope.theCar.imageurl;
      console.log($scope.$storage.user.driver_of_vehicles[0].imageurl);
    }else{
      $scope.myCar.main = 0;
    }
  }

  $scope.updateCar = function(){
    $scope.objV.vehicle = $scope.myCar;
    console.log($scope.objV);
    $ionicLoading.show({templateUrl:'templates/enviando.html'});

    // AutosData.nuevoAuto($scope.usrId,$scope.myCar).then(function(response){ //ORIGINAL
    AutosData.editarAuto($scope.objV).then(function(response){ // PRUEBA
      AutosData.getTheCarFromUrl($rootScope.userId,$scope.myCar.id).then(function(response){
        AutosData.setTheCar(response);
        $ionicLoading.hide();
        $scope.editCarModal.hide();
        $state.go('app.autoSingle', $stateParams, {reload: true, inherit: false});
      }).catch(function(response){

      });
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });
  }

  // A confirm dialog
  $scope.deleteCarConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
     title: '¿Eliminar '+$scope.theCar.description+' '+$scope.theCar.model+'?',
     template: 'Una vez eliminado no se podra acceder al automovil ni a los servicios relacionados.'
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

})// END AUTOS SINGLE CONTROLLER
//**********
;
