angular.module('starter.controllers',
['starter.perfil.controllers','starter.autos.controllers','starter.cargas.controllers',
'starter.negocios.controllers','starter.login.controllers',
'starter.seguro.controllers','ngMap','ngStorage','ng-token-auth','ngCordova'])

// APP CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('AppCtrl',
function($scope, $rootScope, $filter, $ionicModal, $window, $timeout,$state,
  $ionicHistory, $localStorage, $auth, UserData) {

  /*
  With the new view caching in Ionic, Controllers are only called
  when they are recreated or on app start, instead of every page change.
  To listen for when this page is active (for example, to refresh data),
  listen for the $ionicView.enter event:
  $scope.$on('$ionicView.enter', function(e) {
  });
  */

  $scope.$on('$ionicView.beforeEnter', function(e){
    console.log("hello");
    $rootScope.doRefresh();
  });

  $rootScope.doRefresh = function(){
    console.log('doRefresh');
    $scope.$storage = $localStorage;
    if(!$scope.$storage.guest){
      $scope.perfil = $scope.$storage.user;
      console.log($scope.perfil);
      $rootScope.userId = $scope.$storage.id;
      $rootScope.usuario = $scope.$storage.user;
    }else{
      $scope.perfil = {
        name: 'Invitado'
      }
    }
  }

  $scope.changeTab = function(state){
    $state.go(state);
    $ionicHistory.nextViewOptions({
      disableBack: true,
      disableAnimate: true
    });
  }
  $scope.goProfile = function(){
    $state.go('app.perfil');
  }

}) // END APP CONTROLLER
//**********


// DIRECTORIO CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('DirectorioCtrl',
function($scope, $state, $filter, $window, $auth, $timeout, $ionicLoading, $ionicPopup,
  $ionicHistory,$localStorage, EstablecimientosData, NegociosData) {

  $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
//Comprobación de sesión
  var my_timeout = $timeout(function(){
    //en caso de que la petición tarde demasiado se cancela el loading
    $ionicLoading.hide();
    $localStorage.$reset();
    $window.localStorage.clear();
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $state.go('login');
    console.log('Time Out :(')
  },7000);

  $auth.validateUser().then(function(resp){
    $timeout.cancel(my_timeout);
  }).catch(function(resp){
    if(!$scope.$storage.guest){
      $ionicLoading.hide();
      $localStorage.$reset();
      $window.localStorage.clear();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $state.go('login');
    }else{
      $timeout.cancel(my_timeout);
      $state.go('app.directorio');
    }
  });
// Declaración de variables
  $scope.$storage = $localStorage;

  if(!$scope.$storage.guest){
    $scope.userCity = $scope.$storage.user.city.id;
  }else{
    $scope.userCity = $scope.$storage.guestUser.city_id;
  }
  $scope.tabsState = true;
  $scope.closeBtn = false;
  $scope.searchList = false;
  $scope.negocios = {};
  $scope.adn = {};

// Obtener la lista de establecimientos general
  EstablecimientosData.getEstablecimientosGral($scope.userCity).then(function(resp){
    $scope.negocios = resp;
    $ionicLoading.hide();
  }).catch(function(resp){
    // console.log(resp);
    $ionicLoading.hide();
  });

// Obtener la lista de categorías
  EstablecimientosData.getCategorias().then(function(response){
    $scope.categories = response;
    EstablecimientosData.setCategorias(response);
    $ionicLoading.hide();
  }).catch(function(response){
    // console.log(response);
    $ionicLoading.hide();
  });

  if($scope.$storage.subcats === undefined){
    $scope.subcats = {};
  }else{
    $scope.subcats = $scope.$storage.subcats;
  }

// función para la búsqueda rápida
	$scope.srchchange = function () {
    $scope.searchList = false;
    $scope.names = null;
    var filtervalue = [];
		var searchData = $scope.negocios;
    var fltvar;
    var jsval;
    for (var i = 0; i < searchData.length; i++) {
      if($scope.adn.item.length > 2){
        fltvar = $filter('uppercase')($scope.adn.item);
        jsval = $filter('uppercase')(searchData[i].business);
        if (jsval.indexOf(fltvar) >= 0) {
          filtervalue.push(searchData[i]);
        }
      }
    }
    $scope.names = filtervalue;
    $scope.searchList = true;
  };

// función que cambia el estado del botón de cerrar la búsqueda rápida
  $scope.searchClick = function(){
    $scope.tabsState = !$scope.tabsState;
    $scope.closeBtn = !$scope.closeBtn;
  }

// función que resetea la busqueda
  $scope.resetSearch = function () {
    $scope.searchList=false;
    $scope.adn.item = "";
    $scope.names = $scope.negocios;
  }

// Función para ir a la categoría deseada una vez que se le dió click
  $scope.goCategory = function(id,name){
    $scope.category = id;
    $scope.the_cat = $filter('filter')($scope.categories,{id:$scope.category});
    $scope.subcats = $scope.the_cat[0].subcategories;
    EstablecimientosData.setSubcategorias($scope.subcats);
    $state.go('app.dirCat',{catName: name});
  }
  $scope.goGasList = function(){
    $state.go('app.gasList');
  }

  $scope.goSingle = function(negId){
    $state.go('app.dirSingle',{singleId:negId});
  }

  $scope.showAlert = function(res, response) {
    var alertPopup = $ionicPopup.alert({
      title: 'Ups!',
      template: 'Hubo un error accediendo a la base de datos'
    });

    alertPopup.then(function(res) {
    });
  };

})// END DIRECTORIO CONTROLLER
//**********

