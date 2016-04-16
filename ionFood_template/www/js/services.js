angular.module('starter.services', [])

.factory('MeetUps', function () {
	//code to retreive array of meetUps
	var meetUps = [{
		id: 0,
		name: 'Meet at Jake\'s',
		location: 'Jake\'s',
		address: '',
		dateTime: 'April 20, 2016'
	}, {
		id: 1,
		name: 'Meet at Jake\'s',
		location: 'Jake\'s',
		address: '',
		dateTime: 'April 20, 2016'
	}];
	return {
		all: function() {
			return meetUps;
		},
		get: function(meetUpId) {
	      	for (var i = 0; i < meetUps.length; i++) {
	        	if (meetUps[i].id === parseInt(meetUpId)) {
	          		return meetUps[i];
	        	}
	      	}
	      	return null;
    	},
    	add: function(nameN,locationN,addressN,dateTimeN){
    		meetUps.push({
    			id: meetUps.length,
    			name: nameN,
    			location: locationN,
    			address: addressN,
    			dateTime: dateTimeN
    		})
    	}
	};
});
