angular.module('starter.perfil.controllers',
['starter.controllers','starter.login.controllers','starter.seguro.controllers',
'ngMap','ngStorage','ng-token-auth','ngCordova','jrCrop'])

// PERFIL CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('PerfilCtrl',
function($state, $scope, $rootScope, $window, $stateParams, $auth, $localStorage,
  $timeout, $ionicModal, $ionicHistory, $ionicLoading, $ionicPopup, $cordovaCamera,
  $jrCrop, UserData, LocationData, ImageUploadFactory) {
  $scope.$storage = $localStorage;
  $scope.usuario = $scope.$storage.user;
  console.log($scope.usuario);
  $scope.userId = $rootScope.userId;
  $scope.carData = {};
  $scope.famData = {};
  $scope.myUser = {};
  $scope.changeCity = false;
  $scope.country = {};
  $scope.state = {};
  $scope.city = {};
  $scope.notImage = 'img/camera.jpg';

  // Se crea el modal de edición de Usuario
  $ionicModal.fromTemplateUrl('templates/perfil/editUser.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.editModal = modal;
  });

  // Abrir modal para editar usuario
  $scope.editUserModal = function(){
    $scope.editModal.show();
  }

  // Cerrar modal para editar usuario
  $scope.cerrarModal = function(){
    $scope.editModal.hide();
  }
  // Editar el usuario
  $scope.editUser = function(){
    $ionicLoading.show({templateUrl:'templates/actualizando.html'});

    if($scope.imgURI !== undefined){
      var tmp = new Date();
      var timestring = ''+tmp.getFullYear()+tmp.getMonth()+tmp.getDay()+tmp.getHours()+tmp.getMinutes()+tmp.getSeconds();
      var publicId = 'usuarios/'+timestring+'-'+$scope.userId;
      console.log('ImageUploadFactory');
        ImageUploadFactory.uploadImage($scope.imgURI, 'perfilyego', publicId).then(function(result){
        console.log(result);
        $scope.url = result.url;
        $scope.myUser.imageurl = $scope.url;
        $scope.myUser.photoid = 'perfil/'+publicId;
        console.log($scope.myUser);
        console.log('updateUser');
        UserData.updateUser($scope.userId, $scope.myUser).then(function(resp){
          console.log('updateUser');
          console.log(resp);
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
      console.log('imgURI undefined');
      console.log($scope.userId);
      console.log($scope.myUser);
      UserData.updateUser($scope.userId, $scope.myUser).then(function(resp){
        console.log('updateUser');
        console.log(resp);
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
    if($scope.changeCity){
      $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
      LocationData.getCountries().then(function(resp){
        $scope.paises = resp;
        $ionicLoading.hide();
      }).catch(function(resp){
        $ionicLoading.hide();
      });
    }
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

  // función para calcular el tamaño del crop window para jrCrop
  $scope.cropWindowCalculator = function(){
    var constraints = [window.innerWidth,window.innerWidth];
    return constraints;
  }

  // Abre la camara para tomar foto
  $scope.takePicture = function() {
    var options = {
      quality : 90,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      correctOrientation:true,
      saveToPhotoAlbum: true,
      cameraDirection: Camera.Direction.FRONT
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      var constraints =  $scope.cropWindowCalculator();
      $scope.imgURI = "data:image/jpeg;base64,"+imageData;
      $jrCrop.crop({
          url: $scope.imgURI,
          width: constraints[0],
          height: constraints[0],
          circle:true,
          title: 'Ajusta la Imágen'
      }).then(function(canvas) {
          // success!
          $scope.imgURI = canvas.toDataURL();
      }, function() {
          // User canceled or couldn't load image.
          console.log("couldn't load the image");
      });

    }, function(err) {
      console.log(err);
    });
  }

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
      $scope.imgURI = "data:image/jpeg;base64," + imageData;
      $jrCrop.crop({
          url: $scope.imgURI,
          width: constraints[0],
          height: constraints[1],
          circle:true,
          title: 'Ajusta la Imágen'
      }).then(function(canvas) {
          // success!
          $scope.imgURI = canvas.toDataURL();
      }, function() {
          // User canceled or couldn't load image.
          console.log("couldn't load the image");
      });
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
    $ionicLoading.show();
    if (!$scope.$storage.guest) {
      $auth.signOut().then(function(resp) {
        // handle success response
        $window.localStorage.clear();
        $ionicHistory.clearCache().then(function() {
          $ionicHistory.clearHistory();
          $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
          $timeout(function () {
            $ionicLoading.hide();
            $state.go('login');
          },500)
        });
      })
      .catch(function(resp) {
        console.log(resp);
        $ionicLoading.hide();
      });
    }else{
      $window.localStorage.clear();
      $localStorage.$reset();
      $ionicHistory.clearCache().then(function() {
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });

        $timeout(function () {
          $state.go('login');
          $ionicLoading.hide();
        },1000)
      });
    }
  };

})// END PERFIL CONTROLLER
//**********



// TEAM CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('TeamCtrl',
function($state, $scope, $rootScope,$stateParams,
  $ionicLoading, $localStorage, $ionicModal, $ionicHistory, $ionicPopup,
  TeamData,UserData) {

  $scope.$storage = $localStorage;
  $scope.userId = $scope.$storage.id;
  $scope.famData = {}
  $scope.team = {};
  $scope.theresTeam =  false;
  $scope.teamData = {};
  $scope.teamData.name = null;
  $scope.myGuest = {};
  $scope.requests = {};

  $ionicLoading.show({templateUrl: 'templates/obteniendo.html'});

  TeamData.getTeam($scope.userId).then(function(response){
    if(response.length == 0){
      $scope.theresTeam = false;
      TeamData.preguntarInvitacion($scope.userId).then(function(response){
        $scope.requests = response;
        $ionicLoading.hide();
      }).catch(function(response){
        console.log(response);
        $ionicLoading.hide();
      });
    }else if (response.length > 0){
      $scope.team = response[0];
      console.log($scope.team);
      $scope.theresTeam = true;
      $ionicLoading.hide();
    }
  }).catch(function(response){
    $ionicLoading.hide();
    console.log(response);
  });

  // Crear nuevo Team
  $scope.newTeam = function(){
    if($scope.teamData.name != null){
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
  $scope.acceptRequest = function(famId,reqId){
    $scope.famData.family_id = famId;
    $ionicLoading.show({templateUrl:'templates/enviando.html'})
    UserData.updateUser($scope.userId,$scope.famData).then(function(response){
      $ionicLoading.hide();
      TeamData.eliminarInvitacion(reqId).then(function(response){
        $state.go('app.team', $stateParams, {reload: true, inherit: false});
      }).catch(function(response){
      });
    }).catch(function(response){
      $ionicLoading.hide();
    })
  }

  // Cargar el modal
  $ionicModal.fromTemplateUrl('templates/team/invitation.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.sendInvitationModal = modal;
  });

  // Cargar el modal de opciones
  $ionicModal.fromTemplateUrl('templates/team/options.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.optionsModal = modal;
  });

  $scope.abrirModal = function(){
    $scope.myGuest.family_id = $scope.team.id;
    $scope.sendInvitationModal.show();
  }
  $scope.cerrarModal  = function(){
    $scope.sendInvitationModal.hide();
  }

  $scope.abrirModalOpciones = function(){
    $scope.myGuest.family_id = $scope.team.id;
    $scope.optionsModal.show();
  }
  $scope.cerrarModalOpciones  = function(){
    $scope.optionsModal.hide();
    $state.go('app.team', $stateParams, {reload: true, inherit: false});
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
    }).catch(function(response){
      $ionicLoading.hide();
    });
  }

  // funcion para comprobar si el usuario es administrador del team yego

  $scope.isTeamAdmin = function(userId){
    if($scope.theresTeam){
      if(userId == $scope.team.administrator.id){
        return true;
      }else{
        return false
      }
    }else{
      return false
    }
  }

  //funcion para eliminar el yego Team si eres administrador
  $scope.eliminarTeam = function(){
    $ionicLoading.show();
    TeamData.eliminarTeam($scope.team).then(function(resp){
      $ionicLoading.hide();
      $scope.showAlertEditable(
        'Yego Team Eliminado','Tu Yego Team ha sido eliminado',true);
    }).catch(function(resp){
      $scope.showAlertEditable(
        'Error','Algo salió mal, intenta más tarde',true);
      console.log(resp);
      $ionicLoading.hide();
    });
  }

  //funcion para abandonar el yego Team
  $scope.abandonarTeam = function(){
    $ionicLoading.show();
    $scope.teamNil = {};
    $scope.teamNil.family_id = null;
    UserData.updateUser($scope.userId,$scope.teamNil).then(function(resp){
      $ionicLoading.hide();
      $scope.showAlertEditable(
        'Saliste del Team','Has abandonado el team, crea uno nuevo o únete a otro',true);
    }).catch(function(resp){
      $scope.showAlertEditable(
        'Error','Algo salió mal, intenta más tarde',true);
      console.log(resp);
      $ionicLoading.hide();
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
   });
  };

  // A confirm dialog
  $scope.showConfirm = function(tipo) {
    if(tipo == 'abandonar'){
      var confirmPopup = $ionicPopup.confirm({
        title: '¿Abandonar '+$scope.team.name+'?',
        template: '¿Estás seguro de querer abandonar este Yego Team?'
      });
    }else{
      var confirmPopup = $ionicPopup.confirm({
        title: '¿Eliminar '+$scope.team.name+'?',
        template: '¿Estás seguro de querer eliminar este Yego Team? Una vez eliminado no se podrán recuperar los datos'
      });
    }
   confirmPopup.then(function(res) {
     if(res) {
       if(tipo == 'abandonar'){
         $scope.abandonarTeam();
       }else{
         $scope.eliminarTeam();
       }
     } else {
     }
   });
  };

  // An alert dialog
  $scope.showAlertEditable = function(msj1,msj2,close) {
    var alertPopup = $ionicPopup.alert({
      title: msj1,
      template: msj2
    });
    alertPopup.then(function(res) {
      if(close){
        $scope.cerrarModalOpciones();
      }
    });
  };

})// END TEAM CONTROLLER
//**********
;
