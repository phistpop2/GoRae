/**
 * Created by shinsungho on 14. 10. 28..
 */
var express = require('express'),
    app= express();

var vagrant = require('vagrant');
//var whales = require('./whales');
var Docker = require('dockerode');
var express = require('express');

var models = require('../models.js');
var User    = null;
var Whales 	= null;
var Pages	= null;

require('date-utils');

exports.initialize = function( db ){
    User 	= models.User(db);
    Whales 	= require('../models/whales.js').Whales(db);
    Pages   = require('../models/pages.js').Pages(db);
}

exports.define = function(req, res){
    var token = req.headers.access_token;
    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(500).send(err);
            }else if( !users ){
                res.status(500).send();
            }else if( users && users.length > 0 ){
                // put data
                // vargrant.up


                res.send( req.body );
            }
        });
    }else{
        res.status(500).send();
    }
}
exports.egg = function( req, res ){
    var token = true;
    if( token ){


    }else{
        res.status(500).send();
    }

};

