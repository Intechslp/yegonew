angular.module('starter.seguro.controllers',
['starter.controllers','starter.perfil.controllers','starter.login.controllers',
'ngMap','ngStorage','ng-token-auth','ngCordova'])

// SEGUROS CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('SegurosCtrl', function($state, $scope, $stateParams, $ionicLoading, SegurosData, $ionicNavBarDelegate, $ionicPopup) {
  $ionicNavBarDelegate.showBackButton(false);
  $scope.brands = {};
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
        if(response === "An error has occurred."){
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
//**********


// SEGUROS LISTA CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
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
//**********

// SEGUROS SINGLE CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('SegSingleCtrl', function($state, $scope, $rootScope, $stateParams, $ionicLoading, SegurosData) {
  $scope.seguro = SegurosData.getSingle();
})//END SEGUROS SINGLE CONTROLLER
//**********

// SEGUROS COMPRA PASO 0 CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
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
//**********

// SEGUROS COMPRA PASO 1 CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
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
//**********

// SEGUROS COMPRA PASO 2 CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('SegComp2Ctrl', function($scope, $stateParams, $ionicLoading, SegurosData) {
  $scope.sendData = SegurosData.getDataForRC();
  $scope.goPaso2 = function(){
    SegurosData.setDataForRC($scope.sendData);
    $state.go('app.segCompPaso3');
  }
})// END SEGUROS COMPRA PASO 2 CONTROLLER
//**********

// SEGUROS COMPRA PASO 3 CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('SegComp3Ctrl', function($scope, $stateParams, $ionicLoading, SegurosData) {
  $scope.sendData = SegurosData.getDataForRC();
  $scope.goPaso2 = function(){
    SegurosData.setDataForRC($scope.sendData);
    $state.go('app.segCompPaso4');
  }
})// END SEGUROS COMPRA PASO 3 CONTROLLER
//**********

// SEGUROS COMPRA PASO 4 CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('SegComp4Ctrl', function($scope, $stateParams, $ionicLoading, SegurosData) {
  $scope.sendData = SegurosData.getDataForRC();
})// END SEGUROS COMPRA PASO 4 CONTROLLER
//**********

// MIS SEGUROS CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('MisSegurosCtrl',
function($scope, $state, $stateParams, $localStorage, $ionicLoading, $ionicPopup,
  $ionicModal, $ionicHistory, AutosData, MisSegurosData) {

  $ionicLoading.show({templateUrl: 'templates/obteniendo.html'});
  $scope.$storage = $localStorage;
  $scope.usrId = $scope.$storage.id;
  var usrUid = $scope.$storage.headers.uid;
  $scope.misAutos = [];
  $scope.objS = {};
  $scope.objS.insurance = {};
  $scope.seguro = {};
  $scope.elAuto = {};

  AutosData.getMisAutos($scope.usrId, usrUid).then(function(resp){
    $scope.misAutos = resp;
    $ionicLoading.hide();
  }).catch(function(resp){
    $ionicLoading.hide();
  });

// se declara el modal para dar de alta una carga de gasolina
  $ionicModal.fromTemplateUrl('templates/misSeguros/newMiSeguro.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

// funcion para abrir el modal
  $scope.openModal = function(miauto) {
    $scope.elAuto = miauto;
    $scope.modal.show();
  };

// funcion para cerrar el modal
  $scope.closeModal = function() {
    $scope.modal.hide();
    $state.go('app.misSeguros', $stateParams, {reload: true, inherit: false});
  };

// funcion que envía a la pantalla de mis autos
  $scope.goAutos = function(){
    $ionicHistory.nextViewOptions({
      historyRoot: true
    })
    $state.go('app.autos');
  }

// funcion para añadir nueva información de seguros
  $scope.nuevoSeguro = function(){
    if($scope.comprobarCampos()){
      $ionicLoading.show({templateUrl:'templates/enviando.html'});
      $scope.seguro.vehicle_id = $scope.elAuto.id
      $scope.objS.insurance = $scope.seguro;
      MisSegurosData.newInsurance($scope.objS).then(function(resp){
        $scope.showAlert(
          '¡Éxito!',
          'El seguro de tu auto '+$scope.elAuto.brand+' '+$scope.elAuto.description+
          ' '+$scope.elAuto.model+' ha sido registrado.'
        );
        $ionicLoading.hide();
        $scope.closeModal();
      }).catch(function(resp){
        console.log(resp);
        $ionicLoading.hide();
        $scope.showAlert(
          'Error',
          'Algo ocurrió mientras tratabamos de enviar tu seguro, intenta más tarde'
        );
      });
    }else{
      $scope.showAlert(
        'Error', 'Debes completar al menos los campos requeridos para continuar'
      );
    }
  }
// función para comprobar que los campos esten llenos
  $scope.comprobarCampos = function(){
    if(
      $scope.seguro.company !== undefined &&
      $scope.seguro.policy_number !== undefined &&
      ($scope.seguro.renewal !== undefined || $scope.seguro.renewal != null)
    ){
      return true;
    }else{
      return false;
    }
  }
  $scope.showAlert = function(msj1,msj2) {
    var alertPopup = $ionicPopup.alert({
     title: msj1,
     template: msj2
    });
  }
// función para ver los detalles del seguro
  $scope.goSigle = function(miauto){
    if (miauto.insurances.length > 0) {
      MisSegurosData.setTheCar(miauto);
      $state.go('app.miSeguroSingle');
    }
  }

})// END MIS SEGUROS CONTROLLER
//**********

