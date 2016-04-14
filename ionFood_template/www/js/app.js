/* Autor: Duy Thanh Dao */

angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {

    setTimeout(function () {
        //navigator.splashscreen.hide();
    }, 2000);

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
        //StatusBar.styleDefault();
        StatusBar.styleLightContent();
    }

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.backButton.text('');

    // set tabs position on the top
    $ionicConfigProvider.tabs.position('top');

    $stateProvider
    .state('app', {
      url: '/app',
      abstract: true
    })
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('about', {
    url: '/about',
    //views: {
      templateUrl: 'templates/help.html'
    //}
  })
  .state('reviews', {
    url: '/reviews',
    //views: {
      templateUrl: 'templates/reviews.html'
    //}
  })
  .state('friends', {
    url: '/friends',
    //views: {
      templateUrl: 'templates/friends.html'
    //}
  })
  .state('liked', {
    url: '/liked',
    //views: {
      templateUrl: 'templates/liked.html'
    //}
  })
  .state('checkIn', {
    url: '/checkIn',
    //views: {
      templateUrl: 'templates/checkIn.html'
    //}
  })
  .state('settings', {
    url: '/settings',
    //views: {
      templateUrl: 'templates/settings.html'
    //}
  })
  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeController'
      }
    }
  })

  // map view mode
  .state('tab.location', {
    url: '/map',
    views: {
      'tab-location': {
        templateUrl: 'templates/tab-location.html',
        controller: 'Location'
      }
    }
  })

  // search
  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchController'
      }
    }
  })

  // search filter
  .state('tab.search_filter', {
    url: '/search-filters',
    views: {
      'tab-search': {
        templateUrl: 'templates/search-filters.html',
        controller: 'SearchFilterController'
      }
    }
  })

  // view restaurant detail
  .state('detail', {
    url: '/location/:placeId',
    templateUrl: 'templates/detail.html',
    controller: 'DetailController'
  })

  // view user account
  .state('account', {
    url: '/account',
    templateUrl: 'templates/account.html',
    controller: 'AccountController'
  })

  // login screen
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  // register screen
  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegCtrl'
  });

  // default url state
  $urlRouterProvider.otherwise('/login');

});
