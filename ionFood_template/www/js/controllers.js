angular.module('starter.controllers', ['firebase'])

.controller('HomeController', function($scope) {})


.controller('SideMenuController', function($scope, $rootScope) {
  $scope.open_menu = function()
  {
    
  }

})


.controller('AccountCtrl', function($scope) {


  console.log("in the main menu");
})

.controller('LoginCtrl', function($scope, $firebaseAuth, $state, $rootScope) {

  $scope.login_with_FB = function()
  {
    console.log("...logging in with FB...");
    var authObject = $firebaseAuth(myDataRef_users_facebook);

    authObject.$authWithOAuthPopup('facebook').then(function(authData)
    {
      console.log(authData);
      console.log("...successfully logged in with FB...");
      myDataRef_users_facebook.push(authData);
      $rootScope.user_name = authData.facebook.displayName;
      $rootScope.uid  = authData.facebook.uid;
      console.log("user's name is ", $rootScope.user_name);
      $state.go('tab.home');

    }).catch(function(error) {
      console.log("Error logging in with FB");
    })
  }

  $scope.login_with_gmail = function()
  {
    console.log("...logging in with GMail...");
    myDataRef_user_gmail.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        console.log("Error logging in with GMail");
      } else {
        console.log("...successfully logged in with GMail...", authData);
        myDataRef_user_gmail.push(authData);
        $state.go('tab.home');
      }
    });

  }

})

.controller('DetailController', function($scope, $ionicNavBarDelegate, $stateParams, Places) {
  // set the title
  //$scope.title = 'Detail';
  // show back button
  $ionicNavBarDelegate.showBackButton(true);

  //$scope.place = Places.get($stateParams.placeId);
})

.controller('Location', function($scope, $ionicLoading, $compile, Places) {
  function initialize() {
    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
    // set option for map
    var mapOptions = {
      center: myLatlng,
      zoom: 11,
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
  $scope.init = function() 
  {
    initialize();

    //added by Steve
    myDataRef.on("value", function(snapshot)
    {
      console.log("here is the DB" + snapshot.val());
      $scope.places_in_database = snapshot.val();
      $scope.places_to_show = [];
      $scope.markers = [];
      $scope.displayAll();
    }, function (errorObject) 
    {
      console.log("The read failed: " + errorObject.code);
    });
  }
  //google.maps.event.addDomListener(window, 'load', initialize);

  //$scope.places = Places.all();

  $scope.deleteMarkers = function()
  {
    console.log("deleting markers...");
    for (var i = 0; i < $scope.markers.length; i++)
    {
      $scope.markers[i].setMap(null);
    }
  }

  $scope.displayAll = function()
  {
    $scope.deleteMarkers();
    $scope.markers = [];
    $scope.places_to_show = [];

    for (var i = 0; i < $scope.places_in_database.length; i++) 
    {
      var pos = {lat: $scope.places_in_database[i].lat, lng: $scope.places_in_database[i].lng};
      var marker = new google.maps.Marker({
        position: pos,
        map: $scope.map,
        title: $scope.places_in_database[i].name
      });

      $scope.markers.push(marker);
      $scope.places_to_show.push($scope.places_in_database[i]);

    }

    //added by Steve
    console.log("displaying all the markers");

  }

  //added by Steve
  $scope.displayRB = function()
  {
    $scope.deleteMarkers();
    $scope.markers = [];
    $scope.places_to_show = [];

    for (var i = 0; i < $scope.places_in_database.length; i++) 
    {
      if($scope.places_in_database[i].type == "RB")
      {
        var pos = {lat: $scope.places_in_database[i].lat, lng: $scope.places_in_database[i].lng};
        var marker = new google.maps.Marker({
          position: pos,
          map: $scope.map,
          title: $scope.places_in_database[i].name
        });

        $scope.places_to_show.push($scope.places_in_database[i]);
        $scope.markers.push(marker);
      }
    }


    console.log("displaying only RB");
  }

  //added by Steve
  $scope.displayVets = function()
  {

    $scope.deleteMarkers();
    $scope.markers = [];
    $scope.places_to_show = [];

    for (var i = 0; i < $scope.places_in_database.length; i++) 
    {
      if($scope.places_in_database[i].type == "Vet")
      {
        var pos = {lat: $scope.places_in_database[i].lat, lng: $scope.places_in_database[i].lng};
        var marker = new google.maps.Marker({
          position: pos,
          map: $scope.map,
          title: $scope.places_in_database[i].name
        });

        $scope.places_to_show.push($scope.places_in_database[i]);
        $scope.markers.push(marker);
      }
    }
    console.log("displaying only vets");
  }

  $scope.displayParks = function()
  {

    $scope.deleteMarkers();
    $scope.markers = [];
    $scope.places_to_show = [];

    for (var i = 0; i < $scope.places_in_database.length; i++) 
    {
      if($scope.places_in_database[i].type == "Park")
      {
        var pos = {lat: $scope.places_in_database[i].lat, lng: $scope.places_in_database[i].lng};
        var marker = new google.maps.Marker({
          position: pos,
          map: $scope.map,
          title: $scope.places_in_database[i].name
        });

        $scope.places_to_show.push($scope.places_in_database[i]);
        $scope.markers.push(marker);
      }
    }
    console.log("displaying only parks");
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