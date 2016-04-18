angular.module('starter.controllers', ['firebase'])

.controller('HomeController', function($scope,$state,$rootScope) {
  
})

.controller('RegCtrl', function($scope, $state, $rootScope) {
  
})

.controller('SideMenuController', function($scope, $rootScope, $state) {
  $scope.open_menu = function()
  {
    
  }

  $scope.go_home = function()
  {
    $state.go('tab.home');
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
      $rootScope.user_id  = authData.auth.uid;
      $rootScope.profile_picture = authData.facebook.profileImageURL;
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
        $rootScope.user_name = authData.google.displayName;
        $rootScope.user_id  = authData.auth.uid;
        $rootScope.profile_picture = authData.google.profileImageURL;
        console.log("user's name is ", $rootScope.user_name);
        $state.go('tab.home');
      }
    });
  }
})

.controller('DetailController', function($scope, $ionicNavBarDelegate, $stateParams, $rootScope, $state) {
  // show back button
  $ionicNavBarDelegate.showBackButton(true);

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $scope.initialize();
  });
  //Get specific place object from database here



  $scope.addReview = function()
  {
    console.log("clicked on add a review function");
    console.log($rootScope.place_id);
    $state.go('addReview');
  }


  $scope.initialize = function() {

    console.log("...opening detail vew...");
    myDataRef.on("value", function(snapshot)
    {
      //console.log("here is the DB" + snapshot.val());
      $scope.reviews_to_show = [];
      $rootScope.place = snapshot.val()[$rootScope.place_id];
      $scope.reviews_to_show = $rootScope.place.reviews;
      console.log($scope.reviews_to_show );

      $scope.image_to_show = $rootScope.place.image?$rootScope.place.image:"img/jakes.JPG";
      

      $scope.average_review = 0;
      if($scope.reviews_to_show != null)
      {
        for (var i = 0; i < $scope.reviews_to_show.length; i++) 
        {
          $scope.average_review += parseInt($scope.reviews_to_show[i].rating);
          console.log($scope.reviews_to_show[i].rating);
        }
        $scope.average_review = ($scope.average_review*1.0/$scope.reviews_to_show.length).toFixed(1);
        console.log($scope.average_review);
      }
      else
      {
        $scope.average_review = "N/A";
      }
      console.log("the rating is ", $scope.average_review);



      
    }, function (errorObject) 
    {
      console.log("The read failed: " + errorObject.code);
    });

    console.log("The place is ", $rootScope.place.name);


    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
    // set option for map
    var mapOptions = {
      center: myLatlng,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // init map
    var map = new google.maps.Map(document.getElementById("map3"),
      mapOptions);
    
    var pos = {
      lat: $scope.place.lat,
      lng: $scope.place.lng
    };
    myLatlng = pos;
    map.setCenter(pos);
    
    //add a marker at location
    var marker = new google.maps.Marker({
      position: pos,
      map: map,
    });
    var infowindow = new google.maps.InfoWindow({
      content: $scope.place.name
    });
    infowindow.open(map,marker);
    

    // assign to stop
    $scope.map3 = map;
  }

  //Get list of reviews available for specific location
})

.controller('RBController', function($scope, $rootScope, $state){
  function initialize() {
    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
    // set option for map
    var mapOptions = {
      center: myLatlng,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // init map
    var map = new google.maps.Map(document.getElementById("map5"),
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
    $scope.map5 = map;
  }
  // load map when the ui is loaded
  $scope.init = function() 
  {
    initialize();
    myDataRef.on("value", function(snapshot)
    {
      console.log("here is the DB" + snapshot.val());
      $scope.places_in_database = snapshot.val();
      $scope.places_to_show = [];
      $scope.markers = [];
      $scope.displayRB();
    }, function (errorObject) 
    {
      console.log("The read failed: " + errorObject.code);
    });
  }

  $scope.deleteMarkers = function()
  {
    console.log("deleting markers...");
    for (var i = 0; i < $scope.markers.length; i++)
    {
      $scope.markers[i].setMap(null);
    }
  }
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
          map: $scope.map5,
          title: $scope.places_in_database[i].name,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        $scope.places_to_show.push($scope.places_in_database[i]);
        $scope.markers.push(marker);
      }
    }
    console.log("displaying only RB");
  }
  $scope.click = function (id) {
    //console.log("log");
    //$window.location.reload(true);
    $rootScope.place_id = id;
    $state.go('detail');
  }
})

