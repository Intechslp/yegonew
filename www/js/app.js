// Ionic Starter App
var cl = cloudinary.Cloudinary.new();
cl.fromDocument();
cl.config({
  cloud_name: 'omakase',
  api_key: '652759349695989',
  api_secret: '501cteUDvB3OlgXUoqfs52spiAM'
});
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'ionic.service.core',
  'starter.controllers',
  'starter.perfil.controllers',
  'ngStorage',
  'angularSoap',
  'ng-token-auth',
  'ngCordova',
  'jrCrop',
  'ngAnimate'
])

.run(function($ionicPlatform, $cordovaSQLite, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    setTimeout(function() {
      if(navigator.splashscreen !== undefined){
        navigator.splashscreen.hide();
      }
    }, 300);

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $authProvider) {
  $authProvider.configure({
    /* production */
    apiUrl: 'https://production-yego-backoffice.herokuapp.com/api/v1',
    storage: 'localStorage'
  });
  $ionicConfigProvider.backButton.previousTitleText(false);

  // STATE PROVIDER
  $stateProvider
  // LOGIN
  .state('login',{
    url: '/login',
    templateUrl: 'templates/login/login.html',
    controller: "LoginCtrl"
  })
  // LOCATION
  .state('location',{
    url: '/location',
    templateUrl: 'templates/login/location.html',
    controller: "LocationCtrl"
  })
  // AUTOREG
  .state('autoReg',{
    url: '/autoReg',
    templateUrl:'templates/login/autoReg.html',
    controller: "AutoRegCtrl"
  })
  // WELCOME
  .state('welcome',{
    url:'/welcome',
    templateUrl: 'templates/login/welcome.html',
    controller: 'WelcomeCtrl'
  })
  // APP MENU
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  /* DIRECTORIO
  –––––––––––––––––––––––––––––––––––*/
  .state('app.directorio', {
    url: '/directorio',
    views: {
      'menuContent': {
        templateUrl: "templates/directorio/directorio.html",
        controller: 'DirectorioCtrl'
      }
    }
  })
  // DIRECTORIO CATEGORIAS
  .state('app.dirCat', {
    url: '/directorio/cat/:catName',
    views: {
      'menuContent': {
        templateUrl: "templates/directorio/cat.html",
        controller: 'DirCatCtrl'
      }
    }
  })
  // DIRECTORIO LISTA DE NEGOCIOS
  .state('app.dirList', {
    url: '/directorio/subcat/:subcatName/:subcatId',
    views: {
      'menuContent': {
        templateUrl: "templates/directorio/list.html",
        controller: 'DirListCtrl'
      }
    }
  })
  // DIRECTORIO LISTA DE GASOLINERAS
  .state('app.gasList', {
    url: '/directorio/gasolineras',
    views: {
      'menuContent': {
        templateUrl: "templates/directorio/gaslist.html",
        controller: 'GasListCtrl'
      }
    }
  })
  // DIRECTORIO SINGLE
  .state('app.dirSingle', {
    url: '/directorio/single/:singleId',
    views: {
      'menuContent': {
        templateUrl: "templates/directorio/single.html",
        controller: 'DirSingleCtrl'
      }
    }
  })
  // DIRECTORIO SINGLE GASOLINERA
  .state('app.gasSingle', {
    url: '/directorio/gasolineras/:gasId',
    views: {
      'menuContent': {
        templateUrl: "templates/directorio/gassingle.html",
        controller: 'GasSingleCtrl'
      }
    }
  })
  // DIRECTORIO MAPA
  .state('app.dirMapa', {
    url: '/directorio/mapa',
    views: {
      'menuContent': {
        templateUrl: "templates/directorio/mapa.html",
        controller: 'DirMapaCtrl'
      }
    }
  })
  // CERCA DE MI
  .state('app.cerca', {
    url: '/cerca',
    views: {
      'menuContent': {
        templateUrl: 'templates/directorio/cerca.html',
        controller: 'CercaCtrl'
      }
    }
  })
  /* SEGUROS
  –––––––––––––––––––––––––––––––––––*/
  .state('app.seguros', {
    url: '/seguros',
    views: {
      'menuContent': {
        templateUrl: "templates/seguros/seguros.html",
        controller: 'SegurosCtrl'
      }
    }
  })
  // COMPARA
  .state('app.segLista', {
    url: '/seguros/lista',
    views: {
      'menuContent': {
        templateUrl: "templates/seguros/lista.html",
        controller: 'SegListCtrl'
      }
    }
  })
  // SEGUROS SINGLE
  .state('app.segSingle', {
    url: '/seguros/single',
    views: {
      'menuContent': {
        templateUrl: "templates/seguros/segSingle.html",
        controller: 'SegSingleCtrl'
      }
    }
  })
  // SEGUROS COMPRA PASO 0
  .state('app.segCompPaso0', {
    url: '/seguros/compra/paso/0',
    views: {
      'menuContent': {
        templateUrl: "templates/seguros/compra-0.html",
        controller: 'SegComp0Ctrl'
      }
    }
  })
  // SEGUROS COMPRA PASO 1
  .state('app.segCompPaso1', {
    url: '/seguros/compra/paso/1',
    views: {
      'menuContent': {
        templateUrl: "templates/seguros/compra-1.html",
        controller: 'SegComp1Ctrl'
      }
    }
  })
  // SEGUROS COMPRA PASO 2
  .state('app.segCompPaso2', {
    url: '/seguros/compra/paso/2',
    views: {
      'menuContent': {
        templateUrl: "templates/seguros/compra-2.html",
        controller: 'SegComp2Ctrl'
      }
    }
  })
  // SEGUROS COMPRA PASO 3
  .state('app.segCompPaso3', {
    url: '/seguros/compra/paso/3',
    views: {
      'menuContent': {
        templateUrl: "templates/seguros/compra-3.html",
        controller: 'SegComp3Ctrl'
      }
    }
  })
  // SEGUROS COMPRA PASO 4
  .state('app.segCompPaso4', {
    url: '/seguros/compra/paso/4',
    views: {
      'menuContent': {
        templateUrl: "templates/seguros/compra-4.html",
        controller: 'SegComp4Ctrl'
      }
    }
  })
  // SEGUROS ENVÍO EXITOSO
  .state('app.segurosSuccess', {
    url: '/seguros/compra/success',
    views: {
      'menuContent': {
        templateUrl: "templates/seguros/success.html",
        controller: 'SegSuccessCtrl'
      }
    }
  })
  /* LIBRO GUIA DE PRECIOS
  –––––––––––––––––––––––––––––––––––*/
  .state('app.guia',{
    url: '/guia',
    views: {
      'menuContent':{
        templateUrl: 'templates/guia/guia.html',
        controller: 'GuiaCtrl'
      }
    }
  })
  // CUPONERA
  .state('app.cuponera',{
    url: '/cuponera',
    views: {
      'menuContent':{
        templateUrl: 'templates/cuponera/cuponera.html',
        controller: 'CuponeraCtrl'
      }
    }
  })
  // CUPON single
  .state('app.cupon',{
    url: '/cupon',
    views: {
      'menuContent':{
        templateUrl: 'templates/cuponera/cupon.html',
        controller: 'CuponCtrl'
      }
    }
  })
  /* PERFIL
  –––––––––––––––––––––––––––––––––––*/
  // PROFILE
  .state('app.perfil', {
    url: '/perfil',
    views: {
      'menuContent': {
        templateUrl: "templates/perfil/perfil.html",
        controller: 'PerfilCtrl'
      }
    }
  })
/* AUTOS
–––––––––––––––––––––––––––––––––––*/
  // Autos General
  .state('app.autos', {
    url: '/autos',
    views: {
      'menuContent': {
        templateUrl: "templates/autos/autos.html",
        controller: 'AutosCtrl'
      }
    }
  })

  // Autos single
  .state('app.autoSingle', {
    url: '/autos/:autoId',
    views: {
      'menuContent': {
        templateUrl: "templates/autos/autoSingle.html",
        controller: 'AutoSingleCtrl'
      }
    }
  })

  /* TEAM YEGO
  –––––––––––––––––––––––––––––––––––*/
  // Team
  .state('app.team', {
    url: '/team',
    views: {
      'menuContent': {
        templateUrl: "templates/team/team.html",
        controller: 'TeamCtrl'
      }
    }
  })

  /* NEGOCIOS
  –––––––––––––––––––––––––––––––––––*/
  // lista de negocios
  .state('app.negocios', {
    url: '/negocios',
    views: {
      'menuContent': {
        templateUrl: "templates/negocios/negocios.html",
        controller: 'NegociosCtrl'
      }
    }
  })
  // negocio single
  .state('app.singleNegocio', {
    url: '/negocios/:idNeg',
    views: {
      'menuContent': {
        templateUrl: "templates/negocios/singleNegocio.html",
        controller: 'SingleNegocioCtrl'
      }
    }
  })
  // sucursales single
  .state('app.singleSucursal', {
    url: '/negocios/:idNeg/sucursales/:idSuc',
    views: {
      'menuContent': {
        templateUrl: "templates/negocios/singleSucursal.html",
        controller: 'SingleSucursalCtrl'
      }
    }
  })
  /* ACERCA DE
  –––––––––––––––––––––––––––––––––––*/
  // about
  .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: "templates/about.html",
        controller: 'AboutCtrl'
      }
    }
  })

  /* CARGAS DE GASOLINA
  –––––––––––––––––––––––––––––––––––*/
  // cargas
  .state('app.cargas', {
    url: '/cargas',
    views: {
      'menuContent': {
        templateUrl: "templates/cargas/cargas.html",
        controller: 'CargasCtrl'
      }
    }
  })
  // cargasSingle
  .state('app.cargasSingle', {
    url: '/cargas/singleCar',
    views: {
      'menuContent': {
        templateUrl: "templates/cargas/cargasSingle.html",
        controller: 'CargasSingleCtrl'
      }
    }
  })
  // cargas resumen
  .state('app.resumenMes', {
    url: '/cargas/:cargaId',
    views: {
      'menuContent': {
        templateUrl: "templates/cargas/resumenMes.html",
        controller: 'ResumenMesCtrl'
      }
    }
  })
  /* MIS SEGUROS
  –––––––––––––––––––––––––––––––––––*/
  // mis seguros
  .state('app.misSeguros', {
    url: '/misSeguros',
    views: {
      'menuContent': {
        templateUrl: "templates/misSeguros/misSeguros.html",
        controller: 'MisSegurosCtrl'
      }
    }
  })
  .state('app.miSeguroSingle', {
    url: '/miSeguroSingle',
    views: {
      'menuContent': {
        templateUrl: "templates/misSeguros/miSeguro.html",
        controller: 'MiSeguroSingleCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
