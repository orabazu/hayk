var express = require('express');
var router = express.Router();
var Track = require('./../models/track.js');

// middleware is on
router.use(function (req, res, next) {
    // console.log(req)
    console.log('middleware is handling things');
    next(); // make sure we go to the next routes
});

// route for paths
router.route('/tracks')

    .post(function (req, res) {
        var track = new Track();      // create a new instance of the Bear model
        track.properties.name = req.body.name;
        track.properties.distance = req.body.distance;
        track.properties.altitude = req.body.altitude;
        track.properties.summary = req.body.summary;
        track.properties.img_src = req.body.img_src;
        track.properties.ownerId = req.body.ownerId;
        track.geometry.coordinates = req.body.coordinates;

        // save the bear and check for errors
        track.save(function (err) {
            if (err)
                res.send(err);
            res.json({ message: 'Track added!' });
        });
    })
    // get all the users (accessed at GET http://localhost:8080/api/track)
    .get(function (req, res) {
        Track.find(function(err, tracks) {
            if (err)
                res.send(err);  

            res.json(tracks);
        });

        // var tracks = {
        //     "type": "FeatureCollection",
        //     "features": [
        //         {
        //             "type": "Feature",
        //             "properties": {
        //                 "name": "Olimpos ",
        //                 "distance": 6.7,
        //                 "summary": "cennetten bir köşenin tasviridir...nerde çokluk orda bokluk olimposun gidişatınında özeti budur...bu şekliyle bile hala yazın en güzel günlerini orada .",
        //                 "altitude": 1251,
        //                 "img_src": "src"
        //             },
        //             "geometry": {
        //                 "type": "Point",
        //                 "coordinates": [
        //                     30.50731658935547,
        //                     36.627100703563116
        //                 ]
        //             }
        //         },
        //         {
        //             "type": "Feature",
        //             "properties": {
        //                 "name": "Demre ",
        //                 "distance": 7.1,
        //                 "summary": "  Myra (Demre) her zaman Likya'nın en önemli şehirlerinden birisi olarak bilinir. En erken sikkeler MÖ 3. yüzyıl tarihlenir. Fakat şehrin en azından MÖ 5. yüzyıl da ",
        //                 "altitude": 25,
        //                 "img_src": "src"
        //             },
        //             "geometry": {
        //                 "type": "Point",
        //                 "coordinates": [
        //                     30.046920776367188,
        //                     36.27258016862269
        //                 ]
        //             }
        //         },
        //         {
        //             "type": "Feature",
        //             "properties": {
        //                 "name": "Manavgat ",
        //                 "distance": 14.3,
        //                 "summary": "Manavgat, 2283 km²'lik yüzölçümüyle Antalya ilinin en büyük 2. ilçesidir. Manavgat Şelalesi, Türkiye'nin en düzenli akan akarsuyu Manavgat Irmağı kadirindedir ",
        //                 "altitude": 350,
        //                 "img_src": "src"
        //             },
        //             "geometry": {
        //                 "type": "Point",
        //                 "coordinates": [
        //                     31.429138183593754,
        //                     36.778492404594154
        //                 ]
        //             }
        //         }]
        // }
        //  res.json(tracks);
    });


// --------------------------------------------------------------
router.route('/tracks/:id')
    // get all the tracks (accessed at GET http://localhost:8080/api/tracks/:id)
    .get(function (req, res) {

        report = req;
        var track = {
            "type": "FeatureCollection",
            "properties": {
                "name": "Olimpos ",
                "distance": 6.7,
                "summary": "cennetten bir köşenin tasviridir...nerde çokluk orda bokluk olimposun gidişatınında özeti budur...bu şekliyle bile hala yazın en güzel günlerini orada .",
                "altitude": ""
            },
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [
                                31.397209167480465,
                                36.76735464310375
                            ],
                            [
                                31.39566421508789,
                                36.78564171960743
                            ],
                            [
                                31.423473358154297,
                                36.80474911423463
                            ],
                            [
                                31.430339813232422,
                                36.78041728578199
                            ]
                        ]
                    }
                }
            ]
        };

        res.json(track);
    });

router.route('/profile')
    //get user profile
    .get(function (req, res) {
        // if(req.isAuthenticated()) {
        if (req.user)
         {
            res.json({
                done: true,
                user: req.user // get the user out of session and pass to template
            });
        } 
        else 
        {
            res.status = 400;
            res.json({
                done: false,
            });
            res.redirect("/login");
        }
    })

module.exports = router;