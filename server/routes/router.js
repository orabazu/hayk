var express = require('express');
var router = express.Router();
var Track = require('./../models/track.js');

// middleware is on
router.use(function (req, res, next) {
    // console.log(req) 
    next(); // make sure we go to the next routes
});

// route for paths
router.route('/tracks')

    .post(function (req, res) {
        var track = new Track(); // create a new instance of the Track model
        track.properties.name = req.body.name;
        track.properties.distance = req.body.distance;
        track.properties.altitude = req.body.altitude;
        track.properties.summary = req.body.summary;
        track.properties.img_src = req.body.img_src;
        track.properties.ownerId = req.body.ownerId;
        track.geometry.coordinates = req.body.coordinates;

        // save the track and check for errors
        track.save(function (err) {
            if (err) {
                res.status(400).send({
                    OperationResult: false,
                    Data: err
                });
            } else {
                res.json({
                    OperationResult: true,
                });
            }


        });
    })
    // get all the users (accessed at GET http://localhost:8080/api/track)
    .get(function (req, res) {
        Track.find(function (err, tracks) {
            if (err) {
                res.status(400).send({
                    OperationResult: false,
                    Data: err
                });
            } else {
                res.json(tracks);
            }

        });

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
            "features": [{
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
            }]
        };

        res.json(track);
    });

router.route('/profile')
    //get user profile
    .get(function (req, res) {
        // if(req.isAuthenticated()) {
        if (req.user) {
            res.json({
                OperationResult: true,
                user: req.user // get the user out of session and pass to template
            });
        } else {
            res.status = 400;
            res.json({
                OperationResult: false,
            });
            res.redirect("/login");
        }
    })

module.exports = router;