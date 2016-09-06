describe('track Service', function() {
	var trackService,  $httpBackend;

	var endpoint = 'http://localhost:8080/api/tracks';
// test mock data
var RESPONSE_SUCCESS  = {
	"type": "FeatureCollection",
	"features": [
	{
		"type": "Feature",
		"properties": {
			"name": "Olimpos ",
			"distance": 6.7,
			"summary": "cennetten bir köşenin tasviridir...nerde çokluk orda bokluk olimposun gidişatınında özeti budur...bu şekliyle bile hala yazın en güzel günlerini orada .",
			"altitude": ""
		},
		"geometry": {
			"type": "Point",
			"coordinates": [
			30.50731658935547,
			36.627100703563116
			]
		}
	},
	{
		"type": "Feature",
		"properties": {
			"name": "Demre ",
			"distance": 6.7,
			"summary": "  Myra (Demre) her zaman Likya'nın en önemli şehirlerinden birisi olarak bilinir. En erken sikkeler MÖ 3. yüzyıl tarihlenir. Fakat şehrin en azından MÖ 5. yüzyıl da ",
			"altitude": ""
		},
		"geometry": {
			"type": "Point",
			"coordinates": [
			30.046920776367188,
			36.27258016862269
			]
		}
	}
	]
};

  // Before each test load our core module
  beforeEach(angular.mock.module('core'));

  // Before each test set our injected trackService factory (_trackService_) to our local trackService variable
  beforeEach(inject(function(_trackService_) {
  	trackService = _trackService_;
  }));

  // A simple test to verify the Users factory exists
  it('should exist', function() {
  	expect(trackService).toBeDefined();
  });

   // A set of tests for our method
   describe('.getTrack()', function() {
		// A simple test to verify the method all exists
		it('should exist', function() {
			expect(trackService.getTrack).toBeDefined();
		});

		it('should return list of all tracks ', function() {
			spyOn(trackService, 'getTrack').and.callFake(function() {
				return {
					success: function(callback) { callback({response: RESPONSE_SUCCESS})}
				};
			});
		});
	});
});