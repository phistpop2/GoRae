/**
 * Created by shinsungho on 14. 10. 28..
 */
var mongoose = require('mongoose'),
    crypto = require('crypto');

var Schema = mongoose.Schema;
var uuid = require('node-uuid');

require('date-utils');

var Minions = new Schema({
    owner : {type:String},
    uuid : {type:String},
    name : {type:String, unique:true},
    cpu : {type:Number},
    ram : {type:Number},
    ip : {type:String}
});



mongoose.model('Minions', Minions);
exports.Minions = function(db){
    return db.model('Minions');
};