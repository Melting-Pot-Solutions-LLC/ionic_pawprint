var map;
var directionsService;
var directionsDisplay;

angular.module('starter.controllers', [])
.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('MapController', function($scope, $ionicLoading, $compile) {
  $scope.initialize = function() {
    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
    var mapOptions = {
      center: myLatlng,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"),
          mapOptions);
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
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

    directionsDisplay.setMap(map);
    //add a listener for click event
    map.addListener('click', addLatLng);

    $scope.map = map;
  }
  //google.maps.event.addDomListener(window, 'load', initialize);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

function handleLocationError(browserHasGeolocation, pos) {
  var marker = new google.maps.Marker({
    position: pos,
    map: map,
    title: browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.'
  });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, start, end) {
  directionsService.route({
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.WALKING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
var start;
var end;
var count = 0;
function addLatLng(event){
  /*start = event.latLng;//new google.maps.LatLng(event.latLng);
  var marker = new google.maps.Marker({
    position: start,//event.latLng,
    title: 'marker',
    map: map
  });*/
  if(count == 0){
    start = event.latLng;
    count += 1;
    // Add a new marker at the start
    var marker = new google.maps.Marker({
      position: start,
      title: 'start',
      map: map
     });
  }
  else if(count == 1){
    end =event.latLng;
    count = 0;
    // Add a new marker at the end
    var marker = new google.maps.Marker({
      position: end,
      title: 'end',
      map: map
    });
    calculateAndDisplayRoute(directionsService, directionsDisplay, start, end);
  }
}