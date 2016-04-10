angular.module('starter.controllers', [])

.controller('HomeController', function($scope) {})

.controller('DetailController', function($scope, $ionicNavBarDelegate, $stateParams, Places) {
  // set the title
  //$scope.title = 'Detail';
  // show back button
  $ionicNavBarDelegate.showBackButton(true);

  $scope.place = Places.get($stateParams.placeId);
})

.controller('Location', function($scope, $ionicLoading, $compile, $cordovaGeolocation, 
  $ionicPlatform, Places) {

  $ionicPlatform.ready(function() {    
 
    $ionicLoading.show({
        template: 'Acquiring location!'
    });
     
    var posOptions = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
    };

    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
         
        var myLatlng = new google.maps.LatLng(lat, lng);
         
        var mapOptions = {
            center: myLatlng,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };          
         
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);          
         
        $scope.map = map;   
        $ionicLoading.hide();           
         
    }, function(err) {
        $ionicLoading.hide();
        console.log(err);
    });
  }) 

  function initialize() {
    var myLatlng = new google.maps.LatLng(34,-81);
    // set option for map
    var mapOptions = {
      center: myLatlng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // init map
    var map = new google.maps.Map(document.getElementById("map"),
      mapOptions);

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        myLatlng = pos;
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, map.getCenter());
    }

    // assign to stop
    $scope.map = map;
  }
  // load map when the ui is loaded
  $scope.init = function() {
    initialize();
  }
  //google.maps.event.addDomListener(window, 'load', initialize);

  //$scope.places = Places.all();

  $scope.displayAll = function() {
    $scope.places = Places.all();
    for (var i = 0; i < $scope.places.length; i++) {
      var pos = {lat: $scope.places[i].lat, lng: $scope.places[i].lng};
      var marker = new google.maps.Marker({
        position: pos,
        map: $scope.map,
        title: $scope.places[i].name
      });
    }
  }
})

.controller('SearchController', function($scope ) {})

.controller('SearchFilterController', function($scope, $state, $ionicHistory) {
  // apply filter
  $scope.applyFilter = function() {
    // put your code hear
    // don't show back button in next view
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    // comeback to search screen
    $state.go('tab.search');
  }
})

.controller('AccountController', function($scope ) {})
.controller('AuthController', function($scope ) {});

function handleLocationError(browserHasGeolocation, pos) {
  var marker = new google.maps.Marker({
    position: pos,
    map: map,
    title: browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.'
  });
}