// DIRECTORIO CAT CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('DirCatCtrl', function($state, $scope, $rootScope, $stateParams, NgMap, $ionicLoading, $localStorage,EstablecimientosData) {
  $scope.catName = $stateParams.catName;
  $scope.subcats = EstablecimientosData.getSubcategorias();
  console.log('subcategorias:')
  console.log($scope.subcats);
  $scope.goList = function(id){
    EstablecimientosData.setList(id);
  }
})//END DIRECTORIO CAT CONTROLLER
//**********

// DIRECTORIO LISTA CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('DirListCtrl', function($state, $scope, $stateParams, $localStorage,
   $ionicLoading, EstablecimientosData) {
  $ionicLoading.show();
  // VARS
  $scope.$storage = $localStorage;
  $scope.negocios = {};
  if(!$scope.$storage.guest){
    $scope.userCity = $scope.$storage.user.city.id;
  }else{
    $scope.userCity = $scope.$storage.guestUser.city_id;
  }
  var subcat = $stateParams.subcatId;
  $scope.subcatName = $stateParams.subcatName;

  EstablecimientosData.getEstablecimientos(subcat, $scope.userCity).then(function(response){
    $scope.negocios= response;
    $ionicLoading.hide();
  }).catch(function(response){
    $ionicLoading.hide();
  });
  $scope.goSingle = function(negId){
    // console.log(lol);
    $state.go('app.dirSingle',{singleId:negId});
  }

})//END DIRECTORIO LISTA CONTROLLER
//**********


