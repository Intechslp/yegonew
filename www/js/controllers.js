angular.module('starter.controllers', ['ngMap','ngStorage','ng-token-auth','ngCordova'])

// APP CONTROLLER
.controller('AppCtrl',
function($scope, $rootScope, $filter, $ionicModal, $timeout,$state,$ionicHistory, $localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.$storage = $localStorage;
  $scope.perfil = $scope.$storage.user;
  $rootScope.userId = $scope.$storage.id;
  console.log(" AppCtrl User id:"+$rootScope.userId);

  // if ($scope.perfil.name == null){
  //   $scope.theres_name = false;
  // }else{
  //   $scope.nombre = $scope.perfil.name+" "+$scope.perfil.lastnames;
  // }
  // if ($scope.perfil.pic == null){
  //   $scope.theres_picture = false;
  //   $scope.perfil.pic = "img/camera.jpg"
  // }
  // if ($scope.perfil.username == null){
  //   $scope.theres_username = false;
  // }



  $scope.usuario = $scope.$storage.user;
  console.log($scope.usuario);

  // $scope.profile = {
  //   name: "Asaf López",
  //   family: "López Govea",
  //   user: "saporules",
  //   pic: "https://pbs.twimg.com/profile_images/768688103561175041/pDR4Qpx__bigger.jpg",
  //   carpic: "https://acs2.blob.core.windows.net/imgcatalogo/xl/VA_f5e69006e33442dca2c3bab374ca8817.jpg"
  // };

  $scope.changeTab = function(state){
    $state.go(state);
    $ionicHistory.nextViewOptions({
      disableBack: true,
      disableAnimate: true
    });
  }

}) // END APP CONTROLLER


