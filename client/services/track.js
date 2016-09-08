function trackService($http) {
    var endpoint = 'http:localhost:8080/'

	var service = {
		getTrack: getTrack,
	};
	return service;

    function getTrack() {
    	return $http({
    		method: 'GET',
    		url: 'api/tracks',
            headers: {
               'content-type': 'application/json; charset=utf-8'
            }
    	})
    };
 

} 
angular
.module('app.trackService', [])
.factory('trackService', trackService);