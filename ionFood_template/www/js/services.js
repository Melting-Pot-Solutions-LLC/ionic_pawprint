angular.module('starter.services', [])

.factory('Places', function () {
	//code to retreive array of dog-friendly/-related places from database


	//Testing data
	var places = [{
		id: 0,
		type: 'rest',
		name: 'Jake\'s',
		lat: 33.9986204,
		lng: -81.0150309,
		addr: '2112 Devine St., Columbia, SC 29205'
	}, {
		id: 1,
		type: 'rest',
		name: 'River Rat Brewery',
		lat: 33.9727059,
		lng: -81.0110627,
		addr: '1231 Shop Rd., Columbia, SC 29201'
	}, {
		id: 2,
		type: 'rest',
		name: 'Craft and Draft',
		lat: 33.9980386,
		lng: -81.0051284,
		addr: '2706 Devine St., Columbia, SC 29205'
	}, {
		id: 3,
		type: 'rest',
		name: 'Flying Saucer',
		lat: 33.9991103,
		lng: -81.0368326,
		addr: '931 Senate St., Columbia, SC 29201'
	}, {
		id: 4,
		type: 'rest',
		name: 'Yesterday\'s',
		lat: 33.9986487,
		lng: -81.0162569,
		addr: '2030 Devine St., Columbia, SC 29205'
	}, {
		id: 5,
		type: 'rest',
		name: 'Pawley\'s Front Porch',
		lat: 34.0010274,
		lng: -81.0172357,
		addr: '827 Harden St., Columbia, SC 29205'
	}, {
		id: 6,
		type: 'rest',
		name: 'World of Beer',
		lat: 33.9992363,
		lng: -81.0380142,
		addr: '902 Gervais St., Columbia, SC 29201'
	}, {
		id: 7,
		type: 'rest',
		name: 'Carolina Ale House',
		lat: 33.999876,
		lng: -81.0414186,
		addr: '708 Lady St., Columbia, SC 29201'
	}];

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