// DIRECTORIO SINGLE CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('DirSingleCtrl',
function($state, $scope, $stateParams, $ionicHistory, $ionicLoading, $ionicModal,
  $rootScope, $ionicPopup, NgMap,EstablecimientosData, ratingToStars, RatingData,
  $cordovaGeolocation) {
  // $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
  $scope.single = {};
  $scope.setRating = false;
  $scope.rating = 5;
  $scope.comoLlegar = true;
  $scope.objR = {};
  $scope.objR.review= {};
  $scope.userId = $rootScope.userId;
  var singleId = $stateParams.singleId;

  EstablecimientosData.getSingle(singleId).then(function(response){
    $ionicLoading.hide();
    $scope.single = response;
    console.log($scope.single);
    $scope.rating = $scope.single.review_score*2;
    $scope.updateStars($scope.rating);
    $scope.marker = {
      title:$scope.single.business.name,
      lat:$scope.single.lat,
      lng:$scope.single.lng
    };
  }).catch(function(response){
    $ionicLoading.hide();
  });

// rating
  $scope.editableRating = ratingToStars.getStarsForPoi($scope.rating/2);
  $scope.updateStars = function (rating){
    $scope.editableRating = ratingToStars.getStarsForPoi(rating/2);
  }
  // $scope.staticRating = ratingToStars.getStarsForPoi(3.5);
  $scope.toggleRating = function(){
    $scope.setRating = !$scope.setRating;
  }
  $scope.enviarCalif = function(rating){
    $scope.objR.review.app_user_id = $scope.userId;
    $scope.objR.review.establishment_id = $scope.single.id;
    $scope.objR.review.rate = rating/2;
    console.log($scope.objR);
    RatingData.postRating($scope.objR).then(function(resp){
      console.log(resp);
      $scope.showAlert(
        '¡Éxito!',
        'Gracias por tu retroalimentación, esto nos ayuda a todos para mejorar. Sigue utilizando Yego App'
      );
    }).catch(function(resp){
      console.log(resp);
    });
  }

// modal de mapa
  $ionicModal.fromTemplateUrl('templates/directorio/map.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalMapa = modal;
  });

  $scope.openModal = function() {
    $scope.modalMapa.show();
    // $ionicLoading.show();
    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    }, function(error){
      console.log("Could not get location");
    });

    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      // $ionicLoading.hide();
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });

      var infoWindow = new google.maps.InfoWindow({
        content: "Here I am!"
      });

      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open($scope.map, marker);
      });
    });

    // USANDO NGMAP
    //––––––––––––––––––
    // NgMap.getMap().then(function(map) {
    //   $scope.map = map;
    //   $ionicLoading.hide();
    // });
    // $scope.callbackFunc = function(param) {
    //   $scope.myself = $scope.map.getCenter();
    //   // console.log($scope.myself);
    // };
    // console.log($scope.marker);
  };
  $scope.closeModal = function() {
    $scope.modalMapa.hide();
  };
  $scope.comoLlegarFn = function(){
    $scope.comoLlegar = true;
  }

  $scope.showAlert = function(msj1,msj2) {
    var alertPopup = $ionicPopup.alert({
      title: msj1,
      template: msj2
    });

    alertPopup.then(function(res) {
      $scope.toggleRating();
    });
  };

  $scope.openInAppBrowser = function(url){
   // Open in app browser
   window.open(url,'_blank');
  };

  $scope.openMap = function(){
    console.log('openMap');
    EstablecimientosData.setSingleForMap($scope.single);
    $state.go('app.dirMapa');
  }

})//END DIRECTORIO SINGLE CONTROLLER
//**********



// GASOLINERAS LISTA CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('GasListCtrl', function($state, $scope, $stateParams, $localStorage,
   $ionicLoading, GasolinasData) {
  $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
  // VARS
  $scope.$storage = $localStorage;
  $scope.gasolineras = {};
  if(!$scope.$storage.guest){
    $scope.userCity = $scope.$storage.user.city.id;
  }else{
    $scope.userCity = $scope.$storage.guestUser.city_id;
  }
  var subcat = $stateParams.subcatId;
  $scope.subcatName = $stateParams.subcatName;

  GasolinasData.getGasStations($scope.userCity).then(function(response){
    $scope.gasolineras= response;
    console.log($scope.gasolineras);
    $ionicLoading.hide();
  }).catch(function(response){
    $ionicLoading.hide();
  });
  $scope.goSingle = function(gasolinera){
    // console.log(lol);
    GasolinasData.setGasolineraSingle(gasolinera);
    $state.go('app.gasSingle',{gasId:gasolinera.id});
  }

})//END GASOLINERAS LISTA CONTROLLER
//**********