// MI SEGURO SINGLE CONTROLLER
//–––––––––––––––––––––––––––––––––––––––––––––
.controller('MiSeguroSingleCtrl',
function($scope, $state, $stateParams, $localStorage, $ionicLoading, $ionicPopup,
  $ionicModal, AutosData, MisSegurosData) {
  $scope.$storage = $localStorage;
  $scope.usrId = $scope.$storage.id;
  var usrUid = $scope.$storage.headers.uid;
  $scope.misAutos = [];
  $scope.objS = {};
  $scope.objS.insurance = {};
  $scope.seguro = {};
  $scope.elAuto = {};
  $scope.newInfo ={};

  $scope.elAuto = MisSegurosData.getTheCar();
  $scope.seguroDate = new Date(angular.copy($scope.elAuto.insurances[0].renewal));
  $scope.seguroDate.setHours($scope.seguroDate.getHours()+8 );
  $scope.newInfo = $scope.elAuto.insurances[0];

// se declara el modal para dar de alta una carga de gasolina
  $ionicModal.fromTemplateUrl('templates/misSeguros/editMiSeguro.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

// funcion para abrir el modal
  $scope.openModal = function() {
    $scope.modal.show();
  };

// funcion para cerrar el modal
  $scope.closeModal = function() {
    $scope.elAuto.insurances[0].renewal = $scope.newInfo.renewal;
    $scope.elAuto.insurances[0].company = $scope.newInfo.company;
    $scope.elAuto.insurances[0].contact_phone = $scope.newInfo.contact_phone;
    $scope.elAuto.insurances[0].policy_number = $scope.newInfo.policy_number;
    $scope.modal.hide();
  };


// funcion para añadir nueva información de seguros
  $scope.editarSeguro = function(){
    if($scope.comprobarCampos()){
      $ionicLoading.show({templateUrl:'templates/enviando.html'});
      $scope.seguro.vehicle_id = $scope.elAuto.id;
      $scope.objS.insurance = $scope.seguro;
      MisSegurosData.editInsurance($scope.elAuto.insurances[0].id,$scope.objS).then(function(resp){
        $scope.newInfo = resp;
        $scope.showAlert(
          '¡Éxito!',
          'El seguro de tu auto '+$scope.elAuto.brand+' '+$scope.elAuto.description+
          ' '+$scope.elAuto.model+' ha sido actualizado.'
        );
        $ionicLoading.hide();
        $scope.closeModal();
      }).catch(function(resp){
        console.log(resp);
        $ionicLoading.hide();
        $scope.showAlert(
          'Error',
          'Algo ocurrió mientras tratabamos de enviar tu seguro, intenta más tarde'
        );
      });
    }else{
      $scope.showAlert(
        'Error', 'Debes completar al menos los campos requeridos para continuar'
      );
    }
  }
// función para comprobar que los campos esten llenos
  $scope.comprobarCampos = function(){
    if(
      $scope.seguro.company !== undefined &&
      $scope.seguro.policy_number !== undefined &&
      ($scope.seguro.renewal !== undefined || $scope.seguro.renewal != null)
    ){
      console.log('true');
      return true;
    }else{
      console.log('false');
      return false;
    }
  }

  $scope.showAlert = function(msj1,msj2) {
    var alertPopup = $ionicPopup.alert({
     title: msj1,
     template: msj2
    });
  }

})// END MI SEGURO SINGLE CONTROLLER
//**********
;