// LOGIN CONTROLLER
.controller('LoginCtrl',
  function($scope, $state, $rootScope,
    $localStorage, $auth, $ionicLoading,
    $ionicPopup, $cordovaSQLite,
    HeadersSave, UserData){

  $scope.$storage = $localStorage;
  if ($scope.$storage.guest) {
    $state.go('app.directorio');
  }

  console.log('LoginCtrl');
  $ionicLoading.show();
  $auth.validateUser().then(function(resp){
    console.log(resp);
    $state.go('app.directorio');
  }).catch(function(resp){
    console.log(resp);
    $ionicLoading.hide();
  });


  // VARS
  $scope.loginData = {};
  $scope.registerData = {};
  $scope.btnCont=true;
  $scope.loginForm = true;
  $scope.registerForm = false;

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
  $scope.btnClick = function (){
    $ionicLoading.show({templateUrl: 'templates/iniciando.html'});
    $auth.submitLogin($scope.loginData)
      .then(function(resp) {
        HeadersSave.setHeaders(resp);
        var str = localStorage.auth_headers;
        var pre_sesion = str.replace("-","_");
        var sesion = JSON.parse(pre_sesion);
        $scope.$storage.headers= sesion;
        $scope.$storage.id = resp.id;
        $scope.$storage.custId = resp.customer_id;
        UserData.getUserData($scope.$storage.id, $scope.$storage.header).then(function(response){
          console.log(response);
          $scope.$storage.user = response;
          $ionicLoading.hide();
          $state.go('app.directorio');
        }).catch(function(response){
          console.log(response);
          $ionicLoading.hide();
          $scope.showAlert2();
        });
      })
      .catch(function(resp) {
        $scope.showAlert();
        $ionicLoading.hide();
    });
  }

  $scope.regBtnClick = function() {
    $scope.registerData.user_roles = {"add_role":"appuser"}
    console.log($scope.registerData);
    $auth.submitRegistration($scope.registerData)
      .then(function(resp) {
        console.log(resp);
        $scope.$storage.guest = false;
        $state.go('location');
        // handle success response
      })
      .catch(function(resp) {
        // handle error response
        console.log(resp);
      });

  };
  $scope.guestClick = function(){
    console.log('guestClick');
    // $scope.perfil = {
    //   firstname: "Invitado",
    //   family: "N/A",
    //   user: "Invitado",
    //   pic: "https://pbs.twimg.com/profile_images/768688103561175041/pDR4Qpx__bigger.jpg",
    //   carpic: "https://acs2.blob.core.windows.net/imgcatalogo/xl/VA_f5e69006e33442dca2c3bab374ca8817.jpg"
    // };
    // $scope.insert($scope.perfil);
    $scope.$storage.guest = true;
    $state.go('location')
  }

  $scope.loginClick = function(btn,state){
    if (btn === 'login') {
      $scope.$storage.sesion = {user: $scope.loginData.user,pass: $scope.loginData.pass};
      $scope.$storage.guest = false;
    }else if(btn === 'register'){
      $scope.$storage.register = {user: $scope.registerData.user,pass: $scope.registerData.pass, email: $scope.registerData.email};
      $scope.$storage.guest = false;
    }else if(btn === 'guest'){
      $scope.$storage.guest = true;
    }
    $state.go('state');
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
.controller('LocationCtrl', function ($scope, $state, $filter, $localStorage,LocationData,$ionicLoading) {
  $scope.$storage = $localStorage;
  $scope.locationData = {};

  $ionicLoading.show();
  LocationData.getCountries().then(function(resp){
    $scope.paises = resp;
    $ionicLoading.hide();
  }).catch(function(resp){
    $ionicLoading.hide();
  });

  $scope.loadStates = function(paisId){
    console.log('loadStates()');
    console.log(paisId);
    $ionicLoading.show();
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
    $ionicLoading.show();
    LocationData.getCities(paisId,estadoId).then(function(resp){
      $scope.ciudades = resp;
      $ionicLoading.hide();
    }).catch(function(resp){
      $ionicLoading.hide();
    });
  }

  $scope.goAuto = function(){
    if($scope.$storage.guest){
      $state.go('welcome');
    }else{
      $state.go('autoReg');
    }
  }

})// END LOCATION CONTROLLER



// AUTOREG CONTROLLER
.controller('AutoRegCtrl',
function ($scope, $state, $filter, $localStorage, $ionicLoading, SegurosData, UserData) {
  $scope.marcas = [];
  $scope.modelos = [];
  $scope.descripciones = [];

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

  $scope.$storage = $localStorage;

  $scope.saveCar = function(option){
    $scope.$storage.car = $scope.myCar;
    console.log($scope.$storage.car);
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

// DIRECTORIO CONTROLLER
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

// DIRECTORIO CAT CONTROLLER
.controller('DirCatCtrl', function($state, $scope, $rootScope, $stateParams, NgMap, $ionicLoading, $localStorage,EstablecimientosData) {
  $scope.catName = $stateParams.catName;
  $scope.subcats = EstablecimientosData.getSubcategorias();
  $scope.goList = function(id){
    EstablecimientosData.setList(id);
  }
})//END DIRECTORIO CAT CONTROLLER

// DIRECTORIO LISTA CONTROLLER
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

// DIRECTORIO SINGLE CONTROLLER
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

// CERCA DE MI CONTROLLER
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



// SEGUROS CONTROLLER
.controller('SegurosCtrl', function($state, $scope, $stateParams, $ionicLoading, SegurosData, $ionicNavBarDelegate, $ionicPopup) {
  $ionicNavBarDelegate.showBackButton(false);
  // $scope.brands = {};
  $scope.master = {}
  $scope.marcas = [];
  $scope.sendData = {};
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

  $scope.goForCotizacion = function(datos){
    $ionicLoading.show({templateUrl:'templates/enviando.html'});
    if (
      $scope.sendData.tipoAuto == null ||
      $scope.sendData.Marca == null ||
      $scope.sendData.Modelo == null ||
      $scope.sendData.Descripcion == null ||
      $scope.sendData.Edad == null ||
      $scope.sendData.Genero == null ||
      $scope.sendData.CPostal == null
      ) {
      $ionicLoading.hide();
      // $scope.showAlert2('sendData',$scope.sendData);
      $scope.showAlert(
        'Imposible enviar',
        'Debes de llenar todos los datos que se piden en este formulario.'
      );
    } else {
      SegurosData.setData($scope.sendData);
      // $scope.showAlert2('sendData',$scope.sendData);
      console.log($scope.sendData)
      SegurosData.getCotizacion($scope.sendData).then(function(response){
        $ionicLoading.hide();
        $scope.cotizacion = JSON.parse(response);
        SegurosData.setCotizacion($scope.cotizacion);
        // $scope.showAlert('success', response);
        $state.go('app.segLista');
      }).catch(function(response){
        $ionicLoading.hide();
        console.log(response);
        if(respones === "An error has occurred."){
          $scope.showAlert('Error','Un error ha ocurrido, intenta más tarde');
        }else{
          $scope.showAlert('Error',response);
        }
      });
    }

  }

  $scope.clearForm = function (){
    console.log('clearForm()')
    $state.go('app.seguros', $stateParams, {reload: true, inherit: false});
  }

  $scope.showAlert = function(res, response) {
    var alertPopup = $ionicPopup.alert({
      title: res,
      template: '<pre>'+response+'</pre>'
    });
  };

  $scope.showAlert2 = function(res, response) {
    var alertPopup = $ionicPopup.alert({
      title: res,
      template:
        '<pre>'+response.tipoAuto+'</pre>'+
        '<pre>'+response.Marca+'</pre>'+
        '<pre>'+response.Modelo+'</pre>'+
        '<pre>'+response.Descripcion+'</pre>'+
        '<pre>'+response.Edad+'</pre>'+
        '<pre>'+response.Genero+'</pre>'+
        '<pre>'+response.CPostal+'</pre>'+
        '<pre>'+response.perioricidadPago+'</pre>'+
        '<pre>'+response.Plan+'</pre>'+
        '<pre>'+response.Grupo+'</pre>'

    });
  };

})// END SEGUROS CONTROLLER




// SEGUROS LISTA CONTROLLER
.controller('SegListCtrl', function($state, $filter,$scope, $stateParams, $ionicLoading, SegurosData) {
  $scope.firstLim = true;
  $scope.firstRC = true;

  $scope.greaterThan = function(prop, val){
    return function(item){
      if (item != null){
        return item[prop] > val;
      }
    }
  }
  $scope.datosLim = SegurosData.getData();
  $scope.datosRc = SegurosData.getData();
  $scope.cotiAmp = SegurosData.getCotizacion('already');
  $scope.cotiLim = {};
  $scope.cotiRc = {};

  $scope.limClick = function(){
    console.log("limClick()")
    $scope.datosLim.Plan = 'LIMITADA';
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    console.log($scope.datosLim)
    SegurosData.getCotizacion($scope.datosLim).then(function(response){
      $ionicLoading.hide();
      $scope.cotiLim = JSON.parse(response);
      $scope.cotizacionesLIM = $filter('filter')($scope.cotiLim.Cotizacion, $scope.greaterThan('PrimaTotal',0));
    }).catch(function(response){
      $ionicLoading.hide();
      $scope.showAlert('Error', 'Ah ocurrido un error, intenta más tarde');
    });
  }
  $scope.rcClick = function(){
    console.log("rcClick()")
    $scope.datosRc.Plan = 'RC';
    $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
    console.log($scope.datosRc)
    SegurosData.getCotizacion($scope.datosRc).then(function(response){
      $ionicLoading.hide();
      $scope.cotiRc = JSON.parse(response);
      // $scope.cotizacionesRC  = $scope.cotiRc;

      $scope.cotizacionesRC = $filter('filter')($scope.cotiRc.Cotizacion, $scope.greaterThan('PrimaTotal',0));
      console.log($scope.cotizacionesRC);
    }).catch(function(response){
      $ionicLoading.hide();
      $scope.showAlert('Error', 'Ah ocurrido un error, intenta más tarde');
    });
  }

  $scope.cotizaciones = $filter('filter')($scope.cotiAmp.Cotizacion, $scope.greaterThan('PrimaTotal',0));

  $scope.amplia_cont = true;
  $scope.limitada_cont = false;
  $scope.rc_cont = false;

  $scope.changeSegurosTab = function(tab){
    console.log('Tab:'+tab)
    if(tab === 'amplia'){
      $scope.amplia_cont = true;
      $scope.limitada_cont = false;
      $scope.rc_cont = false;
    }else if(tab === 'limitada'){
      $scope.amplia_cont = false;
      $scope.limitada_cont = true;
      $scope.rc_cont = false;
      if($scope.firstLim){
        console.log('firstLim: '+$scope.firstLim)
        $scope.firstLim = false;
        $scope.limClick();
      }
    }else if(tab === 'rc'){
      $scope.amplia_cont = false;
      $scope.limitada_cont = false;
      $scope.rc_cont = true;
      if($scope.firstRC){
        console.log('firstLim: '+$scope.firstLim)
        $scope.firstRC = false;
        $scope.rcClick();
      }
    }
  }

  $scope.goSingle = function(index){
    console.log($scope.cotizaciones[index]);
    SegurosData.setSingle($scope.cotizaciones[index]);
    $state.go('app.segSingle');
  }

  $scope.showAlert = function(res, response) {
    var alertPopup = $ionicPopup.alert({
      title: res,
      template: '<pre>'+response+'</pre>'
    });
    // alertPopup.then(function(res) {
    //   console.log('Thank you for not eating my delicious ice cream cone');
    // });
  };

})//END SEGUROS LISTA CONTROLLER

// SEGUROS SINGLE CONTROLLER
.controller('SegSingleCtrl', function($state, $scope, $rootScope, $stateParams, $ionicLoading, SegurosData) {
  $scope.seguro = SegurosData.getSingle();
})//END SEGUROS SINGLE CONTROLLER

// SEGUROS COMPRA PASO 0 CONTROLLER
.controller('SegComp0Ctrl', function($scope, $stateParams, $timeout, $ionicLoading, SegurosData) {
  $scope.auto = SegurosData.getData();
  $scope.seguro = SegurosData.getSingle();
  $scope.descripciones = {};
  $scope.sendData = SegurosData.getData();
  console.log($scope.sendData);

  $ionicLoading.show({templateUrl:'templates/obteniendo.html'});

  var my_timeout = $timeout(function(){
    //en caso de que la petición tarde demasiado se cancela el loading
    $ionicLoading.hide();
    console.log('Time Out :(')
  },15000);

  SegurosData.getDescripcionesDetalle($scope.auto,$scope.seguro.NombreAseguradora)
  .then(function(response){
    $timeout.cancel(my_timeout);
    $ionicLoading.hide();
    console.log(response);
    var descrip = JSON.parse(response);
    $scope.descripciones = descrip.Descripciones;
  }).catch(function(response){
    $ionicLoading.hide();
    console.log(response);
  });

  $scope.goPaso1 = function(){
    $ionicLoading.show({templateUrl:'templates/enviando.html'});
    $scope.sendData.CveVehic = $scope.sendData.CveVehic.toString();
    console.log($scope.sendData);
    SegurosData.setData($scope.sendData);
    SegurosData.getReCotizacion($scope.sendData).then(function(response){
      console.log(response);
      $ionicLoading.hide();
      SegurosData.setReCotizacion(response);
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });
    // $state.go('app.segCompPaso1');
  }

})// END SEGUROS COMPRA PASO 0 CONTROLLER

// SEGUROS COMPRA PASO 1 CONTROLLER
.controller('SegComp1Ctrl', function($scope, $stateParams, $ionicLoading, SegurosData) {
  $scope.sendData = SegurosData.getData();
  $scope.p_fisica = true;
  $scope.p_moral = false;
  $scope.changeSegurosTab = function(estado){
    if(estado === 'fisica'){
      $scope.p_fisica = true;
      $scope.p_moral = false;
    }else if( estado === 'moral'){
      $scope.p_fisica = false;
      $scope.p_moral = true;
    }
  }
  $scope.goPaso2 = function(){
    SegurosData.setDataForRC($scope.sendData);
    $state.go('app.segCompPaso2');
  }
})// END SEGUROS COMPRA PASO 1 CONTROLLER

// SEGUROS COMPRA PASO 2 CONTROLLER
.controller('SegComp2Ctrl', function($scope, $stateParams, $ionicLoading, SegurosData) {
  $scope.sendData = SegurosData.getDataForRC();
  $scope.goPaso2 = function(){
    SegurosData.setDataForRC($scope.sendData);
    $state.go('app.segCompPaso3');
  }
})// END SEGUROS COMPRA PASO 2 CONTROLLER

// SEGUROS COMPRA PASO 3 CONTROLLER
.controller('SegComp3Ctrl', function($scope, $stateParams, $ionicLoading, SegurosData) {
  $scope.sendData = SegurosData.getDataForRC();
  $scope.goPaso2 = function(){
    SegurosData.setDataForRC($scope.sendData);
    $state.go('app.segCompPaso4');
  }
})// END SEGUROS COMPRA PASO 3 CONTROLLER

// SEGUROS COMPRA PASO 4 CONTROLLER
.controller('SegComp4Ctrl', function($scope, $stateParams, $ionicLoading, SegurosData) {
  $scope.sendData = SegurosData.getDataForRC();
})// END SEGUROS COMPRA PASO 4 CONTROLLER

// GUIA DE PRECIOS CONTROLLER
.controller('GuiaCtrl', function($state, $scope, $rootScope, $stateParams, NgMap, $ionicLoading, $ionicNavBarDelegate) {

})//END GUIA DE PRECIOS CONTROLLER

// CUPONERA CONTROLLER
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

// PERFIL CONTROLLER
.controller('PerfilCtrl', function($state, $scope, $window, NgMap, $ionicLoading, $localStorage, $ionicModal, $ionicHistory, $auth) {
  $scope.$storage = $localStorage
  $scope.carData = {};
  $scope.famData = {};
  $scope.profile = {
    name: "Asaf López",
    family: "López Govea",
    pic: "https://pbs.twimg.com/profile_images/650080647940182016/XQCQTGh6_bigger.jpg",
    carpic: "https://acs2.blob.core.windows.net/imgcatalogo/xl/VA_f5e69006e33442dca2c3bab374ca8817.jpg",
    email: "asaf.eduardo@gmail.com"
  };
  $scope.perfil_cont = true;

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


// AUTOS CONTROLLER
.controller('AutosCtrl',
function($state, $scope, $window,
  $ionicLoading, $localStorage, $ionicModal, $ionicHistory, $auth,
  SegurosData, AutosData,UserData, $cordovaCamera) {

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
    // $ionicLoading.show({templateUrl:'templates/obteniendo.html'});

    // SegurosData.getMarcas().then(function(response){
    //   console.log(response);
    //   $ionicLoading.hide();
    //   var brands = JSON.parse(response);
    //   $scope.marcas = brands.Marcas;
    // }).catch(function(response){
    //   $ionicLoading.hide();
    //   console.log(response);
    //   $ionicLoading.hide();
    //   $scope.showAlert('fail',response);
    // });
  }

  $scope.cerrarModal =  function(){
    $scope.newCarModal.hide();
  }

  $scope.saveCar = function(){
    $ionicLoading.show({templateUrl:'templates/enviando.html'});
    $scope.$storage.car = {marca: $scope.myCar.marca, modelo: $scope.myCar.modelo, descripcion: $scope.myCar.descripcion};
    console.log($scope.$storage.car);
    // AutosData.nuevoAuto($scope.usrId,$scope.myCar).then(function(response){ //ORIGINAL
    AutosData.nuevoAuto($scope.pruebaCar).then(function(response){ // PRUEBA
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
      console.log(imageData)
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

// AUTOS SINGLE CONTROLLER
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


// TEAM CONTROLLER
.controller('TeamCtrl',
function($state, $scope, $rootScope,
  $ionicLoading, $localStorage, $ionicModal, $ionicHistory, $ionicPopup,
  TeamData) {

  $scope.userId = $rootScope.userId;
  $scope.team = {};
  $scope.theresTeam =  false;
  $scope.teamData = {};
  $scope.teamData.name = null;
  $scope.myGuest = {};

  $ionicLoading.show({templateUrl: 'templates/obteniendo.html'});

  TeamData.getTeam($scope.userId).then(function(response){
    $ionicLoading.hide();
    if(response.length == 0){
      $scope.theresTeam = false;
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



.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.filter('capitalize', function() {
  return function(input, all) {
    var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
    return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
  }
});
