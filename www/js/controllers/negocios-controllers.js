  angular.module('starter.negocios.controllers',
['starter.perfil.controllers','starter.login.controllers','starter.seguro.controllers',
'ngMap','ngStorage','ng-token-auth','ngCordova'])
// MI NEGOCIO CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('NegociosCtrl',
function($state, $scope, $rootScope, $stateParams, $filter, $auth,
$localStorage, $ionicLoading, $ionicModal, $ionicPopup, $cordovaGeolocation,
EstablecimientosData, NegociosData, ServiciosData, LocationData) {

// Comprobación de sesión
  $auth.validateUser().then(function(resp){
  }).catch(function(resp){
    $ionicLoading.hide();
    $window.localStorage.clear();
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $state.go('login');
  });

// Declaración de variables
  $scope.$storage = $localStorage;
  $scope.myNegocio = {};
  $scope.mySucursal = {};
  $scope.servicios = [];
  $scope.myNegocio.subcategory_ids = [];
  $scope.mySucursal.business_id = null;
  $scope.services = [];
  $scope.mySucursal.service_ids = [];
  $scope.categorias = {};
  $scope.category = {};
  $scope.subcategorias = {};
  $scope.showSubcategory = false;
  $scope.negocioPropio = false;
  $scope.theresNegocio = false;
  $scope.theresLocation = false;
  $scope.userId = $scope.$storage.id;
  $scope.negocios = [];
  $scope.country;
  $scope.state;
  $scope.city = {};
  $scope.showState = false;
  $scope.showCity = false;
  $scope.showButton = false;
  $scope.negocioID;
  $scope.map1;
  $scope.map2;
  $scope.cLatLng;

  $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
  NegociosData.getUserNegocios($scope.userId).then(function(resp){
    $scope.negocios = resp;
    console.log(resp);
    if ($scope.negocios.length > 0) {
      $scope.theresNegocio = true;
    }
    $ionicLoading.hide();
  }).catch(function(resp){
    console.log(resp);
    $ionicLoading.hide();
  });

// Se crea el modal para nuevo negocio
  $ionicModal.fromTemplateUrl('templates/negocios/nuevoNegocio.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.nuevoNegocioModal = modal;
  });

// Se crea el modal para nueva sucursal
  $ionicModal.fromTemplateUrl('templates/negocios/nuevaSucursal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal2) {
    $scope.nuevaSucursalModal = modal2;
  });

// Se crea el modal para seleccionar ubicación
  $ionicModal.fromTemplateUrl('templates/negocios/map.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal3) {
    $scope.mapModal = modal3;
  });

// Se abre el modal de nuevo Negocio
  $scope.abrirModalNeg = function(propio) {
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    if(propio == true){
      $scope.negocioPropio = true;
    }
    $scope.nuevoNegocioModal.show();
    EstablecimientosData.getCategorias().then(function(resp){
      console.log(resp);
      $scope.categorias = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      console.log(resp);
      $ionicLoading.hide();
    });
  };

// Función para cargar las subcategorías de los negocios
  $scope.goForSubs = function(catId){
    var the_cat = $filter('filter')($scope.categorias,{id:catId});
    $scope.subcategorias = the_cat[0].subcategories;
    $scope.showSubcategory = true;
  }

// Se abre el modal de nueva Sucursal
  $scope.abrirModalSuc = function(propio) {
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    LocationData.getCountries().then(function(resp){
      $scope.paises = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      $ionicLoading.hide();
    });
    $scope.nuevaSucursalModal.show();
    ServiciosData.getServicios().then(function(resp){
      $scope.servicios = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      console.log(resp);
      $ionicLoading.hide();
    });
  };

// Carga la lista de estados en función del país
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

// Carga la lista de ciudades en función del estado
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

// cerrar el modal de Negocio
  $scope.cerrarModalNeg = function(){
    $scope.nuevoNegocioModal.hide();
    $state.go('app.negocios', $stateParams, {reload: true, inherit: false});
  }

// cerrar el modal de Sucursal
  $scope.cerrarModalSuc = function(){
    $scope.nuevaSucursalModal.hide();
    $state.go('app.negocios', $stateParams, {reload: true, inherit: false});
  }
// cerrar el modal de Sucursal
  $scope.cerrarModalMap = function(){
    $scope.mapModal.hide();
    $scope.nowWorkMap();
  }

