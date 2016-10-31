angular.module('starter.controllers',
['starter.perfil.controllers','starter.login.controllers','starter.seguro.controllers',
'ngMap','ngStorage','ng-token-auth','ngCordova'])

// APP CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('AppCtrl',
function($scope, $rootScope, $filter, $ionicModal, $timeout,$state,$ionicHistory, $localStorage) {

  /*
  With the new view caching in Ionic, Controllers are only called
  when they are recreated or on app start, instead of every page change.
  To listen for when this page is active (for example, to refresh data),
  listen for the $ionicView.enter event:
  $scope.$on('$ionicView.enter', function(e) {
  });
  */

  $scope.$storage = $localStorage;
  $scope.perfil = $scope.$storage.user;
  $rootScope.userId = $scope.$storage.id;

  $rootScope.usuario = $scope.$storage.user;
  console.log($scope.usuario);

  $scope.changeTab = function(state){
    $state.go(state);
    $ionicHistory.nextViewOptions({
      disableBack: true,
      disableAnimate: true
    });
  }

}) // END APP CONTROLLER
//**********


// DIRECTORIO CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('DirectorioCtrl', function($scope, $state, $filter, NegociosData, $ionicLoading, $ionicPopup, $localStorage, EstablecimientosData) {
  $scope.$storage = $localStorage;
  $scope.tabsState = true;
  $scope.closeBtn = false;
  $scope.searchList = false;
  // $scope.names=$scope.datapointsList ;
  $scope.adn = {};
	$scope.srchchange = function () {
    console.log('search changed');
    $scope.searchList = false;
    $scope.names = null;
    var filtervalue = [];
		var serachData=$scope.negocios;
		//console.log(serachData);
    for (var i = 0; i <serachData.length; i++) {
      var fltvar = $filter('uppercase')($scope.adn.item);
      var jsval = $filter('uppercase')(serachData[i].name);
      if (jsval.indexOf(fltvar) >= 0) {
          filtervalue.push(serachData[i]);
      }
    }
    // console.log("last");
    //console.log(filtervalue);
    $scope.names = filtervalue;
    $scope.searchList = true;
    console.log("srchchange searchList = "+$scope.searchList);

  };

  $scope.ressetserach = function () {
    $scope.searchList=false;
    console.log("ressetserach searchList = "+$scope.searchList);
    $scope.adn.item = "";
    $scope.names = $scope.negocios;
  }

  $ionicLoading.show({templateUrl:'templates/obteniendo.html'});

  EstablecimientosData.getCategorias().then(function(response){
    $scope.categories = response;
    console.log($scope.categories);
    $ionicLoading.hide();
  }).catch(function(response){
    console.log(response);
    $ionicLoading.hide();
  });

  if($scope.$storage.subcats === undefined){
    $scope.subcats = {};
    // console.log('undefined');
  }else{
    $scope.subcats = $scope.$storage.subcats;
    // console.log('defined');
    // console.log($scope.subcats);

  }

  $scope.goCategory = function(id,name){
    console.log('goCategory('+id+','+name+')');
    $scope.category = id;
    $scope.the_cat = $filter('filter')($scope.categories,{id:$scope.category});
    $scope.subcats = $scope.the_cat[0].subcategories;
    EstablecimientosData.setSubcategorias($scope.subcats);
    $state.go('app.dirCat',{catName: name});
  }

  $scope.showAlert = function(res, response) {
    var alertPopup = $ionicPopup.alert({
      title: 'Ups!',
      template: 'Hubo un error accediendo a la base de datos'
    });

    alertPopup.then(function(res) {
      //console.log('Thank you for not eating my delicious ice cream cone');
    });
  };

})// END DIRECTORIO CONTROLLER
//**********

// DIRECTORIO CAT CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('DirCatCtrl', function($state, $scope, $rootScope, $stateParams, NgMap, $ionicLoading, $localStorage,EstablecimientosData) {
  $scope.catName = $stateParams.catName;
  $scope.subcats = EstablecimientosData.getSubcategorias();
  $scope.goList = function(id){
    EstablecimientosData.setList(id);
  }
})//END DIRECTORIO CAT CONTROLLER
//**********