// DIRECTORIO SINGLE CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('DirSingleCtrl',
function($state, $scope, $stateParams, $ionicHistory, $ionicLoading, $ionicModal,
  $rootScope, $ionicPopup, NgMap,EstablecimientosData, ratingToStars, RatingData,
  $cordovaGeolocation, $localStorage) {
  $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
  $scope.$storage = $localStorage;
  $scope.single = {};
  $scope.setRating = false;
  $scope.rating = 5;
  $scope.comoLlegar = true;
  $scope.objR = {};
  $scope.objR.review= {};
  $scope.userId = $rootScope.userId;
  var singleId = $stateParams.singleId;

  EstablecimientosData.getSingle(singleId).then(function(response){
    $ionicLoading.hide();
    $scope.single = response;
    console.log($scope.single);
    $scope.rating = $scope.single.review_score*2;
    $scope.updateStars($scope.rating);
  }).catch(function(response){
    $ionicLoading.hide();
  });

// rating
  $scope.editableRating = ratingToStars.getStarsForPoi($scope.rating/2);
  $scope.updateStars = function (rating){
    $scope.editableRating = ratingToStars.getStarsForPoi(rating/2);
  }
  // $scope.staticRating = ratingToStars.getStarsForPoi(3.5);
  $scope.toggleRating = function(){
    if(!$scope.$storage.guest){
      $scope.setRating = !$scope.setRating;
    }else{
      $scope.showAlert('Usuario invitado',
        'Actualmente te encuentras en una sesion de invitado, para poder '+
        'calificar establecimientos necesitas registrarte','error')
    }
  }
  $scope.enviarCalif = function(rating){
    $scope.objR.review.app_user_id = $scope.userId;
    $scope.objR.review.establishment_id = $scope.single.id;
    $scope.objR.review.rate = rating/2;
    console.log($scope.objR);
    RatingData.postRating($scope.objR).then(function(resp){
      console.log(resp);
      $scope.showAlert(
        '¡Éxito!',
        'Gracias por tu retroalimentación, esto nos ayuda a todos para mejorar.'+
        ' Sigue utilizando Yego App',
        'fine'
      );
    }).catch(function(resp){
      console.log(resp);
    });
  }

  $scope.showAlert = function(msj1,msj2,type) {
    var alertPopup = $ionicPopup.alert({
      title: msj1,
      template: msj2
    });

    alertPopup.then(function(res) {
      if(type != 'error'){
        $scope.toggleRating();
      }
    });
  };

  $scope.openInAppBrowser = function(url){
   // Open in app browser
   window.open(url,'_blank');
  };

  $scope.openMap = function(){
    console.log('openMap');
    EstablecimientosData.setSingleForMap($scope.single);
    $state.go('app.dirMapa');
  }

})//END DIRECTORIO SINGLE CONTROLLER
//**********