// Crear Negocio en base de datos
  $scope.enviarNegocio = function(){
    if ($scope.checkBusinessReq()) {
      $ionicLoading.show({templateUrl:'templates/enviando.html'});
      NegociosData.createNegocio($scope.myNegocio).then(function(resp){
        $ionicLoading.hide();
        $scope.negocioID = resp.id;
        $scope.mySucursal.business_id  = resp.id;
        $scope.nuevoNegocioModal.hide();
        $scope.abrirModalSuc();
      }).catch(function(resp){
        console.log(resp);
        $scope.showAlert(
          'Error',
          'Ocurrio un error desconocido, intenta más tarde'
        );
        $ionicLoading.hide();
      });
    }else{
      $scope.showAlert2('Error', 'Debes llenar los campos obligatorios');
    }
  }


// Se asigna la ciudad a la Sucursal
$scope.asignarCiudad = function(city){
  $scope.mySucursal.city_id = city.id;
}

// Crear Sucursal en base de datos
$scope.enviarSucursal = function(){
  if($scope.checkEstablishmentReq()){
    $ionicLoading.show({templateUrl:'templates/enviando.html'});
    $scope.mySucursal.business_id = $scope.negocioID;
    for (var i = 0; i < $scope.services.length; i++) {
      if($scope.services[i]){
        $scope.mySucursal.service_ids.push($scope.servicios[i].id+"");
      }
    }
    EstablecimientosData.createSucursal($scope.mySucursal).then(function(resp){
      $ionicLoading.hide();
      $scope.showAlert(
        'Información enviada con éxito',
        'Los datos seran analizados, por el momento el negocio se encuentra como \'pendiente\', te avisaremos si es aceptado o rechazado'
      );
    }).catch(function(resp){
      $scope.showAlert(
        'Error',
        'Ocurrio un error desconocido, intenta más tarde'
      );
      $ionicLoading.hide();
    });
  }else{
    $scope.showAlert2('Error', 'Debes llenar los campos obligatorios');
  }
}

// Comprobar campos obligatorios del modal de negocios
  $scope.checkBusinessReq = function(){
    if (
      $scope.myNegocio.name != null &&
      $scope.myNegocio.description != null &&
      $scope.myNegocio.subcategory_ids.length > 0
    ) {
      return true;
    }else{
      return false;
    }
  }

// Comprobar campos obligatorios del modal de sucursal
  $scope.checkEstablishmentReq = function(){
    if (
      $scope.mySucursal.street != null &&
      $scope.mySucursal.number_e != null &&
      $scope.mySucursal.zipcode != null &&
      $scope.mySucursal.schedule != null &&
      $scope.mySucursal.city_id != null
    ) {
      return true;
    }else{
      return false;
    }
  }

// función que abre el modal del mapa
  $scope.abrirModalMap = function() {
    $ionicLoading.show();
    $scope.mapModal.show();
    var options = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var mypos_lat = position.coords.latitude;
      var mypos_lng = position.coords.longitude;
      var latLng = new google.maps.LatLng(mypos_lat, mypos_lng);
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl: false,
        keyboardShortcuts:false,
        mapTypeControl:false,
        zoomControl: false
      }
      $scope.map1 = new google.maps.Map(document.getElementById("map-location"), mapOptions);
      //Wait until the map is loaded
      google.maps.event.addListenerOnce($scope.map1, 'idle', function(){
        $ionicLoading.hide();
      });
    }).catch(function(){
      console.log("Could not get location");
    });
  };

// función para obtener las coordenadas centrales del mapa
  $scope.mapAction = function (){
    $scope.cLatLng = $scope.map1.getCenter();
    $scope.cerrarModalMap();
  }