// DIRECTORIO LISTA CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('DirListCtrl', function($state, $scope, $stateParams, $ionicLoading, EstablecimientosData) {
  $ionicLoading.show();
  $scope.negocios = {};
  var subcat = $stateParams.subcatId;
  $scope.subcatName = $stateParams.subcatName;
  EstablecimientosData.getEstablecimientos(subcat).then(function(response){
    $scope.negocios= response;
    $ionicLoading.hide();
  }).catch(function(response){
    $ionicLoading.hide();
  });
  $scope.lol = function(lol){
    // console.log(lol);
    $state.go('app.dirSingle',{singleId:lol});
  }

})//END DIRECTORIO LISTA CONTROLLER
//**********


// DIRECTORIO SINGLE CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('DirSingleCtrl', function($state, $scope, $stateParams, $ionicLoading, EstablecimientosData) {
  // console.log('DirSingleCtrl');
  $ionicLoading.show();
  $scope.single = {};
  var singleId = $stateParams.singleId;
  // console.log($stateParams);
  EstablecimientosData.getSingle(singleId).then(function(response){
    $ionicLoading.hide();
    console.log(response);
    $scope.single = response;
  }).catch(function(response){
    $ionicLoading.hide();
    console.log(response);
  });
})//END DIRECTORIO SINGLE CONTROLLER
//**********


// CERCA DE MI CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('CercaCtrl', function($state, $scope, $rootScope, $stateParams, NgMap, $ionicLoading) {
  $ionicLoading.show();
  NgMap.getMap().then(function(map) {
    $scope.map = map;
    $ionicLoading.hide();
  });
  $scope.callbackFunc = function(param) {
    $scope.myself = $scope.map.getCenter();
  };
  $scope.markers = [
    {title:'Omakase',pos:[22.153145, -100.994635]},
    {title:'Tequisquiapan',pos:[22.150601, -100.992575]},
    {title:'Banorte',pos:[22.150233, -100.995128]}
  ];
})// END CERCA DE MI CONTROLLER
//**********


// GUIA DE PRECIOS CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('GuiaCtrl', function($state, $scope, $rootScope, $stateParams, NgMap, $ionicLoading, $ionicNavBarDelegate) {

})//END GUIA DE PRECIOS CONTROLLER
//**********


// CUPONERA CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('CuponeraCtrl', function($state, $scope, $rootScope, $stateParams, $ionicLoading, $ionicNavBarDelegate, $ionicPopup, CuponesData) {
  $ionicLoading.show();
  CuponesData.getCupones().then(function(response){
    $scope.cupones = response;
    console.log($scope.cupones);
    $ionicLoading.hide();
  }).catch(function(response){
    $ionicLoading.hide();
    console.log(response);
    $scope.showAlert();
  });
  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Ups!',
      template: 'Hubo un error accediendo a la base de datos'
    });

    alertPopup.then(function(res) {
      // console.log('Thank you for not eating my delicious ice cream cone');
    });
  };
})//END CUPONERA CONTROLLER
//**********


