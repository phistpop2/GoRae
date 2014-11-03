/**
 * Created by shinsungho on 14. 10. 23..
 */

var express = require('express'),
    app= express();

var models = require('../models.js');
var User    = null;
var Whales 	= null;
var Pages	= null;



exports.initialize = function( db ){
    User 	= models.User(db);
    Whales 	= require('../models/whales.js').Whales(db);
    Pages   = require('../models/pages.js').Pages(db);
}


exports.whales = function( req, res ){



}
exports.page = function( req, res ){

}