// función para poner en funcionamiento al mapa
  $scope.nowWorkMap = function(){
    $ionicLoading.show();
    $scope.theresLocation = true;
    var options = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var mypos_lat = position.coords.latitude;
      var mypos_lng = position.coords.longitude;
      var latLng = $scope.cLatLng;
      $scope.mySucursal.lat = $scope.cLatLng.lat();
      $scope.mySucursal.lng = $scope.cLatLng.lng();
      var mapOptions = {
        center: latLng,
        draggable: false,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl: false,
        keyboardShortcuts:false,
        mapTypeControl:false,
        zoomControl: false
      }
      var iconObj = {
        url: 'img/pos.png',
        scaledSize: new google.maps.Size(40, 40)
      }
      $scope.map2 = new google.maps.Map(document.getElementById("sucursal-map"), mapOptions);
      //Wait until the map is loaded
      google.maps.event.addListenerOnce($scope.map2, 'idle', function(){
        $ionicLoading.hide();
        var marker = new google.maps.Marker({
          map: $scope.map2,
          animation: google.maps.Animation.DROP,
          position: latLng,
          icon: iconObj
        });
        var infoWindow = new google.maps.InfoWindow({
          content: '¡Hola! este eres tú'
        });
        google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
        });
      });
    }).catch(function(){
      console.log("Could not get location");
    });
  }


// An alert dialog
 $scope.showAlert = function(msj1,msj2) {
   var alertPopup = $ionicPopup.alert({
     title: msj1,
     template: msj2
   });
   alertPopup.then(function(res) {
     $scope.cerrarModalSuc();
   });
 };

 // An alert dialog for the required fields
  $scope.showAlert2 = function(msj1,msj2) {
    var alertPopup = $ionicPopup.alert({
      title: msj1,
      template: msj2
    });
    alertPopup.then(function(res) {
    });
  };


// función para entrar a ver los datos de un negocio y sus sucursales
  $scope.goToNegocio = function(negocio){
    if(negocio.status === "pendiente"){
      $scope.showAlert2(
        'Estado Pendiente',
        'El negocio aun está pendiente de revisión');
    }else{
      NegociosData.setSingleNegocio(negocio);
      $state.go('app.singleNegocio',{idNeg:negocio.id});
    }
  }
})//END MI NEGOCIO CONTROLLER
//**********


// SINGLE NEGOCIO CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('SingleNegocioCtrl',
function($state, $scope, $rootScope, $stateParams, NgMap, $ionicLoading,
  $ionicModal, $ionicPopup, LocationData, NegociosData, EstablecimientosData,
  ServiciosData, $cordovaGeolocation, $ionicNavBarDelegate) {
  $scope.myNegocio = NegociosData.getSingleNegocio();
  $scope.idNegocio = $scope.myNegocio.id;
  $scope.servicios = [];
  $scope.services = [];
  $scope.mySucursal = {};
  $scope.mySucursal.business_id = $scope.myNegocio.id;
  $scope.mySucursal.service_ids = [];
  $scope.bisne = {};
  $scope.bisne.app_user_id = $scope.myNegocio.app_user.id;
  $scope.bisne.id = $scope.myNegocio.id;
  console.log($scope.myNegocio);

// Se crea el modal para dar editar la información del negocio
  $ionicModal.fromTemplateUrl('templates/negocios/editarNegocio.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.editNegModal = modal;
  });

// Se crea el modal para dar de alta una nueva sucursal
  $ionicModal.fromTemplateUrl('templates/negocios/nuevaSucursal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.newSucursal = modal;
  });

// Se crea el modal para seleccionar ubicación
  $ionicModal.fromTemplateUrl('templates/negocios/map.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal3) {
    $scope.mapModal = modal3;
  });

// Se abre el modal para editar el negocio
  $scope.openEditModal = function(){
    if($scope.myNegocio.description !== undefined || $scope.myNegocio.description !== ''){
      $scope.bisne.description = $scope.myNegocio.description
    }
    if($scope.myNegocio.twitter !== undefined || $scope.myNegocio.twitter !== ''){
      $scope.bisne.twitter = $scope.myNegocio.twitter
    }
    if($scope.myNegocio.facebook !== undefined || $scope.myNegocio.facebook !== ''){
      $scope.bisne.facebook = $scope.myNegocio.facebook
    }
    if($scope.myNegocio.website !== undefined || $scope.myNegocio.website !== ''){
      $scope.bisne.website = $scope.myNegocio.website
    }
    if($scope.myNegocio.email !== undefined || $scope.myNegocio.email !== ''){
      $scope.bisne.email = $scope.myNegocio.email
    }
    $scope.editNegModal.show();
  }

// Se abre el modal de nueva Sucursal
  $scope.newSucMod = function() {
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    LocationData.getCountries().then(function(resp){
      $scope.paises = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      $ionicLoading.hide();
    });
    $scope.newSucursal.show();
    ServiciosData.getServicios().then(function(resp){
      $scope.servicios = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      console.log(resp);
      $ionicLoading.hide();
    });
  };