// GASOLINERA SINGLE CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('GasSingleCtrl',
function($state, $scope, $stateParams, $ionicHistory, $ionicLoading, $ionicModal,
  $rootScope, $ionicPopup, NgMap,GasolinasData, ratingToStars, RatingData,
  $cordovaGeolocation, $localStorage) {
  $scope.$storage = $localStorage;
  $scope.single = {};
  $scope.setRating = false;
  $scope.rating = 5;
  $scope.comoLlegar = true;
  $scope.objR = {};
  $scope.objR.review= {};
  $scope.userId = $rootScope.userId;
  var singleId = $stateParams.singleId;

  $scope.single=GasolinasData.getGasolineraSingle();
  console.log($scope.single);

// rating
  $scope.editableRating = ratingToStars.getStarsForPoi($scope.rating/2);
  $scope.updateStars = function (rating){
    $scope.editableRating = ratingToStars.getStarsForPoi(rating/2);
  }
  // $scope.staticRating = ratingToStars.getStarsForPoi(3.5);
  $scope.toggleRating = function(){
    if(!$scope.$storage.guest){
      $scope.setRating = !$scope.setRating;
    }else{
      $scope.showAlert('Usuario invitado',
        'Actualmente te encuentras en una sesion de invitado, para poder '+
        'calificar establecimientos necesitas registrarte','error')
    }
  }
  $scope.enviarCalif = function(rating){
    $scope.objR.review.app_user_id = $scope.userId;
    $scope.objR.review.establishment_id = $scope.single.id;
    $scope.objR.review.rate = rating/2;
    console.log($scope.objR);
    RatingData.postRating($scope.objR).then(function(resp){
      console.log(resp);
      $scope.showAlert(
        '¡Éxito!',
        'Gracias por tu retroalimentación, esto nos ayuda a todos para mejorar.'+
        ' Sigue utilizando Yego App',
        'fine'
      );
    }).catch(function(resp){
      console.log(resp);
    });
  }

// modal de mapa
  $ionicModal.fromTemplateUrl('templates/directorio/map.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalMapa = modal;
  });

  $scope.openModal = function() {
    $scope.modalMapa.show();
    // $ionicLoading.show();
    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    }, function(error){
      console.log("Could not get location");
    });

    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      // $ionicLoading.hide();
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });

      var infoWindow = new google.maps.InfoWindow({
        content: "Here I am!"
      });

      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open($scope.map, marker);
      });
    });
  };
  $scope.closeModal = function() {
    $scope.modalMapa.hide();
  };
  $scope.comoLlegarFn = function(){
    $scope.comoLlegar = true;
  }

  $scope.showAlert = function(msj1,msj2,type) {
    var alertPopup = $ionicPopup.alert({
      title: msj1,
      template: msj2
    });

    alertPopup.then(function(res) {
      if(type != 'error'){
        $scope.toggleRating();
      }
    });
  };

  $scope.openInAppBrowser = function(url){
   // Open in app browser
   window.open(url,'_blank');
  };

  $scope.openMap = function(){
    console.log('openMap');
    EstablecimientosData.setSingleForMap($scope.single);
    $state.go('app.dirMapa');
  }

})//END GASOLINERA SINGLE CONTROLLER
//**********



// DIRECTORIO MAPA CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('DirMapaCtrl',
function($state, $scope, $rootScope, $stateParams, $ionicLoading,
  $cordovaGeolocation, $ionicNavBarDelegate, EstablecimientosData) {
  console.log('DirMapaCtrl');
  $scope.single = EstablecimientosData.getSingleForMap();
  console.log($scope.single);
  $ionicLoading.show();
  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    var mypos_lat = position.coords.latitude;
    var mypos_lng = position.coords.longitude;
    var lat = Number($scope.single.lat)
    var lng = Number($scope.single.lng)
    var latLng = new google.maps.LatLng(lat, lng);
    console.log(latLng);
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      $ionicLoading.hide();
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });

      var infoWindow = new google.maps.InfoWindow({
        content: '<h4>'+$scope.single.business.name+'</h4>'+
        '<p>tel: '+$scope.single.phone+'<br>'+
        'email: '+$scope.single.business.email+'</p>'
      });

      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open($scope.map, marker);
      });

    });
  }, function(error){
    console.log("Could not get location");
  });


})//END DIRECTORIO MAPA CONTROLLER
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

  $scope.goCupon = function(obj){
    console.log('Go Cupon');
    console.log(obj);
    CuponesData.setCupon(obj);
    $state.go('app.cupon');
  }
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


// CUPON CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('CuponCtrl', function($state, $scope, $rootScope, $stateParams, $ionicLoading, $ionicNavBarDelegate, $ionicPopup, CuponesData) {
  $scope.cupon = CuponesData.getCupon();

  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Ups!',
      template: 'Hubo un error accediendo a la base de datos'
    });

    alertPopup.then(function(res) {
      // console.log('Thank you for not eating my delicious ice cream cone');
    });
  };
})//END CUPON CONTROLLER
//**********

// ABOUT CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('AboutCtrl', function($state, $scope, $rootScope, $stateParams, $ionicLoading, $ionicNavBarDelegate, $ionicPopup, CuponesData) {

})//END ABOUT CONTROLLER
//**********
.filter('capitalize', function() {
  return function(input, all) {
    var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
    return (!!input && input != null && typeof(input) == 'string') ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
  }
})
.filter('removeNWC', [function() {
    return function(string) {
        if (!angular.isString(string)) {
            return string;
        }
        var string2 = string.replace(/[\s]/g, '');
        var string3 = string2.replace('/', '');
        return string3;
    };
}]);
