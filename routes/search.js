/**
 * Created by shinsungho on 14. 10. 23..
 */
var express = require('express'),
    app= express();

var models = require('../models.js');
var User    = null;
var Whales 	= null;
var Pages	= null;



var ERROR_SEARCH_PAGE_NO_TOKEN      = 571;
var ERROR_SEARCH_PAGE_NO_UUID       = 572;
var ERROR_SEARCH_PAGE_INVALID_TOKEN = 573;
var ERROR_SEARCH_PAGE_INTERNAL0     = 574;
var ERROR_SEARCH_PAGE_INTERNAL1     = 575;






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
                res.status(ERROR_SEARCH_PAGE_INTERNAL0).send(err);
            }else if( !users ){
                res.status(ERROR_SEARCH_PAGE_INVALID_TOKEN).send();
            }else if( users && users.length > 0 ){


                Whales.find({},function(err, whales) {
                    if (err){
                        res.status(ERROR_SEARCH_PAGE_INTERNAL0).send(err);
                    }else{

                        res.send({msg:"search whales", whales : whales});
                    }
                });
            }
        });
    }else{
        res.status( ERROR_SEARCH_PAGE_NO_TOKEN).send();
    }
}
exports.pages = function( req, res ){
    var token = req.headers.access_token;
    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(ERROR_SEARCH_PAGE_INTERNAL0).send(err);
            }else if( !users ){
                res.status(ERROR_SEARCH_PAGE_INVALID_TOKEN).send();
            }else if( users && users.length > 0 ){
                Pages.find({},function(err, pages) {
                    if (err){
                        res.status(ERROR_SEARCH_PAGE_INTERNAL1).send(err);
                    }else{

                        res.send({msg:"search pages",pages:pages});
                    }
                });
            }
        });
    }else{
        res.status( ERROR_SEARCH_PAGE_NO_TOKEN).send();
    }
}
exports.whale = function( req, res ){

    var token = req.headers.access_token;
    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(ERROR_SEARCH_PAGE_INTERNAL0).send(err);
            }else if( !users ){
                res.status(ERROR_SEARCH_PAGE_INVALID_TOKEN).send();
            }else if( users && users.length > 0 ){
                if( req.params.uuid ) {
                    var query = {
                        uuid : req.params.uuid,
                        backup_num : 0
                    }

                    if( req.query && req.query.all ){
                        // find all
                        delete query['backup_num'];
                        Whales.find( query,function(err, whales) {
                            if (err){
                                res.status(ERROR_SEARCH_PAGE_INTERNAL0).send(err);
                            }else{

                                res.send({msg:"search whales", whales : whales});
                            }
                        });

                    }else{
                        // find one
                        Whales.findOne(query, function (err, whale) {
                            if (err) {
                                res.status(ERROR_SEARCH_PAGE_INTERNAL0).send(err);
                            } else {
                                res.send({msg:"search whale", whale: whale});
                            }
                        });
                    }

                }else{
                    res.status(ERROR_SEARCH_PAGE_NO_UUID).send();
                }
            }
        });
    }else{
        res.status( ERROR_SEARCH_PAGE_NO_TOKEN).send();
    }
}
exports.page = function( req, res ){
    var token = req.headers.access_token;
    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(ERROR_SEARCH_PAGE_INTERNAL0).send(err);
            }else if( !users ){
                res.status(ERROR_SEARCH_PAGE_INVALID_TOKEN).send();
            }else if( users && users.length > 0 ){
                if( req.params.uuid ) {
                    var query = {
                        uuid : req.params.uuid,
                        backup_num : 0
                    }

                    if( req.query && req.query.all ){
                        // find all
                        delete query['backup_num'];
                        Pages.find(query,function(err, pages) {
                            if (err){
                                res.status(ERROR_SEARCH_PAGE_INTERNAL1).send(err);
                            }else{

                                res.send({msg:"search pages",pages:pages});
                            }
                        });

                    }else{
                        // find one
                        Pages.findOne(json, function (err, page) {
                            if (err) {
                                res.status(ERROR_SEARCH_PAGE_INTERNAL1).send(err);
                            } else {
                                res.send({msg:"search page", page: page});
                            }
                        });
                    }

                }else{
                    res.status(ERROR_SEARCH_PAGE_NO_UUID).send();
                }
            }
        });
    }else{
        res.status( ERROR_SEARCH_PAGE_NO_TOKEN).send();
    }
}

exports.pagesMine = function( req, res ){
    var token = req.headers.access_token;
    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(ERROR_SEARCH_PAGE_INTERNAL0).send(err);
            }else if( !users ){
                res.status(ERROR_SEARCH_PAGE_INVALID_TOKEN).send();
            }else if( users && users.length > 0 ){
                var user = users[0];
                Pages.find( { committer_list : user.username },function(err, pages) {
                    if (err){
                        res.status(ERROR_SEARCH_PAGE_INTERNAL1).send(err);
                    }else{

                        res.send({msg:"search pages",pages:pages});
                    }
                });
            }
        });
    }else{
        res.status( ERROR_SEARCH_PAGE_NO_TOKEN).send();
    }
}
exports.pagesNotMine = function(req, res){
    var token = req.headers.access_token;
    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(ERROR_SEARCH_PAGE_INTERNAL0).send(err);
            }else if( !users ){
                res.status(ERROR_SEARCH_PAGE_INVALID_TOKEN).send();
            }else if( users && users.length > 0 ){
                var user = users[0];
                Pages.find( { committer_list : {$not:{ name:user.username}} },function(err, pages) {
                    if (err){
                        res.status(ERROR_SEARCH_PAGE_INTERNAL1).send(err);
                    }else{
                        res.send({msg:"search pages",pages:pages});
                    }
                });
            }
        });
    }else{
        res.status( ERROR_SEARCH_PAGE_NO_TOKEN).send();
    }
}