.controller('VPController', function($scope, $rootScope, $state){
  function initialize() {
    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
    // set option for map
    var mapOptions = {
      center: myLatlng,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // init map
    var map = new google.maps.Map(document.getElementById("map6"),
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
    $scope.map6 = map;
  }
  // load map when the ui is loaded
  $scope.init = function() 
  {
    initialize();
    myDataRef.on("value", function(snapshot)
    {
      console.log("here is the DB" + snapshot.val());
      $scope.places_in_database = snapshot.val();
      $scope.places_to_show = [];
      $scope.markers = [];
      $scope.displayVP();
    }, function (errorObject) 
    {
      console.log("The read failed: " + errorObject.code);
    });
  }

  $scope.deleteMarkers = function()
  {
    console.log("deleting markers...");
    for (var i = 0; i < $scope.markers.length; i++)
    {
      $scope.markers[i].setMap(null);
    }
  }
  $scope.displayVP = function()
  {
    $scope.deleteMarkers();
    $scope.markers = [];
    $scope.places_to_show = [];

    for (var i = 0; i < $scope.places_in_database.length; i++) 
    {
      if($scope.places_in_database[i].type == "Vet" || $scope.places_in_database[i].type == "Park")
      {
        var pos = {lat: $scope.places_in_database[i].lat, lng: $scope.places_in_database[i].lng};
        if($scope.places_in_database[i].type == "Vet"){
          var marker = new google.maps.Marker({
            position: pos,
            map: $scope.map6,
            title: $scope.places_in_database[i].name,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          });
        }
        else{
          var marker = new google.maps.Marker({
            position: pos,
            map: $scope.map6,
            title: $scope.places_in_database[i].name,
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
          });
        }
        $scope.places_to_show.push($scope.places_in_database[i]);
        $scope.markers.push(marker);
      }
    }
    console.log("displaying only V and P");
  }
  $scope.click = function (id) {
    //console.log("log");
    //$window.location.reload(true);
    $rootScope.place_id = id;
    $state.go('detail');
  }
})

.controller('Location', function($state, $scope, $ionicLoading, $compile, $rootScope) {

  //$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    //$scope.init();
  //});

  /**
   * The CenterControl adds a control to the map that recenters the map on
   * the user.
   * This constructor takes the control DIV as an argument.
   * @constructor
   */
  function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginTop = '10px';
    controlUI.style.marginRight = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '12px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Center Map';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to the user.
    controlUI.addEventListener('click', function() {
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
    });
  }

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
    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);

    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);

    // assign to stop
    $scope.map = map;
  }
  // load map when the ui is loaded
  $scope.init = function() 
  {
    initialize();
    myDataRef.on("value", function(snapshot)
    {
      //console.log("here is the DB" + snapshot.val());
      $scope.places_in_database = snapshot.val();
      $scope.places_to_show = [];
      $scope.markers = [];
      $scope.displayAll();
    }, function (errorObject) 
    {
      console.log("The read failed: " + errorObject.code);
    });
  }

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

      if($scope.places_in_database[i].type == "RB"){
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
      }
      else if($scope.places_in_database[i].type == "Vet"){
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
      }
      else if($scope.places_in_database[i].type == "Park"){
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
      }
      else {
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/black-dot.png');
      }

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
          title: $scope.places_in_database[i].name,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
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
          title: $scope.places_in_database[i].name,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
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
          title: $scope.places_in_database[i].name,
          icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        });

        $scope.places_to_show.push($scope.places_in_database[i]);
        $scope.markers.push(marker);
      }
    }
    console.log("displaying only parks");
  }

  $scope.click = function (id) {
    //console.log("log");
    //$window.location.reload(true);
    $rootScope.place_id = id;
    $state.go('detail');
  }
})