// Carga la lista de estados en función del país
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

// Carga la lista de ciudades en función del estado
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

// cerrar el modal de Sucursal
  $scope.cerrarModalNeg = function(){
    $scope.editNegModal.hide();
  }

// cerrar el modal de Sucursal
  $scope.cerrarModalSuc = function(){
    $scope.newSucursal.hide();
  }

// cerrar el modal de Sucursal
  $scope.cerrarModalMap = function(){
    $scope.mapModal.hide();
    $scope.nowWorkMap();
  }

// Se asigna la ciudad a la Sucursal
  $scope.asignarCiudad = function(city){
    $scope.mySucursal.city_id = city.id;
  }

// Crear Sucursal en base de datos
  $scope.enviarSucursal = function(){
    if($scope.checkEstablishmentReq()){
      $ionicLoading.show({templateUrl:'templates/enviando.html'});
      $scope.mySucursal.business_id = $scope.myNegocio.id;
      for (var i = 0; i < $scope.services.length; i++) {
        if($scope.services[i]){
          $scope.mySucursal.service_ids.push($scope.servicios[i].id+"");
        }
      }
      console.log($scope.mySucursal);
      EstablecimientosData.createSucursal($scope.mySucursal).then(function(resp){
        $ionicLoading.hide();
        $scope.showAlert(
          'Información enviada con éxito',
          'Tu sucursal se ha agregado correctamente'
        );
        NegociosData.getNegocioFromUrl($scope.myNegocio.id).then(function(resp){
          $scope.myNegocio = resp;
        }).catch(function(resp){
          console.log(resp);
        });
      }).catch(function(resp){
        $scope.showAlert(
          'Error',
          'Ocurrio un error desconocido, intenta más tarde'
        );
        $ionicLoading.hide();
      });
    }else{
      console.log($scope.mySucursal);
      $scope.showAlert2('Error', 'Debes llenar los campos obligatorios');
    }
  }

  // Comprobar campos obligatorios del modal de sucursal
    $scope.checkEstablishmentReq = function(){
      if (
        $scope.mySucursal.street != null &&
        $scope.mySucursal.number_e != null &&
        $scope.mySucursal.zipcode != null &&
        $scope.mySucursal.schedule != null &&
        $scope.mySucursal.city_id != null
      ) {
        return true;
      }else{
        return false;
      }
    }

  // función que abre el modal del mapa
    $scope.abrirModalMap = function() {
      $ionicLoading.show();
      $scope.mapModal.show();
      var options = {timeout: 10000, enableHighAccuracy: true};
      $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        var mypos_lat = position.coords.latitude;
        var mypos_lng = position.coords.longitude;
        var latLng = new google.maps.LatLng(mypos_lat, mypos_lng);
        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          fullscreenControl: false,
          keyboardShortcuts:false,
          mapTypeControl:false,
          zoomControl: false
        }
        $scope.map1 = new google.maps.Map(document.getElementById("map-location"), mapOptions);
        //Wait until the map is loaded
        google.maps.event.addListenerOnce($scope.map1, 'idle', function(){
          $ionicLoading.hide();
        });
      }).catch(function(){
        console.log("Could not get location");
      });
    };

  // función para obtener las coordenadas centrales del mapa
    $scope.mapAction = function (){
      $scope.cLatLng = $scope.map1.getCenter();
      $scope.cerrarModalMap();
    }

// función para poner en funcionamiento al mapa
  $scope.nowWorkMap = function(){
    $ionicLoading.show();
    $scope.theresLocation = true;
    var options = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var mypos_lat = position.coords.latitude;
      var mypos_lng = position.coords.longitude;
      var latLng = $scope.cLatLng;
      $scope.mySucursal.lat = $scope.cLatLng.lat();
      $scope.mySucursal.lng = $scope.cLatLng.lng();
      var mapOptions = {
        center: latLng,
        draggable: false,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl: false,
        keyboardShortcuts:false,
        mapTypeControl:false,
        zoomControl: false,
        scrollwheel:false
      }
      var iconObj = {
        url: 'img/pos.png',
        scaledSize: new google.maps.Size(40, 40)
      }
      $scope.map2 = new google.maps.Map(document.getElementById("sucursal-map"), mapOptions);
      //Wait until the map is loaded
      google.maps.event.addListenerOnce($scope.map2, 'idle', function(){
        $ionicLoading.hide();
        var marker = new google.maps.Marker({
          map: $scope.map2,
          animation: google.maps.Animation.DROP,
          position: latLng,
          icon: iconObj
        });
        var infoWindow = new google.maps.InfoWindow({
          content: '¡Hola! este eres tú'
        });
        google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
        });
      });
    }).catch(function(){
      console.log("Could not get location");
    });
  }

