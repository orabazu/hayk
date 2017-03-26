// (function () {
//     'use strict';

//     var serviceId = 'weatherAPI';

//     angular.module('app.common')
//         .factory(serviceId, ['$q', '$http', weatherAPI]);

//     function yandexGeocode($q, $http) {
//         var service = {
//             weather: weather,
//             forecast:forecast,
//             appid: 'fa2d593aa58e90fde328426e64a64e38'
//         };
//         return service;

//         function weather(lat,lng) {
//             var deferred = $q.defer();
//             $http({
//                 dataType: 'json',
//                 data: '',
//                 method: 'GET',
//                 url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon='+ lng+  '&appid=' + service.appid + '&units=metric&lang=tr'
//             }).then(
//             function (response) {
//                 if (response.cod === 200) {
//                     deferred.resolve({

//                     })                  
//                 }
//                 else {
//                     deferred.resolve({
//                         lat:  function () { return null},
//                         lng: function () { return null },
//                         data: 'Geocode yapılamadı',
//                         errorType: 1
//                     });
//                 }

//             },function (reject) {
//                     deferred.reject({
//                         data: 'Hava durumu alınamadı',
//                         errorType: 2
//                     });
//                 });
//             return deferred.promise;
//         }
//     }
// })();