.controller('SearchController', function($scope, $state, $rootScope) {
  $scope.init = function()
  {
    console.log("opened search view");

    document.getElementById('searchbar').select();
    myDataRef.on("value", function(snapshot)
    {
      console.log("here is the DB" + snapshot.val());
      $scope.places_in_database = snapshot.val();
      $scope.places_to_show = snapshot.val();
    }, function (errorObject) 
    {
      console.log("The read failed: " + errorObject.code);
    });
  }

  $scope.click = function (id) {
    //console.log("log");
    //$window.location.reload(true);
    $rootScope.place_id = id;
    $state.go('detail');
  }


  $("#searchbar").keyup
  (
    function()
    {
      console.log("keyup");
      console.log("Text in the search bar is '", this.value, "'");
      $scope.places_to_show = [];
      for (var i = 0; i < $scope.places_in_database.length; i++) 
      {
        if($scope.places_in_database[i].name.toLowerCase().indexOf(this.value.toLowerCase()) != -1)
        {
          console.log("found");
          $scope.places_to_show.push($scope.places_in_database[i]);
        }
      }
      $state.go($state.current, {}, {reload: true});
      
    }
  );
})

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

.controller('MeetUpController', function($scope, $state, $rootScope) {

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $scope.initialize();
  });

  
  $scope.click = function(id)
  {
    console.log("meet up id is ", id);
    $rootScope.meetup = $scope.meetUps_to_show[id];
    $state.go('meetUpDetail');
  }

  $scope.initialize = function()
  {
    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
    // set option for map
    var mapOptions = {
      center: myLatlng,
      zoom: 9,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // init map
    var map9 = new google.maps.Map(document.getElementById("map9"),
      mapOptions);

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        myLatlng = pos;
        map9.setCenter(pos);
      }, function() {
        handleLocationError(true, map7.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, map7.getCenter());
    }

    // assign to stop
    $scope.map9 = map9;
    $scope.markers = [];

    myDataRef_meetups.on("value", function(snapshot)
    {
      console.log("here is the DB" + snapshot.val());
      $scope.meetUps_to_show = snapshot.val();
      
      for (var i = 0; i < $scope.meetUps_to_show.length; i++) 
      {
        var pos = {lat: $scope.meetUps_to_show[i].lat, lng: $scope.meetUps_to_show[i].lng};
        var marker = new google.maps.Marker({
          position: pos,
          map: $scope.map9,
          title: $scope.meetUps_to_show[i].name
        });

        $scope.markers.push(marker);
      }
    //added by Steve
    console.log("displaying all meetups");
    }, function (errorObject) 
    {
      console.log("The read failed: " + errorObject.code);
    });
  }

  


})

.controller('MeetUpDetailController', function($state, $scope, $ionicNavBarDelegate, $stateParams, MeetUps, $rootScope) {
  
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.initialize();
      });

  $scope.initialize = function() {

    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
    // set option for map
    var mapOptions = {
      center: myLatlng,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // init map
    var map10 = new google.maps.Map(document.getElementById("map10"),
      mapOptions);
    
    var pos = {
      lat: $rootScope.meetup.lat,
      lng: $scope.meetup.lng
    };
    myLatlng = pos;
    map10.setCenter(pos);
    
    //add a marker at location
    var marker = new google.maps.Marker({
      position: pos,
      map: map10,
    });
    var infowindow = new google.maps.InfoWindow({
      content: $rootScope.meetup.name
    });
    infowindow.open(map10,marker);
    

    // assign to stop
    $scope.map3 = map10;
  }

})