// Enviar edición del negocio
  $scope.editarNegocio = function (){
    NegociosData.editNegocio($scope.bisne).then(function(response){
      $scope.myNegocio = response;
      $scope.editNegModal.hide();
    }).catch(function(response){
      $scope.showAlert2('Error',
      'Algo ocurrió mientras intentabamos enviar tus datos, intenta más tarde');
    });
  }

 // An alert dialog
  $scope.showAlert = function(msj1,msj2) {
    var alertPopup = $ionicPopup.alert({
      title: msj1,
      template: msj2
    });
    alertPopup.then(function(res) {
      $scope.cerrarModalSuc();
    });
  };

// An alert dialog for the required fields
  $scope.showAlert2 = function(msj1,msj2) {
     var alertPopup = $ionicPopup.alert({
       title: msj1,
       template: msj2
     });
     alertPopup.then(function(res) {
     });
   };

  // A confirm dialog
  $scope.deleteNegConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: '¿Seguro que quieres eliminar este negocio?',
      template: 'Una vez eliminado no se podrán recuperar los datos, este cambio es definitivo e irreversible.'
    });

    confirmPopup.then(function(res) {
      if(res) {
        NegociosData.deleteNegocio($scope.idNegocio);
        console.log('You are sure');
        $ionicNavBarDelegate.back();
      } else {
        console.log('You are not sure');
      }
    });
  };

// función para ir al single de la sucursal selecionada
  $scope.goToSucursal = function(sucursal){
    EstablecimientosData.setSingleForMap(sucursal);
    $state.go('app.singleSucursal',
      {idNeg:$scope.myNegocio.id, idSuc: sucursal.id});
  }

})//END SINGLE NEGOCIO CONTROLLER
//**********



// SINGLE SUCURSAL CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('SingleSucursalCtrl',
function($state, $scope, $rootScope, $stateParams, NgMap, $ionicLoading,
  $ionicNavBarDelegate, $ionicPopup, $ionicModal, EstablecimientosData,
  ServiciosData) {
  $scope.mySucursal = EstablecimientosData.getSingleForMap();
  $scope.idSucursal = $scope.mySucursal.id;
  $scope.theresLocation = false;
  $scope.establish = {};
  $scope.servicios = [];
  $scope.services = [];
  console.log($scope.mySucursal);

  // función que abre el modal del mapa
  $scope.loadTheMap = function() {
    $ionicLoading.show();
    var options = {timeout: 10000, enableHighAccuracy: true};
    var latLng = new google.maps.LatLng($scope.mySucursal.lat,$scope.mySucursal.lng);
    var mapOptions = {
      center: latLng,
      draggable: false,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      fullscreenControl: false,
      keyboardShortcuts:false,
      mapTypeControl:false,
      zoomControl: false,
      scrollwheel:false
    }
    var iconObj = {
      url: 'img/pos.png',
      scaledSize: new google.maps.Size(40, 40)
    }
    $scope.map2 = new google.maps.Map(document.getElementById("sucursal-single-map"), mapOptions);
    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map2, 'idle', function(){
      $ionicLoading.hide();
      var marker = new google.maps.Marker({
        map: $scope.map2,
        animation: google.maps.Animation.DROP,
        position: latLng,
        icon: iconObj
      });
    });
  };

//función que comprueba si hay mapa para mostrarlo
  $scope.$on("$ionicView.afterEnter", function(event, data){
    if ($scope.mySucursal.lat !== undefined && $scope.mySucursal.lat !== '') {
      $scope.theresLocation = true;
      setTimeout(function(){ $scope.loadTheMap(); }, 500);

    }
  });

// Se crea el modal para editar una sucursal
  $ionicModal.fromTemplateUrl('templates/negocios/editarSucursal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal2) {
    console.log(' a punto de crear el modal');
    $scope.editSucursal = modal2;
    console.log(modal2);
    console.log($scope.editSucursal);
  });

