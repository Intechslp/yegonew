angular.module('starter.controllers', ['ngMap','ngStorage','ng-token-auth','ngCordova'])

// APP CONTROLLER
.controller('AppCtrl', function($scope, $filter, $ionicModal, $timeout,$state,$ionicHistory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.profile = {
    name: "Asaf López",
    family: "López Govea",
    user: "saporules",
    pic: "https://pbs.twimg.com/profile_images/768688103561175041/pDR4Qpx__bigger.jpg",
    carpic: "https://acs2.blob.core.windows.net/imgcatalogo/xl/VA_f5e69006e33442dca2c3bab374ca8817.jpg"
  };

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
    $state.go('app.directorio');
  }).catch(function(resp){
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
    $ionicLoading.show();
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
          $scope.$storage.user = response;
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
  }

  $scope.regBtnClick = function() {
    $scope.registerData.user_roles = {"add_role":"appuser"}
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
  $scope.loadCities = function(estadoId){
    console.log('loadCities()');
    console.log(estadoId);
    $ionicLoading.show();
    LocationData.getCities(estadoId).then(function(resp){
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
.controller('AutoRegCtrl', function ($scope, $state, $filter, $localStorage) {
  $scope.$storage = $localStorage;
  $scope.saveCar = function(option){
    $scope.$storage.car = {marca: $scope.carData.marca, modelo: $scope.carData.modelo, ano: $scope.carData.ano};
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

  $scope.showAlert = function(res, response) {
    var alertPopup = $ionicPopup.alert({
      title: 'Ups!',
      template: 'Hubo un error accediendo a la base de datos'
    });

    alertPopup.then(function(res) {
      //console.log('Thank you for not eating my delicious ice cream cone');
    });
  };
  $ionicLoading.show({templateUrl:'templates/obteniendo.html'});
  EstablecimientosData.getCategorias().then(function(response){
    $scope.categories = response;
    // console.log($scope.categories);
    $ionicLoading.hide();
  }).catch(function(response){
    // console.log(response);
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
    // $scope.sendData = angular.copy($scope.master);
    // $scope.sendData.tipoAuto = '';
    // $scope.sendData.Marca = '';
    // $scope.sendData.Modelo = '';
    // $scope.sendData.Descripcion = '';
    // $scope.sendData.Edad = '';
    // $scope.sendData.Genero = '';
    // $scope.sendData.CPostal = '';
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
  // $ionicLoading.show();
//   $scope.datos = {
// 	"IDXML": null,
// 	"Grupo": null,
// 	"GrupoAbr": "YEGO",
// 	"GrupoNombre": null,
// 	"NuevaCotizacion": null,
// 	"Vehiculo": null,
// 	"Contacto": {
// 		"RFC": null,
// 		"Nombre": null,
// 		"ApellidoPaterno": null,
// 		"ApellidoMaterno": null,
// 		"Edad": "25",
// 		"Genero": "MASCULINO",
// 		"FechaNacimiento": "\/Date(-62135575200000)\/",
// 		"LugarNacimiento": null,
// 		"Cliente": null,
// 		"Direccion": {
// 			"Calle": null,
// 			"NoExterior": null,
// 			"NoInterior": null,
// 			"CPostal": "78250",
// 			"IDColonia": 0,
// 			"Colonia": null,
// 			"IDCiudad": 0,
// 			"Ciudad": null,
// 			"Estado": null,
// 			"IDEstado": 0,
// 			"Pais": null
// 		},
// 		"Email": null,
// 		"Telefono": null,
// 		"Celular": null,
// 		"RazonSocial": null,
// 		"TipoPersona": null,
// 		"Nacionalidad": null
// 	},
// 	"FormadePago": {
// 		"NombreFPago": 0,
// 		"MedioPago": 0
// 	},
// 	"RespuestaCotizacion": null,
// 	"Cotizacion": [
//     {
// 		"URL": null,
// 		"VehiculoCotizado": "CHEVROLET AVEO DT CE PAQ-C C/ACC. V-TELA CD 5PAS. 4PTAS. AUT. L4 MPI",
// 		"NumeroCotizacion": null,
// 		"FechaInicio": "\/Date(1472446800000)\/",
// 		"FechaFin": "\/Date(1503982800000)\/",
// 		"PrimaNeta": 5713.5508,
// 		"PrimaTotal": 6387.5613,
// 		"Impuesto": 881.043,
// 		"Descuento": 857.0325,
// 		"Recargos": 0,
// 		"Derechos": 650,
// 		"PorcentajeImp": 0,
// 		"PrimerPago": 6387.5632000000005,
// 		"PagosSubsecuentes": 0,
// 		"ClavePaquete": null,
// 		"ViaWS": false,
// 		"IDAseguradora": "0",
// 		"NombreAseguradora": "ABA",
// 		"Cobertura": {
// 			"Danios_Materiales": "-NDAÑOS MATERIALES-SAmparada-D5.00 %",
// 			"Robo_Total": "-NROBO TOTAL-SAmparada-D10.00 %",
// 			"RC_Bienes": "-NRESPONSABILIDAD CIVIL POR DAÑOS A TERCEROS-SAmparada-DDSMVDF",
// 			"RC_Personas": "-NRESPONSABILIDAD CIVIL PERSONAS-SAmparada-DUMA",
// 			"Defensa_Legal": "-NASISTENCIA LEGAL PROVIAL *-SAmparada-D",
// 			"Gastos_Medicos_Ocupantes": "-NGASTOS MÉDICOS OCUPANTES-SAmparada-D",
// 			"Asistencia_Vial": "-NASISTENCIA EN VIAJE IKE *-SAmparada-D",
// 			"RC_MuerteAccidental": "-NRESPONSABILIDAD CIVIL POR FALLECIMIENTO-SAmparada-D",
// 			"RC_USA": "-NRESPONSABILIDAD CIVIL USA ACE-SAmparada-DNo aplica",
// 			"Gestoria_Vial": "N/A",
// 			"RC_Familiar": "-NRESPONSABILIDAD  CIVIL  FAMILIAR-SAmparada-D",
// 			"Extencion_RC": "N/A",
// 			"Cob_Cristales": "N/A",
// 			"DescuentCotizacion": "15"
// 		}
// 	},{
// 		"URL": null,
// 		"VehiculoCotizado": " ",
// 		"NumeroCotizacion": null,
// 		"FechaInicio": "\/Date(1472446800000)\/",
// 		"FechaFin": "\/Date(1503982800000)\/",
// 		"PrimaNeta": 0,
// 		"PrimaTotal": 0,
// 		"Impuesto": 0,
// 		"Descuento": 0,
// 		"Recargos": 0,
// 		"Derechos": 0,
// 		"PorcentajeImp": 0,
// 		"PrimerPago": 0,
// 		"PagosSubsecuentes": 0,
// 		"ClavePaquete": null,
// 		"ViaWS": false,
// 		"IDAseguradora": "1",
// 		"NombreAseguradora": "AXA",
// 		"Cobertura": {
// 			"Danios_Materiales": null,
// 			"Robo_Total": null,
// 			"RC_Bienes": null,
// 			"RC_Personas": null,
// 			"Defensa_Legal": null,
// 			"Gastos_Medicos_Ocupantes": null,
// 			"Asistencia_Vial": null,
// 			"RC_MuerteAccidental": "N/A",
// 			"RC_USA": "N/A",
// 			"Gestoria_Vial": "N/A",
// 			"RC_Familiar": "N/A",
// 			"Extencion_RC": "N/A",
// 			"Cob_Cristales": "N/A",
// 			"DescuentCotizacion": ""
// 		}
// 	}, {
// 		"URL": null,
// 		"VehiculoCotizado": "CHEVROLET AVEO CE PAQ-M C/ACC. CD 5PAS. 4PTAS. STD. 4CIL.",
// 		"NumeroCotizacion": null,
// 		"FechaInicio": "\/Date(1472446800000)\/",
// 		"FechaFin": "\/Date(1503982800000)\/",
// 		"PrimaNeta": 0,
// 		"PrimaTotal": 0,
// 		"Impuesto": 0,
// 		"Descuento": 0,
// 		"Recargos": 0,
// 		"Derechos": 0,
// 		"PorcentajeImp": 0,
// 		"PrimerPago": 0,
// 		"PagosSubsecuentes": 0,
// 		"ClavePaquete": null,
// 		"ViaWS": false,
// 		"IDAseguradora": "2",
// 		"NombreAseguradora": "BANORTE",
// 		"Cobertura": null
// 	}, {
// 		"URL": null,
// 		"VehiculoCotizado": "CHEVROLET AVEO CE PAQ-M C/ACC. MP3 STD.",
// 		"NumeroCotizacion": "4876224",
// 		"FechaInicio": "\/Date(1472446800000)\/",
// 		"FechaFin": "\/Date(1503982800000)\/",
// 		"PrimaNeta": 6102.5,
// 		"PrimaTotal": 7653.11,
// 		"Impuesto": 1055.6,
// 		"Descuento": 0,
// 		"Recargos": 0,
// 		"Derechos": 495,
// 		"PorcentajeImp": 0,
// 		"PrimerPago": 7653.11,
// 		"PagosSubsecuentes": 0,
// 		"ClavePaquete": null,
// 		"ViaWS": false,
// 		"IDAseguradora": "3",
// 		"NombreAseguradora": "GNP",
// 		"Cobertura": {
// 			"Danios_Materiales": "-NDAÑOS MATERIALES-SV. CONVENIDO68,355.00-D3,417.75",
// 			"Robo_Total": "-NROBO TOTAL-SV. CONVENIDO68,355.00-D6,835.50",
// 			"RC_Bienes": "-NRESPONSABILIDAD CIVIL POR DAÑOS A TERCEROS-S3000000-D",
// 			"RC_Personas": "N/A",
// 			"Defensa_Legal": "-NPROTECCIÓN LEGAL-SAMPARADA-D",
// 			"Gastos_Medicos_Ocupantes": "-NGASTOS MÉDICOS OCUPANTES-S200000-D",
// 			"Asistencia_Vial": "N/A",
// 			"RC_MuerteAccidental": "N/A",
// 			"RC_USA": "N/A",
// 			"Gestoria_Vial": "N/A",
// 			"RC_Familiar": "N/A",
// 			"Extencion_RC": "-NEXTENSIÓN COBERTURA RESP. CIVIL-SAMPARADA-D",
// 			"Cob_Cristales": "-NCRISTALES-SAMPARADA-D",
// 			"DescuentCotizacion": "0"
// 		}
// 	}, {
// 		"URL": null,
// 		"VehiculoCotizado": "CHEVROLET AVEO CE PAQ-M 5PAS.",
// 		"NumeroCotizacion": null,
// 		"FechaInicio": "\/Date(1472446800000)\/",
// 		"FechaFin": "\/Date(1503982800000)\/",
// 		"PrimaNeta": 3748.27935599527,
// 		"PrimaTotal": 4881.6040529545135,
// 		"Impuesto": 673.32469695924317,
// 		"Descuento": 0,
// 		"Recargos": 0,
// 		"Derechos": 460,
// 		"PorcentajeImp": 0,
// 		"PrimerPago": 0,
// 		"PagosSubsecuentes": 0,
// 		"ClavePaquete": null,
// 		"ViaWS": false,
// 		"IDAseguradora": "4",
// 		"NombreAseguradora": "HDI",
// 		"Cobertura": null
// 	}, {
// 		"URL": null,
// 		"VehiculoCotizado": "CHEVROLET AVEO CE PAQ-M",
// 		"NumeroCotizacion": "1640105415838",
// 		"FechaInicio": "\/Date(1472446800000)\/",
// 		"FechaFin": "\/Date(1503982800000)\/",
// 		"PrimaNeta": 1995.41,
// 		"PrimaTotal": 2836.68,
// 		"Impuesto": 391.27,
// 		"Descuento": 0,
// 		"Recargos": 0,
// 		"Derechos": 450,
// 		"PorcentajeImp": 0,
// 		"PrimerPago": 2836.68,
// 		"PagosSubsecuentes": 0,
// 		"ClavePaquete": null,
// 		"ViaWS": false,
// 		"IDAseguradora": "5",
// 		"NombreAseguradora": "MAPFRE",
// 		"Cobertura": {
// 			"Danios_Materiales": "-NDAÑOS MATERIALES-SV. Convenido-D5%",
// 			"Robo_Total": "-NROBO TOTAL-SV. Convenido-D10%",
// 			"RC_Bienes": "-NRC A TERCEROS EN SUS BIENES-S500000-D",
// 			"RC_Personas": "-NRC A TERCEROS EN SUS PERSONAS-S500000-D",
// 			"Defensa_Legal": "-NDEFENSA JURIDICA-SAmparada-D",
// 			"Gastos_Medicos_Ocupantes": "-NGASTOS MEDICOS-S200000-D",
// 			"Asistencia_Vial": "-NASISTENCIA COMPLETA-SAmparada-D",
// 			"RC_MuerteAccidental": "-NRC CATASTROFICA POR MUERTE ACC-S2000000-D",
// 			"RC_USA": "N/A",
// 			"Gestoria_Vial": "N/A",
// 			"RC_Familiar": "N/A",
// 			"Extencion_RC": "N/A",
// 			"Cob_Cristales": "N/A",
// 			"DescuentCotizacion": null
// 		}
// 	}, {
// 		"URL": null,
// 		"VehiculoCotizado": "CHEVROLET AVEO CE PAQ-F C/ACC. CD | MP3 5PAS. AUT. 1.60L 103HP ABS",
// 		"NumeroCotizacion": null,
// 		"FechaInicio": "\/Date(1472446800000)\/",
// 		"FechaFin": "\/Date(1503982800000)\/",
// 		"PrimaNeta": 4904.15,
// 		"PrimaTotal": 6425.41,
// 		"Impuesto": 886.26,
// 		"Descuento": 0,
// 		"Recargos": 0,
// 		"Derechos": 635,
// 		"PorcentajeImp": 0,
// 		"PrimerPago": 6425.41,
// 		"PagosSubsecuentes": 0,
// 		"ClavePaquete": null,
// 		"ViaWS": false,
// 		"IDAseguradora": "6",
// 		"NombreAseguradora": "QUALITAS",
// 		"Cobertura": {
// 			"Danios_Materiales": "-NDAÑOS MATERIALES-S83000-D0005",
// 			"Robo_Total": "-NROBO TOTAL-S83000-D00010",
// 			"RC_Bienes": "-NRESPONSABILIDAD CIVIL-S3000000-D0000",
// 			"RC_Personas": "N/A",
// 			"Defensa_Legal": "-NGASTOS LEGALES-S3000000-D0",
// 			"Gastos_Medicos_Ocupantes": "-NGASTOS MÉDICOS-S200000-D0",
// 			"Asistencia_Vial": "-NASISTENCIA VIAL-S8560-D0",
// 			"RC_MuerteAccidental": "-NMUERTE DEL CONDUCTOR POR ACCIDENTE AUTOMOVILISTICO-S100000-D0",
// 			"RC_USA": "-NRC EN EL EXTRANJERO-S1200000-D",
// 			"Gestoria_Vial": "N/A",
// 			"RC_Familiar": "N/A",
// 			"Extencion_RC": "-NEXTENSIÓN DE RC-S3000000-D0",
// 			"Cob_Cristales": "N/A",
// 			"DescuentCotizacion": "30"
// 		}
// 	}],
// 	"DatosCompra": null,
// 	"Oportunidad": null,
// 	"GeneraOT": false
// }
  // $scope.sendData={
  //   edad: 25,
  //   marca: 'CHEVROLET',
  //   cp: '78250',
  //   genero: 'MASCULINO',
  //   tipo: 'PARTICULAR',
  //   modelo: 2010,
  //   descripcion: 'AVEO',
  //   plan: 'AMPLIA',
  //   periodo: 'MENSUAL',
  //   grupo: 'YEGO'
  // };
  // $ionicLoading.show();
  // SegurosData.getCotizacion($scope.sendData).then(function(response){
  //   $scope.datos = response;
  //   // console.log($scope.datos);
  //   $ionicLoading.hide();
  // }).catch(function(response){
  //   $ionicLoading.hide();
  //   console.log(response);
  // });

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
  $scope.garage_cont = false;
  $scope.familia_cont = false;
  $scope.changeProfileTab = function(tab){
    if(tab === 'perfil'){
      $scope.perfil_cont = true;
      $scope.garage_cont = false;
      $scope.familia_cont = false;
    }else if(tab === 'garage'){
      $scope.perfil_cont = false;
      $scope.garage_cont = true;
      $scope.familia_cont = false;
    }else if(tab === 'familia'){
      $scope.perfil_cont = false;
      $scope.garage_cont = false;
      $scope.familia_cont = true;
    }
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

  $ionicModal.fromTemplateUrl('templates/modals/newcar.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.newCarModal = modal;
  });

  $scope.newCar = function(){
    $scope.newCarModal.show();
  }
  $scope.saveCar = function(option){
    if (option === 'cerrar') {
      $scope.newCarModal.hide();
    }else{
      $scope.$storage.car = {marca: $scope.carData.marca, modelo: $scope.carData.modelo, ano: $scope.carData.ano};
      console.log($scope.$storage.car);
      $scope.newCarModal.hide();
    }
  }

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.filter('capitalize', function() {
  return function(input, all) {
    var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
    return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
  }
});