.controller('AddPlaceController', function($scope, $ionicPopup, $state, $rootScope, $ionicPopup ) {
  console.log("opened add a place view");

  var type_of_place = "Vet";

  $scope.choose_type = function(type)
  {
    switch(type)
    {
      case 'social':
        console.log("swtich to social");
        $("#social").addClass("active");
        $("#vet").removeClass("active");
        $("#park").removeClass("active");
        type_of_place = "RB";
        break;

      case 'vet':
        console.log("swtich to vet");
        $("#social").removeClass("active");
        $("#vet").addClass("active");
        $("#park").removeClass("active");
        ype_of_place = "Vet";
        break;

      case 'park':
        console.log("swtich to park");
        $("#social").removeClass("active");
        $("#vet").removeClass("active");
        $("#park").addClass("active");
        ype_of_place = "Park";
        break;

      default:
        console.log("unknown");
        break;
    }
  }




  $scope.initialize = function() {
    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
    // set option for map
    var mapOptions = {
      center: myLatlng,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // init map
    var map = new google.maps.Map(document.getElementById("map2"),
      mapOptions);

    google.maps.event.addListener(map, 'click', function(event) 
    {
      placeMarker(event.latLng, map);
      console.log("opening a marker");
      //var xmlhttp = new XMLHttpRequest();
      console.log();
    });


    var geocoder = new google.maps.Geocoder();


    var delay = (function()
    {
      var timer = 0;
      return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
    })();

    $('#location').keyup(function()
    {
      delay(function()
      {
        geocodeAddress(geocoder, map);


      }, 2000 );
    });


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
    $scope.map2 = map;

    
    myDataRef.once("value", function(snapshot)
    {
      console.log("here is the DB" + snapshot.val());
      $scope.places_in_database = snapshot.val();
      $scope.number_of_places = snapshot.val().length;
    }, function (errorObject) 
    {
      console.log("The read failed: " + errorObject.code);
    });

    
    document.getElementById('addaplace_button').addEventListener('click', function() 
    {
      var place_to_push = 
      {
        addr: $scope.formatted_address,
        id: $scope.number_of_places,
        lat: $scope.lat,
        lng: $scope.lng,
        name: $("#name").val(),
        type: type_of_place
      };


      console.log("pushing new place " , place_to_push);

      $scope.places_in_database.push(place_to_push);
      myDataRef.set($scope.places_in_database);
      $rootScope.place = place_to_push;
      $ionicPopup.alert({
          title: 'Thanks!',
          content: 'You just added one more place for dog owners\n. Let\'s review it! '
        }).then(function(res) {
          $state.go('addReview');
        });


    });
    
  }

  


  function placeMarker(location, map) 
  {
    var marker = new google.maps.Marker({
      position: location,
      map: map,
    });
    var infowindow = new google.maps.InfoWindow({
      content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
    });
    infowindow.open(map,marker);
    console.log("opening a marker");

  }

  function geocodeAddress(geocoder, resultsMap) 
  {
    var address = document.getElementById('location').value;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        resultsMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
        $scope.formatted_address = results[0].formatted_address; 
        //$scope.lat = results[0].geometry.bounds.R.R; 
        //$scope.lng = results[0].geometry.bounds.J.J;
        $scope.lat = results[0].geometry.location.lat(); 
        $scope.lng = results[0].geometry.location.lng();  
        console.log($scope.lat, $scope.lng );

      } else {
        //alert('Geocode was not successful for the following reason: ' + status);
        $ionicPopup.alert({
          title: 'Error',
          content: 'Wrong Location! Please reenter the address of the place'
        }).then(function(res) {
          console.log('User input wrong location');
        });
      }
    });
  }



})

