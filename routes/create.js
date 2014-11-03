/**
 * Created by shinsungho on 14. 10. 23..
 */
var express = require('express'),
    app= express();


var models = require('../models.js');
var User    = null;
var Whales 	= null;
var Pages	= null;

require('date-utils');

var ERROR_CREATE_WHALES_INTERNAL0       = 581;
var ERROR_CREATE_WHALES_INTERNAL1       = 582;
var ERROR_CREATE_WHALES_INVALID_TOKEN   = 583;
var ERROR_CREATE_WHALES_NO_TOKEN        = 584;
var ERROR_CREATE_PAGE_INTERNAL0         = 585;
var ERROR_CREATE_PAGE_INTERNAL1         = 586;
var ERROR_CREATE_PAGE_INVALID_TOKEN     = 587;
var ERROR_CREATE_PAGE_NO_TOKEN          = 588;



exports.initialize = function( db ){
    User 	= models.User(db);
    Whales 	= require('../models/whales.js').Whales(db);
    Pages   = require('../models/pages.js').Pages(db);
}



exports.whales = function( req, res ){
    var token = req.headers.access_token;
    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(ERROR_CREATE_WHALES_INTERNAL0).send(err);
            }else if( !users ){
                res.status(ERROR_CREATE_WHALES_INVALID_TOKEN).send();
            }else if( users && users.length > 0 ){
                var user = users[0];
                // current working model ( before commit model for modify )
                var whalesModel = new Whales( req.body );
                whalesModel.initialize( user.username );
                // script_name;
                // Description
                whalesModel.save( function(err, room){
                    if( err ){
                        res.status(ERROR_CREATE_WHALES_INTERNAL1).send(err);
                    }else {
                        res.send( {msg:"create whales ok :D", whale : whalesModel} );
                    }
                });
            }
        });
    }else{
        res.status(ERROR_CREATE_WHALES_NO_TOKEN).send();
    }
}
exports.page = function( req, res ){
    var token = req.headers.access_token;
    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(ERROR_CREATE_PAGE_INTERNAL0).send(err);
            }else if( !users ){
                res.status(ERROR_CREATE_PAGE_INVALID_TOKEN).send();
            }else if( users && users.length > 0 ){
                var user = users[0];

                // current working model ( before commit model for modify )
                var pageModel = new Pages();
                pageModel.initialize( user.username );

                pageModel.save( function(err, room){
                    if( err ){
                        res.status(ERROR_CREATE_PAGE_INTERNAL1).send(err);
                    }else {
                        res.send( {msg:"create page ok :D", page : pageModel} );
                    }
                });
            }
        });
    }else{
        res.status(ERROR_CREATE_PAGE_NO_TOKEN).send();
    }

}