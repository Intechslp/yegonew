angular.module('starter.perfil.controllers',
['starter.controllers','starter.login.controllers','starter.seguro.controllers',
'ngMap','ngStorage','ng-token-auth','ngCordova'])

// PERFIL CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('PerfilCtrl',
function($state, $scope, $rootScope, $window, NgMap, $auth, $localStorage,
  $ionicModal, $ionicHistory, $ionicLoading, $ionicPopup, UserData) {
  $scope.$storage = $localStorage;
  $scope.usuario = $scope.$storage.user;
  $scope.userId = $rootScope.userId;
  console.log($scope.usuario);
  $scope.carData = {};
  $scope.famData = {};
  $scope.myUser = {};

  // Se crea el modal de edición de Usuario
  $ionicModal.fromTemplateUrl('templates/perfil/editUser.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.editModal = modal;
  });

  // Abrir modal para editar usuario
  $scope.editUserModal = function(){
    $scope.editModal.show()
  }

  // Cerrar modal para editar usuario
  $scope.cerrarModal = function(){
    $scope.editModal.hide();
  }
  // Editar el usuario
  $scope.editUser = function(){
    $ionicLoading.show({templateUrl:'templates/enviando.html'});
    UserData.updateUser($scope.userId, $scope.myUser).then(function(resp){
      console.log(resp);
      $scope.$storage.user.name= $scope.myUser.name;
      $scope.$storage.user.lastnames= $scope.myUser.lastnames;
      $rootScope.usuario = $scope.$storage.user;
      $ionicLoading.hide();
    }).catch(function(resp){
      console.log(resp);
      $ionicLoading.hide();
    });
  }

  // Abre la camara para tomar foto
  $scope.takePicture = function() {
    console.log('takePicture()')
    var options = {
      quality : 70,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      console.log(options)
      // console.log(imageData)
      $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // An error occured. Show a message to the user
    });
  }


  $scope.signOutClick = function() {
    console.log('botón de cerrar Sesion');
    $ionicLoading.show();
    $auth.signOut()
      .then(function(resp) {
        // handle success response
        console.log(resp);
        console.log("adiós sesión jajajajaja >:)");
        $ionicLoading.hide();
        $window.localStorage.clear();
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $state.go('login');
      })
      .catch(function(resp) {
        // handle error response
        console.log(resp);
        console.log("cerrar Sesión incorrecto");
        $ionicLoading.hide();
      });
  };

})// END PERFIL CONTROLLER
//**********
;
