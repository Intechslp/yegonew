// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'ionic.service.core',
  'starter.controllers',
  'ngStorage',
  'angularSoap',
  'ng-token-auth'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleBlackTranslucent();
    }
    // function displayMessage (message) {
    //   navigator.notification.alert(message, null, ‘CodePush’, ‘OK’);
    // }
    // window.codePush.sync(function (syncStatus) {
    //   switch (syncStatus) {
    //     case SyncStatus.APPLY_SUCCESS:
    //       //Success
    //       return;
    //     case SyncStatus.UP_TO_DATE:
    //       displayMessage(“The application is up to date.”);
    //       break;
    //     case SyncStatus.UPDATE_IGNORED:
    //       displayMessage(“The user decided not to install the optional
    //       update.”);
    //       break;
    //     case SyncStatus.ERROR:
    //       displayMessage(“An error occurred while checking for
    //       updates”);
    //       break;
    //   }
    // });

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $authProvider) {
  $authProvider.configure({
    apiUrl: 'https://stage-yego-backoffice.herokuapp.com/api/v1',
    storage: 'localStorage'
  });

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
    url: '/directorio/:subcatName/:subcatId',
    views: {
      'menuContent': {
        templateUrl: "templates/directorio/list.html",
        controller: 'DirListCtrl'
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
  // CERCA DE MI
  .state('app.cerca', {
    url: '/cerca',
    views: {
      'menuContent': {
        templateUrl: 'templates/cerca.html',
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
  // PROFILE
  .state('app.perfil', {
    url: '/perfil',
    views: {
      'menuContent': {
        templateUrl: "templates/perfil/perfil.html",
        controller: 'PerfilCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
