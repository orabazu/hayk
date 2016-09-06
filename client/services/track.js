function trackService() {
	var service = {
		getTrack: getTrack,
	};
	return service;

    ////////////

    function getTrack() {
    	return $http({
    		method: 'POST',
    		url: 'api/tracks',
    	})
    };


}
angular
.module('core')
.factory('trackService', trackService);