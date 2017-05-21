var express = require('express');
var multer = require('multer');
var router = express.Router();
var Track = require('./../models/track.js');
var fs = require('fs');
var cloudinary = require('cloudinary');
var darkSky = require('dark-sky');
var _ = require('lodash');


cloudinary.config({
    cloud_name: 'tabiatizi',
    api_key: '296748465215916',
    api_secret: 'ro4Db4JHAGSOi4WWdoXxKNLRkcs'
});


var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './client/dist/uploads')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});
var upload = multer({
    storage: storage
})


var ramStorage = multer.memoryStorage()
var uploadTemp = multer({
    storage: ramStorage
})
var gpxParse = require("gpx-parse");

var ObjectId = require('mongoose').Types.ObjectId;
// middleware is on
router.use(function (req, res, next) {
    next(); // make sure we go to the next routes
});

// route for paths
router.route('/tracks')

    .post(function (req, res) {

        //check user is online 
        if (!req.user) {
            var err = "Unauthorized"
            res.status(401).send({
                OperationResult: false,
                Data: err
            });
        } else {
            var track = new Track(); // create a new instance of the Track model
            track.properties.name = req.body.name;
            track.properties.distance = req.body.distance;
            track.properties.altitude = req.body.altitude;
            track.properties.summary = req.body.summary;
            track.properties.img_src = req.body.img_src;
            track.properties.ownedBy = req.user;
            // track.properties.gpx = fs.readFileSync(req.body.gpx);
            track.properties.gpx = req.body.gpx;
            track.geometry.coordinates = req.body.coordinates;
            track.properties.isCamp = req.body.isCamp;
            track.properties.seasons = req.body.seasons;
            

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
        }

    })
    // get all the users (accessed at GET http://localhost:8080/api/track)
    .get(function (req, res) {
        var query;
        if (req.query.latNE) {
            query = Track.find({
                geometry: {
                    $geoWithin: {
                        $box: [
                            [parseFloat(req.query.lngSW), parseFloat(req.query.latSW)],
                            [parseFloat(req.query.lngNE), parseFloat(req.query.latNE)],

                        ]
                        // $box:  [ [ 0, 0 ], [ 40, 40 ] ] 
                    }
                }
            })
        } else {
            query = Track.find({})
        }

        query.populate('properties.ownedBy')
            .exec(function (err, tracks) {
                if (err) {
                    res.status(400).send({
                        OperationResult: false,
                        Data: err
                    });
                } else {
                    res.status(200).json(tracks);
                }
            });

    });


// --------------------------------------------------------------
router.route('/tracks/:id')
    // get all the tracks (accessed at GET http://localhost:8080/api/tracks/:id)
    .get(function (req, res) {
        var query;
        query = Track.findOne({
            '_id': new ObjectId(req.params.id)
        }, function (err, response) {
            query.populate('properties.ownedBy')
                .exec(function (err, track) {
                    if (err) {
                        res.status(400).send({
                            OperationResult: false,
                            Data: err
                        });
                    } else {
                        res.status(200).json(track);
                    }
                });
        })
    });
// --------------------------------------------------------------
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
            var err = "Kullanıcı verileri alınamadı."
            res.status(401).send({
                OperationResult: false,
                Data: err
            });
        }
    })



router.route('/photos')
    .post(function (req, res) {
        upload.array('file', 1)(req, res, function (err) {
            // console.log(req.file);
            if (err) {
                res.json({
                    OperationResult: false,
                    Error: err
                });
                return;
            }
            var path = req.files[0].path;

            cloudinary.uploader.upload(req.files[0].path,
                function (cloudinaryRes) {
                    fs.unlink(path);
                    res.json({
                        OperationResult: true,
                        Error: null,
                        Data: {
                            path: cloudinaryRes.secure_url,
                        }
                    });
                });
        })
    })

router.route('/gpx')
    .post(function (req, res) {
        //or from string
        upload.array('file', 1)(req, res, function (err) {
            if (err) {
                res.json({
                    OperationResult: false,
                    Error: err.message
                });
                return;
            }

            var path = req.files[0].path;

            cloudinary.uploader.upload(req.files[0].path,
                function (cloudinaryRes) {
                    fs.unlink(path);
                    res.json({
                        OperationResult: true,
                        Error: null,
                        Data: {
                            path: cloudinaryRes.secure_url,
                        }
                    });
                }, {
                    resource_type: "raw"
                });






            // gpxParse.parseGpx(req.file.buffer, function (err, data) {
            //     //do stuff

            // });
        })

    })

router.route('/weather/:lat/:lng')
    .get(function (req, res) {

        var forecast = new darkSky(process.env.DARKSKY_KEY);
        forecast
            .latitude(req.params.lat)
            .longitude(req.params.lng)
            // .time('2016-01-28')
            .units('ca')
            .language('tr')
            .exclude('minutely,hourly')
            .get()
            .then(function (forecastResult) {
                res.json({
                    OperationResult: true,
                    data: forecastResult // get the user out of session and pass to template
                });
            })
            .catch(function (forecastReject) {
                // console.log(forecastReject)
                res.status = 400;
                res.json({
                    OperationResult: false,
                    data: forecastReject
                });
            })

    })


module.exports = router;