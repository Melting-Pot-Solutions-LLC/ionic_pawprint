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
  .state('detail', {
    url: '/detail',
        templateUrl: 'templates/detail.html',
        controller: 'DetailController'
  })
  .state('meetUp', {
    url: '/meetUp',
    templateUrl: 'templates/meetUp.html',
    controller: 'MeetUpController'
  })
  .state('addMeet', {
    url: '/AddMeetUp',
    templateUrl: 'templates/addMeet.html',
    controller: 'AddMeetController'
  })
  .state('about', {
    url: '/about',
    templateUrl: 'templates/help.html'
  })
  .state('history', {
    url: '/history',
    templateUrl: 'templates/history.html'
  })
  .state('addaplace', {
    url: '/addaplace',
    templateUrl: 'templates/add_a_place.html',
    controller: 'AddPlaceController'
  })
  .state('friends', {
    url: '/friends',
    templateUrl: 'templates/friends.html'
  })
  .state('liked', {
    url: '/liked',
    templateUrl: 'templates/liked.html'
  })
  .state('checkIn', {
    url: '/checkIn',
    templateUrl: 'templates/checkIn.html'
  })
  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html'
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
  .state('RBLoc', {
    url: '/mapRB',
        templateUrl: 'templates/RBLoc.html',
        controller:'RBController'
  })
  .state('VPLoc', {
    url: '/mapVP',
        templateUrl: 'templates/VPLoc.html',
        controller: 'VPController'
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

  
  // view meet up detail
  .state('meetUpDetail', {
    url: '/meetUp/:meetUpId',
    templateUrl: 'templates/meetUpDetail.html',
    controller: 'MeetUpDetailController'
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
