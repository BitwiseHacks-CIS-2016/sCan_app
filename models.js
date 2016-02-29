var mongoose = require('mongoose')
var schema = mongoose.Schema
var models = {};
 
 var CanTypeSchema = new schema({
    _id: String,
    color: String
 });
 var DistrictSchema = new schema({
    _id: String,
    lat: Number,
    lng: Number
 });
var CanSchema = new schema({
    _id: String,
    lat: Number,
    lng: Number,
    filled: Number,
    _type: {type: String, ref: 'CanType'},
    _district: {type: String, ref: 'District'}
});
models.CanType = mongoose.model('CanType', CanTypeSchema);
models.District = mongoose.model('District', DistrictSchema);
models.Can = mongoose.model('Can', CanSchema);

module.exports = models;