// AUTOS CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('AutosCtrl',
function($state, $scope, $window,
  $ionicLoading, $localStorage, $ionicModal, $ionicHistory, $auth,
  SegurosData, AutosData,UserData, $cordovaCamera/*, ImageUploadService*/) {

  $scope.$storage = $localStorage;

  $scope.usrId = $scope.$storage.id;
  var usrUid = $scope.$storage.headers.uid;
  $scope.marcas = [];
  $scope.modelos = [];
  $scope.descripciones = [];

  $scope.myCar = {};
  $scope.allCars = {};

  $scope.pruebaCar={
    brand: "CHEVROLET",
    model: "2016",
    description: "AVEO",
    owner_id: 1
  }

  $ionicLoading.show({templateUrl:'templates/obteniendo.html'});

  //obtener todos los autos del usuario
  AutosData.getMisAutos($scope.usrId,usrUid).then(function(resp){
    $scope.allCars = resp;
    console.log(resp);
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
  }

  $scope.saveCar = function(){
    $ionicLoading.show({templateUrl:'templates/enviando.html'});
    // $scope.$storage.car = {marca: $scope.myCar.marca, modelo: $scope.myCar.modelo, descripcion: $scope.myCar.descripcion};
    // console.log($scope.imgURI);

    // ImageUploadService.uploadImage($scope.imgURI).then(function(result){
    //   console.log('ImageUploadService().then');
    //   var url = result.secure_url || '';
    //   var urlSmall;
    //   if(result && result.eager[0]){
    //     urlSmall = result.eager[0].secure_url;
    //   }else{
    //     urlSmall = '';
    //   }
    //   console.log('urlSmall: '+urlSmall);
    //   // Do something with the results here.
    //   console.log(result);
    //   $cordovaCamera.cleanup();
    // }).catch(function(err) {
    //   console.log('ImageUploadService().catch');
    //   // Do something with the error here
    //   console.log(err);
    //   $cordovaCamera.cleanup();
    // });
    AutosData.nuevoAuto($scope.myCar).then(function(response){ //ORIGINAL
    // AutosData.nuevoAuto($scope.pruebaCar).then(function(response){ // PRUEBA
      console.log(response);
      $ionicLoading.hide();
      $scope.newCarModal.hide();
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });
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
      // targetWidth: 300,
      // targetHeight: 300,
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

  $scope.selectPicture = function() {
    console.log('takePicture()')
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
      $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // An error occured. Show a message to the user
    });
  }

  $scope.goSingleCar = function(car){
    AutosData.setTheCar(car);
    $state.go('app.autoSingle',{autoId:car.id});
  }
})// END AUTOS CONTROLLER
//**********


// AUTOS SINGLE CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('AutoSingleCtrl',
function($state, $stateParams, $scope, $rootScope, $window, NgMap,
  $ionicLoading, $localStorage, $ionicModal, $ionicHistory, $ionicPopup,
  $auth, AutosData) {

  $scope.usrId = $rootScope.userId;
  var autoId = $stateParams.autoId;

  if ($ionicHistory.backView() != null) {
    var sourceState = $ionicHistory.backView().stateId;
  }else{
    var sourceState = 'none';
  }

  if(sourceState !== 'app.autos'){
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    AutosData.getTheCarFromUrl($scope.usrId,autoId).then(function(response){
      $scope.theCar = response;
      console.log(response);
      $ionicLoading.hide();
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });
  }else{
    $scope.theCar = AutosData.getTheCar();
  }

  console.log("AutoSingleCtrl User id:"+$rootScope.userId);
  $scope.carId = $stateParams.id;
  $scope.changeDriver = false;
  $scope.conductores = [
    {id: 1,name:"Armando Godinez"},
    {id: 2,name:"Gilberto Sosa"},
    {id: 3,name:"Alejandro Toro"},
    {id: 4,name:"Asaf López"}];
  $scope.myCar = {};

  // Cargar el modal
  $ionicModal.fromTemplateUrl('templates/autos/editCar.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.editCarModal = modal;
  });

  $scope.editCar = function(){
    $scope.theCar.driver = {};
    $scope.theCar.driver.name = "Asaf López";
    $scope.editCarModal.show();
  }

  $scope.cerrarModal = function(){
    $scope.editCarModal.hide();
  }
  $scope.theChange = function(){
    $scope.changeDriver = !$scope.changeDriver;
  }

  $scope.updateCar = function(){
    $ionicLoading.show({templateUrl:'templates/enviando.html'});
    // AutosData.nuevoAuto($scope.usrId,$scope.myCar).then(function(response){ //ORIGINAL
    AutosData.editarAuto($scope.myCar).then(function(response){ // PRUEBA
      console.log(response);
      $ionicLoading.hide();
      $scope.newCarModal.hide();
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
      $state.go('app.autos');
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });
  }

})// END AUTOS SINGLE CONTROLLER
//**********


// TEAM CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('TeamCtrl',
function($state, $scope, $rootScope,
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
    $ionicLoading.hide();
    if(response.length == 0){
      $scope.theresTeam = false;

      TeamData.preguntarInvitacion($scope.userId).then(function(response){
        console.log(response);
        $scope.requests = response
      }).catch(function(response){
        console.log(response);
      });

    }else if (response.length > 0){
      $scope.team = response[0];
      console.log('Team id: '+$scope.team.id)
      $scope.theresTeam = true;
    }
    console.log(response);
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

.filter('capitalize', function() {
  return function(input, all) {
    var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
    return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
  }
});
