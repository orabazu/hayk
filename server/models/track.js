// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Track', new Schema({
    properties: {
        ownedBy:  { type: String, ref: 'User' },        
        name: { type: String, required: true },
        distance: { type: String, required: true },
        altitude: { type: String },
        summary: { type: String },
        img_src: { type: String },
        img: {type:Buffer}, 
    },
    geometry: { 
        'type': {
            type: String,
            required: true,
            enum: ['Point', 'LineString', 'Polygon'],
            default: 'Point'
        },
        coordinates: { type: [Number], index: '2dsphere' }
    },
    'type': {
        type: String,
            required: true,
            default: 'Feature'
    }
}));
