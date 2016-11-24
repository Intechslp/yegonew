angular.module('starter.perfil.controllers',
['starter.controllers','starter.login.controllers','starter.seguro.controllers',
'ngMap','ngStorage','ng-token-auth','ngCordova'])

// PERFIL CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('PerfilCtrl',
function($state, $scope, $rootScope, $window, $stateParams, $auth, $localStorage,
  $ionicModal, $ionicHistory, $ionicLoading, $ionicPopup,$cordovaCamera,
  UserData, LocationData, ImageUploadFactory) {
  $scope.$storage = $localStorage;
  $scope.usuario = $scope.$storage.user;
  $scope.userId = $rootScope.userId;
  console.log($scope.usuario);
  $scope.carData = {};
  $scope.famData = {};
  $scope.myUser = {};
  $scope.changeCity = false;
  $scope.country = {};
  $scope.state = {};
  $scope.city = {};

  if($scope.$storage.usrImg !== undefined){
    console.log('undefined usrImg');
    $scope.imgURI = $scope.$storage.usrImg
  }
  if($scope.$storage.usrImg !== null){
    console.log('null usrImg');
    $scope.imgURI = $scope.$storage.usrImg
  }
  if($scope.$storage.vehicImg != null){
    $scope.imgURI2 = $scope.$storage.vehicImg;
  }


  // Se crea el modal de edición de Usuario
  $ionicModal.fromTemplateUrl('templates/perfil/editUser.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.editModal = modal;
  });

  // Abrir modal para editar usuario
  $scope.editUserModal = function(){
    console.log($scope.changeCity);
    $scope.editModal.show();
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    LocationData.getCountries().then(function(resp){
      $scope.paises = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      $ionicLoading.hide();
    });
  }

  // Cerrar modal para editar usuario
  $scope.cerrarModal = function(){
    $scope.editModal.hide();
  }
  // Editar el usuario
  $scope.editUser = function(){
    $ionicLoading.show({templateUrl:'templates/enviando.html'});

    if($scope.imgURI !== undefined){
      ImageUploadFactory.uploadImage($scope.imgURI, 'perfilyego').then(function(result){
        $scope.url = result.url;
        $scope.myUser.imageurl = $scope.url;
        UserData.updateUser($scope.userId, $scope.myUser).then(function(resp){
          //obtener información actualizada del usuario
          $scope.$storage.user = resp;
          $rootScope.user = resp;
          $ionicLoading.hide();
          $scope.cerrarModal();
          $state.go('app.perfil', $stateParams, {reload: true, inherit: false});
        }).catch(function(resp){
          console.log(resp);
          $scope.showAlert2();
        });
      }).catch(function(err) {
        $ionicLoading.hide();
        // Do something with the error here
        console.log(err);
        $cordovaCamera.cleanup();
      });
    }else if ($scope.imgURI === undefined) {
      UserData.updateUser($scope.userId, $scope.myUser).then(function(resp){
        //obtener información actualizada del usuario
        $scope.$storage.user = resp;
        $rootScope.user = resp;
        $ionicLoading.hide();
        $scope.cerrarModal();
        $state.go('app.perfil', $stateParams, {reload: true, inherit: false});
      }).catch(function(resp){
        console.log(resp);
        $scope.showAlert2();
      });
    }
  }

  // Muestra las opciones para cambiar la ciudad
  $scope.theChange = function(){
    $scope.changeCity = !$scope.changeCity;
  }
  // Manda llamar los estados en función del país
  $scope.loadStates = function(paisId){
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    LocationData.getStates(paisId).then(function(resp){
      $scope.estados = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      $ionicLoading.hide();
    });
  }

  // Manda llamar las ciudades en función del estado
  $scope.loadCities = function(paisId,estadoId){
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    LocationData.getCities(paisId,estadoId).then(function(resp){
      $scope.ciudades = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
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


  $scope.showAlert2 = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Algo salió mal',
      template: 'Algo ocurrió mientras intentabamos recuperar tus datos, intenta más tarde'
    });
  };


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



// TEAM CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('TeamCtrl',
function($state, $scope, $rootScope,$stateParams,
  $ionicLoading, $localStorage, $ionicModal, $ionicHistory, $ionicPopup,
  TeamData,UserData) {

  $scope.userId = $rootScope.userId;
  $scope.famData = {}
  $scope.team = {};
  $scope.theresTeam =  false;
  $scope.teamData = {};
  $scope.teamData.name = null;
  $scope.myGuest = {};
  $scope.requests = {};

  $ionicLoading.show({templateUrl: 'templates/obteniendo.html'});

  TeamData.getTeam($scope.userId).then(function(response){
    console.log(response);
    if(response.length == 0){
      $scope.theresTeam = false;
      console.log('There\'s a team: '+$scope.theresTeam);
      TeamData.preguntarInvitacion($scope.userId).then(function(response){
        console.log(response);
        $scope.requests = response;
        $ionicLoading.hide();
      }).catch(function(response){
        console.log(response);
        $ionicLoading.hide();
      });

    }else if (response.length > 0){
      $scope.team = response[0];
      console.log('Team id: '+$scope.team.id)
      $scope.theresTeam = true;
      $ionicLoading.hide();
    }
  }).catch(function(response){
    $ionicLoading.hide();
    console.log(response);
  });

  // Crear nuevo Team
  $scope.newTeam = function(){
    if($scope.teamData.name !== null){
      $ionicLoading.show({templateUrl:'templates/enviando.html'});
      TeamData.crearTeam($scope.teamData).then(function(response){
        $state.go('app.team', $stateParams, {reload: true, inherit: false})
        $ionicLoading.hide();
      }).catch(function(response){
        console.log(response);
        $ionicLoading.hide();
      })
    }else{
      $scope.showAlert();
    }
  }

  //Aceptar petición para ser parte de un Team
  $scope.acceptRequest = function(famId){
    $scope.famData.family_id = famId;
    $ionicLoading.show({templateUrl:'templates/enviando.html'})
    UserData.updateUser($scope.userId,$scope.famData).then(function(response){

      TeamData.eliminarInvitacion(famId).then(function(response){
        console.log('lo logramos lo eliminamos!');
        console.log(response)
      }).catch(function(response){
        console.log('no lo logramos, no se eliminó :(');
        console.log(response)
      });

    }).catch(function(response){
      console.log(response);
    })
  }

  // Cargar el modal
  $ionicModal.fromTemplateUrl('templates/team/invitation.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.sendInvitationModal = modal;
  });

  $scope.abrirModal = function(){
    $scope.myGuest.family_id = $scope.team.id;
    $scope.sendInvitationModal.show();
  }

  $scope.cerrarModal  = function(){
    $scope.sendInvitationModal.hide();
  }

  // An alert dialog
  $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Error',
     template: 'Asegurate de ponerle un nombre a tu Yego® Team'
   });
  };

  $scope.sendInvitation = function(){
    $ionicLoading.show({templateUrl:'templates/enviando.html'})
    TeamData.enviarInvitacion($scope.myGuest).then(function(response){
      $ionicLoading.hide();
      $scope.showAlertSuccess();
      console.log(response);
    }).catch(function(response){
      $ionicLoading.hide();
      console.log(response);
    });
  }

  // An alert dialog
  $scope.showAlertSuccess = function() {
   var alertPopup = $ionicPopup.alert({
     title: '¡Genial!',
     template: 'Tu invitación a sido enviada'
   });
   alertPopup.then(function(res) {
     $scope.sendInvitationModal.hide();
     console.log('ayossss');
   });
  };

})// END TEAM CONTROLLER
//**********
;
