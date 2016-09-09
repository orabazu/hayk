function markerParser($q) {
	var service = {
		jsonToMarkerArray: jsonToMarkerArray,
        toObject: toObject
    };

    return service;

	// convert feature geojson to array of markers
	function jsonToMarkerArray(val) {
        var defered = $q.defer(); // defered object result of async operation
        var output = [];
        for (var i = 0; i < val.length; i++) {
            var mark = {
                layer: "rotalar",
                lat: val[i].geometry.coordinates[1],
                lng: val[i].geometry.coordinates[0],
                focus: false,
                message: val[i].properties.name,
                icon: {
                    type: 'makiMarker',
                    icon: 'park',
                    color: '#004c00',
                    size: "l"
                },
                icon_swap : {
                    type: 'makiMarker',
                    icon: 'park',
                    color: '#512DA8',
                    size: "l"
                },
                properties: {
                    "name": val[i].properties.name,
                    "altitude" : val[i].properties.altitude,
                    "distance" : val[i].properties.distance,
                    "summary" : val[i].properties.summary
                }
            }
            output.push(mark);
        }
        if(output) {
            defered.resolve(output);
        }
        // else {
        //     defered.reject();
        // }
        return defered.promise;
    }

    function toObject(array) {
        var rv = {};
        for (var i = 0; i < array.length; ++i)
            if (array[i] !== undefined) rv[i] = array[i];
        return rv;        
    }
}

angular
.module('app.markerParser', [])
.factory('markerParser', markerParser);