.controller('AddMeetController', function($scope, $state, MeetUps, $rootScope, $ionicPopup){


  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $scope.initialize();
  });

  $scope.add = function() {
    MeetUps.add(self.name,self.location,self.address,self.dateTime);
    $state.go("meetUp");
  }

  function placeMarker(location, map) 
  {
    var marker = new google.maps.Marker({
      position: location,
      map: map,
    });
    var infowindow = new google.maps.InfoWindow({
      content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
    });
    infowindow.open(map,marker);
    console.log("opening a marker");
  }

  function geocodeAddress(geocoder, resultsMap) 
  {
    var address = document.getElementById('location').value;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        resultsMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
        $scope.formatted_address = results[0].formatted_address; 
        //$scope.lat = results[0].geometry.bounds.R.R; 
        //$scope.lng = results[0].geometry.bounds.J.J;
        $scope.lat = results[0].geometry.location.lat(); 
        $scope.lng = results[0].geometry.location.lng();  
        console.log($scope.lat, $scope.lng );
      } else {
        //alert('Geocode was not successful for the following reason: ' + status);
        $ionicPopup.alert({
          title: 'Error',
          content: 'Wrong Location! Please reenter the address of the place'
        }).then(function(res) {
          console.log('User input wrong location');
        });
      }
    });
  }



  $scope.initialize = function() {
    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
    // set option for map
    var mapOptions = {
      center: myLatlng,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // init map
    var map11 = new google.maps.Map(document.getElementById("map11"),
      mapOptions);

    google.maps.event.addListener(map11, 'click', function(event) 
    {
      placeMarker(event.latLng, map);
      console.log("opening a marker");
      //var xmlhttp = new XMLHttpRequest();
      console.log();
    });


    var geocoder = new google.maps.Geocoder();


    var delay = (function()
    {
      var timer = 0;
      return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
    })();

    $('#location').keyup(function()
    {
      delay(function()
      {
        geocodeAddress(geocoder, map11);
      }, 2000 );
    });


    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        myLatlng = pos;
        map11.setCenter(pos);
      }, function() {
        handleLocationError(true, map11.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, map11.getCenter());
    }
    // assign to stop
    $scope.map11 = map11;

    
    myDataRef_meetups.once("value", function(snapshot)
    {
      console.log("here is the DB" + snapshot.val());
      $scope.places_in_database = snapshot.val();
      $scope.number_of_places = snapshot.val().length;
    }, function (errorObject) 
    {
      console.log("The read failed: " + errorObject.code);
    });

    
    
    
  }



  document.getElementById('addameetup_button').addEventListener('click', function() 
    {
      var meetup_to_push = 
      {
        addr: $scope.formatted_address,
        id: $scope.number_of_places,
        lat: $scope.lat,
        lng: $scope.lng,
        name: $("#name").val(),
        time: $("#time").val()
      };


      console.log("pushing new place " , meetup_to_push);

      $scope.places_in_database.push(meetup_to_push);
      myDataRef_meetups.set($scope.places_in_database);
      $rootScope.place = meetup_to_push;
      $ionicPopup.alert({
          title: 'Thanks!',
          content: 'Great! You just added one another meetup.'
        }).then(function(res) {
          $state.go('tab.home');
        });


    });

})




.controller('CheckInController', function($scope){})





.controller('AddReviewCtrl', function($scope, $rootScope, $ionicPopup, $state){

  console.log("...opening add a review controller...");
  console.log("the place is ", $rootScope.place.name);
  console.log("User's name is ", $rootScope.user_name);
  console.log("User's name is ", $rootScope.user_id);

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $scope.initialize();
  });
  //Get specific place object from database here



  $scope.initialize = function()
  {

    console.log("...opening add a review vew...");
    console.log("The place is ", $rootScope.place.name);
    $("#range_ratings").val("2.5");
    $scope.range_value = 2.5;


    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
    // set option for map
    var mapOptions = {
      center: myLatlng,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // init map
    var map = new google.maps.Map(document.getElementById("map8"),
      mapOptions);
    
    var pos = {
      lat: $rootScope.place.lat,
      lng: $rootScope.place.lng
    };
    myLatlng = pos;
    map.setCenter(pos);
    
    //add a marker at location
    var marker = new google.maps.Marker({
      position: pos,
      map: map,
    });
    var infowindow = new google.maps.InfoWindow({
      content: $scope.place.name
    });
    infowindow.open(map,marker);
    

    // assign to stop
    $scope.map8 = map;
  }


  //console.log($scope.range.value);
  $scope.submit_review = function()
  {
    console.log("submitting rating " + $("#range_ratings").val());
    console.log("submitting review text " + $("#text_ratings").val());
    console.log("pushing a review ot the database");
    
    var review = 
    {
      name: $rootScope.user_name,
      uid: $rootScope.user_id,
      text: $("#text_ratings").val(),
      rating: $("#range_ratings").val(),
      profile_picture: $rootScope.profile_picture
    }


    var places_in_database = [];
    //console.log(review);
    myDataRef.on("value", function(snapshot)
    {
      console.log("here is the DB" + snapshot.val());
      places_in_database = snapshot.val();
      
      

    }, function (errorObject) 
    {
      console.log("The read failed: " + errorObject.code);
    });

    if (places_in_database[$rootScope.place.id].reviews == null)
    {
      places_in_database[$rootScope.place.id].reviews = [];
    }
    places_in_database[$rootScope.place.id].reviews.push(review);

    console.log(places_in_database[$rootScope.place.id]);
    myDataRef.set(places_in_database);

    $ionicPopup.alert({
      title: 'Thank you!',
      content: 'Your review is submitted. You will now be redirected back to the map.'
    }).then(function(res) {
      console.log('User input wrong location');
      $state.go('tab.location');

    });


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