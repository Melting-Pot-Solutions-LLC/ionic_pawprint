angular.module('starter.services', [])

.factory('Places', function () {
	//code to retreive array of dog-friendly/-related places from database


	//Testing data
	var places = [{
		id: 0,
		type: 'rest',
		name: 'Jake\'s',
		//lat: ,
		//lng: ,
		addr: '2112 Devine St., Columbia, SC 29205'
	}, {
		id: 1,
		type: 'rest',
		name: 'River Rat Brewery',
		//lat: ,
		//lng: ,
		addr: '1231 Shop Rd., Columbia, SC 29201'
	}, {
		id: 2,
		type: 'rest',
		name: 'Craft and Draft',
		//lat: ,
		//lng: ,
		addr: '2706 Devine St., Columbia, SC 29205'
	}, {
		id: 3,
		type: 'rest',
		name: 'Flying Saucer',
		//lat: ,
		//lng: ,
		addr: '931 Senate St., Columbia, SC 29201'
	}, {
		id: 4,
		type: 'rest',
		name: 'Yesterday\'s',
		//lat: ,
		//lng: ,
		addr: '2030 Devine St., Columbia, SC 29205'
	}, {
		id: 5,
		type: 'rest',
		name: 'Pawley\'s Front Porch',
		//lat: ,
		//lng: ,
		addr: '827 Harden St., Columbia, SC 29205'
	}, {
		id: 6,
		type: 'rest',
		name: 'World of Beer',
		//lat: ,
		//lng: ,
		addr: '902 Gervais St., Columbia, SC 29201'
	}, {
		id: 7,
		type: 'rest',
		name: 'Carolina Ale House',
		//lat: ,
		//lng: ,
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
