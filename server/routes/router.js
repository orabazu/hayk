var express = require('express');
var multer = require('multer');
var router = express.Router();
var Track = require('./../models/track.js');
var fs = require('fs');
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
var ObjectId = require('mongoose').Types.ObjectId; 
// middleware is on
router.use(function (req, res, next) {
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
        track.properties.ownedBy = req.body.ownedBy;
        // track.properties.img = fs.readFileSync(req.body.img_src);
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
        Track.find()
            .populate('properties.ownedBy')
            .exec(function (err, tracks) {
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
debugger;
        Track.findOne({
            '_id': new ObjectId(req.params.id)
        }, function (err, response) {
            if (err) {
                res.status(400).send({
                    OperationResult: false,
                    Data: err
                });
            } else {
                res.json(response);
            }
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
            res.status = 400;
            res.json({
                OperationResult: false,
            });
            res.redirect("/login");
        }
    })



router.route('/photos')
    .post(function (req, res) {
        upload.single('file')(req, res, function (err) {
            // console.log(req.file);
            if (err) {
                res.json({
                    OperationResult: false,
                    Error: err
                });
                return;
            }
            res.json({
                OperationResult: true,
                Error: null,
                Data: req.file,
            });
        })
    })




module.exports = router;