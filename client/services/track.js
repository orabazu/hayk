function trackService($http) {
	var endpoint = 'http:localhost:8080/'

	var service = {
		getTrack: getTrack,
		addTrack: addTrack
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

	function addTrack(track) {
		return $http({
			method: 'POST',
			url: 'api/tracks',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}, 
			data: $.param({
				"name": track.name,
				"distance": track.distance,
				"altitude": track.altitude,
					"summary": track.summary,
					"img_src": "src",
					"coordinates": track.coordinates,
					"ownerId": "57d93e47a8a684a86b000001"
			})
		})
	}


}
angular
	.module('app.trackService', [])
	.factory('trackService', trackService);