// función que abre el modal del mapa
  $scope.abrirModalMap = function() {
    $ionicLoading.show();
    $scope.mapModal.show();
    var options = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var mypos_lat = position.coords.latitude;
      var mypos_lng = position.coords.longitude;
      var latLng = new google.maps.LatLng(mypos_lat, mypos_lng);
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl: false,
        keyboardShortcuts:false,
        mapTypeControl:false,
        zoomControl: false
      }
      $scope.map1 = new google.maps.Map(document.getElementById("map-location"), mapOptions);
      //Wait until the map is loaded
      google.maps.event.addListenerOnce($scope.map1, 'idle', function(){
        $ionicLoading.hide();
      });
    }).catch(function(){
      console.log("Could not get location");
    });
  };

// función para obtener las coordenadas centrales del mapa
  $scope.mapAction = function (){
    $scope.cLatLng = $scope.map1.getCenter();
    $scope.cerrarModalMap();
  }

// cerrar el modal de Sucursal
  $scope.cerrarModalMap = function(){
    $scope.mapModal.hide();
    $scope.nowWorkMap();
  }

// Se abre el modal de nueva Sucursal
  $scope.editSucMod = function() {
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    $scope.editSucursal.show();
    ServiciosData.getServicios().then(function(resp){
      $scope.servicios = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      console.log(resp);
      $ionicLoading.hide();
    });
  }

// función para cambiar de ciudad
 $scope.changeCity = function(){
   $ionicLoading.show();
   LocationData.getCountries().then(function(resp){
     $scope.paises = resp;
     $ionicLoading.hide();
   }).catch(function(resp){
     $ionicLoading.hide();
   });
 }

// Carga la lista de estados en función del país
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

// Carga la lista de ciudades en función del estado
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

// Se asigna la ciudad a la Sucursal
  $scope.asignarCiudad = function(city){
    $scope.mySucursal.city_id = city.id;
  }

// cerrar el modal de Sucursal
  $scope.cerrarModalSuc = function(){
    $scope.editSucursal.hide();
  }

// Crear Sucursal en base de datos
  $scope.enviarSucursal = function(){
    if($scope.checkEstablishmentReq()){
      $ionicLoading.show({templateUrl:'templates/enviando.html'});
      $scope.establish.business_id = $scope.myNegocio.id;
      for (var i = 0; i < $scope.services.length; i++) {
        if($scope.services[i]){
          $scope.establish.service_ids.push($scope.servicios[i].id+"");
        }
      }
      console.log($scope.establish);
      EstablecimientosData.editSucursal($scope.establish).then(function(resp){
        $ionicLoading.hide();
        $scope.showAlert(
          'Información enviada con éxito',
          'Tu sucursal se ha agregado correctamente'
        );
        NegociosData.getNegocioFromUrl($scope.myNegocio.id).then(function(resp){
          $scope.myNegocio = resp;
        }).catch(function(resp){
          console.log(resp);
        });
      }).catch(function(resp){
        $scope.showAlert(
          'Error',
          'Ocurrio un error desconocido, intenta más tarde'
        );
        $ionicLoading.hide();
      });
    }else{
      console.log($scope.establish);
      $scope.showAlert2('Error', 'Debes llenar los campos obligatorios');
    }
  }

  // Comprobar campos obligatorios del modal de sucursal
    $scope.checkEstablishmentReq = function(){
      if (
        $scope.establish.street != null &&
        $scope.establish.number_e != null &&
        $scope.establish.zipcode != null &&
        $scope.establish.schedule != null &&
        $scope.establish.city_id != null
      ) {
        return true;
      }else{
        return false;
      }
    }


  // A confirm dialog
  $scope.deleteSucConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: '¿Seguro que quieres eliminar esta sucursal?',
      template: 'Una vez eliminado no se podrán recuperar los datos, este cambio es definitivo e irreversible.'
    });
    confirmPopup.then(function(res) {
      if(res) {
        EstablecimientosData.deleteSucursal($scope.idSucursal);
        $ionicNavBarDelegate.back();
        console.log('You are sure');
      } else {
        console.log('You are not sure');
      }
    });
  };
})//END SINGLE SUCURSAL CONTROLLER
//**********
;
