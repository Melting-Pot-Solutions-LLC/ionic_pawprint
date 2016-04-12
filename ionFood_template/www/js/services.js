angular.module('starter.services', [])

.factory('Places', function () {
	//code to retreive array of dog-friendly/-related places from database
	return {
		all: function() {
			return places;
		},
		get: function(placeId) {
      	for (var i = 0; i < places.length; i++) {
        	if (places[i].id === parseInt(placeId)) {
          		return places[i];
        	}
      	}
      	return null;
    	}
	};
});
