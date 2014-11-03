/**
 * Created by shinsungho on 14. 10. 28..
 */
var express = require('express'),
    app= express();

var restify= require('restify');



var REST_ADMIN = "admin";
var REST_AUTH = "1012";
var rest = restify.createJsonClient({
    url: 'http://211.189.20.14:28020'
});
//rest.basicAuth(REST_ADMIN, REST_AUTH);

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
function branWhale( parent, username, res ){

    var whalesModel = new Whales();
    whalesModel.init_branch( parent, username );
    whalesModel.save(  function(err, room) {
        if (err) {
            res.status(ERROR_COMMIT_WHALES_INTERNAL3).send(err);
        } else {
            res.send({msg: "save whales ok :D", whale: whalesModel});
        }
    });
}
function branchPage( parent, username, res ){

    var pageModel = new Pages();
    pageModel.init_branch( parent, username );
    pageModel.save(  function(err, room) {
        if (err) {
            res.status(ERROR_COMMIT_WHALES_INTERNAL3).send(err);
        } else {
            res.send({msg: "save whales ok :D", whale: pageModel});
        }
    });
}

function restSwitch( restFul, url,  params, callback ){
    switch( restFul ){
        case 'get':
            console.log( 'get', url );
            rest.get( '/databaseName/collectionName', callback );
            break;
        case 'post':
            rest.post( url, params, callback );
            break;
        case 'put':
            rest.put( url, params, callback );
            break;
        case 'del':
            rest.del( url, callback );
            break;
    }
}
function seperateRun( whales, callback ) {
    console.log('seperate');


    var i = 0;
    var j = 0;

    var whalesLength = whales.length;
    var whale;

    var pages;
    var pagesLength;
    var page;

    var input = {};
    var total = [];



    function initWhale(){
        j = 0;
        whale = whales[i];

        pages = whale.pages;
        pagesLength = pages.length;

        page = pages[j].cont;

        console.log( 'initwhale');
    }

    function endup(){
        callback( undefined, total );

    }


    function runRest(){
        console.log( 'run rest');

        if( j < pagesLength ){

            page = pages[j++].cont;
            var url = "/some/";

            for( var key in page.params ){
                if( page.params[ key ].input ){
                    page.params[key] = input[page.params[key].cont];

                }else{
                    page.params[key] = page.params[key].cont;
                }

            }
            console.log( 'here0', page.params );

            restSwitch( page.rest, page.url, page.params, function( err, req, res, obj){
                console.log( err, obj );
                var result = eval( "("+page.code+")( err, obj )" );
                total.push( result );
                input = result;
                if( j < pagesLength ){
                    runRest()
                }else if( ++i < whalesLength ) {

                    initWhale();
                    runRest();
                }else{
                    endup();

                }
                /*
                 runCode(page.code, err, data, function( err, data ){
                 if( j < pagesLength ){
                 runRest()
                 }else if( i < whalesLength ){
                 i++;
                 initWhale();
                 runRest();

                 }
                 });*/
            });

        }else if( ++i < whalesLength ){

            initWhale();
            runRest();
        }else{
            endup();
        }
    }
    initWhale();
    runRest();
}

function assembleScript( script, callback ){
    var whales = script.whales;
    var whalesLength = whales.length;

    var json = [];



    whales.forEach( function( whale, index ){
        whale.pages.forEach( function( page, jndex ){
            Pages.findOne( { uuid : page, backup_num :0 }, function( err, page ){
                if( err ){

                }else {
                    whales[index].pages[jndex] = page;
                }
            });

        });
    });
}

// TODO : check structure of whales script
exports.launch = function( req, res ){

    var token = req.headers.access_token;
    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(ERROR_COMMIT_WHALES_INTERNAL0).send(err);
            }else if( !users ){
                res.status(ERROR_COMMIT_WHALES_INVALID_TOKEN).send();
            }else if( users && users.length > 0 ){
                var user = users[0];
                var w = req.params.uuid;

                Whales.findOne( {uuid:req.params.uuid, backup_num : 0 }, function(err, whale){
                    if( err ) {
                        res.status(ERROR_COMMIT_WHALES_INTERNAL1).send(err);
                    } else if ( user.username ) {
                        branWhale( whale, user.username, res );
                    } else {
                        res.status(ERROR_COMMIT_WHALES_NO_MATCH_COMMITER).send();
                    }
                });
                seperateRun( w, callback );
                res.status(ERROR_COMMIT_WHALES_INTERNAL1).send(err);

                // check owner && committer
                /*
                Whales.findOne( {uuid:req.body.uuid, backup_num : 0 }, function(err, whale){
                    if( err ) {
                        res.status(ERROR_COMMIT_WHALES_INTERNAL1).send(err);
                    } else if ( user.username ) {
                        branWhale( whale, user.username, res );
                    } else {
                        res.status(ERROR_COMMIT_WHALES_NO_MATCH_COMMITER).send();
                    }
                });*/
            }
        });
    }else{
        res.status(ERROR_COMMIT_WHALES_NO_TOKEN).send();
    }

}

exports.test = function( req, res ){
    var w = [
        {
            pages : [
                {
                    cont:{
                        rest : "get",
                        url : "",
                        params : {
                            arg1 : {
                                input : false,
                                cont : "xyz1"
                            },
                            arg2 : {
                                input : false,
                                cont : "xyz2"
                            }
                        },
                        code : "function( err, data ){ return data }"

                    },
                    cont_parser : "javascript"
                },
                {
                    cont:{
                        rest : "get",
                        url : "",
                        params : {
                            arg1 : {
                                input : false,
                                cont : "xyz3"
                            },
                            arg2 : {
                                input : false,
                                cont : "xyz4"
                            }
                        },
                        code : "function( err, data ){ return data }"

                    },
                    cont_parser : "javascript"
                }

            ]

        },
        {
            pages : [
                {
                    cont:{
                        rest : "get",
                        url : "",
                        params : {
                            arg1 : {
                                input : false,
                                cont : "xyz5"
                            },
                            arg2 : {
                                input : false,
                                cont : "xyz6"
                            }
                        },
                        code : "function( err, data ){ return data }"

                    },
                    cont_parser : "javascript"
                },
                {
                    cont:{
                        rest : "get",
                        url : "",
                        params : {
                            arg1 : {
                                input : false,
                                cont : "xyz7"
                            },
                            arg2 : {
                                input : false,
                                cont : "xyz8"
                            }
                        },
                        code : "function( err, data ){ return data }"

                    },
                    cont_parser : "javascript"
                }

            ]

        }
    ];
    seperateRun( w, function( err, data ){
        res.status(ERROR_COMMIT_WHALES_INTERNAL1).send( data );
    } );

}