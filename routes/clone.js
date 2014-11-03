/**
 * Created by shinsungho on 14. 10. 24..
 */

var express = require('express'),
    app= express();


var models = require('../models.js');
var User    = null;
var Whales 	= null;
var Pages	= null;

require('date-utils');

var ERROR_COMMIT_WHALES_INTERNAL0           = 591;
var ERROR_COMMIT_WHALES_INTERNAL1           = 592;
var ERROR_COMMIT_WHALES_INTERNAL2           = 593;
var ERROR_COMMIT_WHALES_INTERNAL3           = 594;
var ERROR_COMMIT_WHALES_INVALID_TOKEN       = 595;
var ERROR_COMMIT_WHALES_NO_TOKEN            = 596;
var ERROR_COMMIT_WHALES_NO_MATCH_COMMITER   = 597;
var ERROR_COMMIT_PAGE_INTERNAL0         = 597;
var ERROR_COMMIT_PAGE_INTERNAL1         = 598;
var ERROR_COMMIT_PAGE_INVALID_TOKEN     = 599;
var ERROR_COMMIT_PAGE_NO_TOKEN          = 599;



exports.initialize = function( db ){
    User 	= models.User(db);
    Whales 	= require('../models/whales.js').Whales(db);
    Pages   = require('../models/pages.js').Pages(db);
}


// TODO : check structure of whales script
function pushWhale( parent, res ){

    var whalesModel = new Whales();
    whalesModel.init_push( parent );
    whalesModel.save(  function(err, room) {
        if (err) {
            res.status(ERROR_COMMIT_WHALES_INTERNAL3).send(err);
        } else {
            res.send({msg: "save whales ok :D", whale: whalesModel});
        }
    });
}

function pushPage( parent, res ){

    var pageModel = new Pages();
    pageModel.init_push( parent );
    pageModel.save(  function(err, room) {
        if (err) {
            res.status(ERROR_COMMIT_WHALES_INTERNAL3).send(err);
        } else {
            res.send({msg: "save whales ok :D", whale: pageModel});
        }
    });
}
// TODO : check structure of whales script
exports.whale = function( req, res ){
    if( req.method === 'POST' && req.body ){
        var token = req.headers.access_token;
        if( token ){
            User.find({token:token}, function(err, users){
                if( err ){
                    res.status(ERROR_COMMIT_WHALES_INTERNAL0).send(err);
                }else if( !users ){
                    res.status(ERROR_COMMIT_WHALES_INVALID_TOKEN).send();
                }else if( users && users.length > 0 ){
                    var user = users[0];

                    // check owner && committer
                    Whales.findOne( {uuid:req.body.uuid, backup_num : 0 }, function(err, whale){
                        if( err ) {
                            res.status(ERROR_COMMIT_WHALES_INTERNAL1).send(err);
                        } else if ( user.username == whale.committer ) {
                            // backup
                            whale.do_push( function( err, doc ){
                                if( err ){
                                    res.status(ERROR_COMMIT_WHALES_INTERNAL2).send(err);
                                }else{
                                    pushWhale( whale, res );
                                }
                            });
                        } else {
                            res.status(ERROR_COMMIT_WHALES_NO_MATCH_COMMITER).send();
                        }
                    });
                }
            });
        }else{
            res.status(ERROR_COMMIT_WHALES_NO_TOKEN).send();
        }
    }else{

    }
}
exports.page = function( req, res ){
    if( req.method === 'POST' && req.body ){
        var token = req.headers.access_token;
        if( token ){
            User.find({token:token}, function(err, users){
                if( err ){
                    res.status(ERROR_COMMIT_WHALES_INTERNAL0).send(err);
                }else if( !users ){
                    res.status(ERROR_COMMIT_WHALES_INVALID_TOKEN).send();
                }else if( users && users.length > 0 ){
                    var user = users[0];

                    // check owner && committer
                    Pages.findOne( {uuid:req.body.uuid, backup_num : 0 }, function(err, page){
                        if( err ) {
                            res.status(ERROR_COMMIT_WHALES_INTERNAL1).send(err);
                        } else if ( user.username == page.committer ) {
                            // backup
                            page.do_push( function( err, doc ){
                                if( err ){
                                    res.status(ERROR_COMMIT_WHALES_INTERNAL2).send(err);
                                }else{
                                    pushPage( page, res );
                                }
                            });
                        } else {
                            res.status(ERROR_COMMIT_WHALES_NO_MATCH_COMMITER).send();
                        }
                    });
                }
            });
        }else{
            res.status(ERROR_COMMIT_WHALES_NO_TOKEN).send();
        }
    }else{

    }
}