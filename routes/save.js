/**
 * Created by shinsungho on 14. 10. 23..
 */

var express = require('express'),
    app= express();
var fs = require('fs');
var formidable = require('formidable');

var models = require('../models.js');
var User    = null;
var Whales 	= null;
var Pages	= null;

require('date-utils');

var ERROR_SAVE_WHALES_INTERNAL0         = 591;
var ERROR_SAVE_WHALES_INTERNAL1         = 592;
var ERROR_SAVE_WHALES_INTERNAL2         = 593;
var ERROR_SAVE_WHALES_INTERNAL3         = 594;
var ERROR_SAVE_WHALES_INVALID_TOKEN     = 595;
var ERROR_SAVE_WHALES_NO_TOKEN          = 596;
var ERROR_SAVE_NO_MATCH_COMMITTER       = 597;
var ERROR_CREATE_PAGE_INTERNAL0         = 596;
var ERROR_CREATE_PAGE_INTERNAL1         = 597;
var ERROR_CREATE_PAGE_INVALID_TOKEN     = 598;
var ERROR_CREATE_PAGE_NO_TOKEN          = 599;




exports.initialize = function( db ){
    User 	= models.User(db);
    Whales 	= require('../models/whales.js').Whales(db);
    Pages   = require('../models/pages.js').Pages(db);
}


function saveWhale( whale, res ){
    var whalesModel = new Whales( whale );
    whalesModel.set('backup_num', 0);
    whalesModel.save(  function(err, room) {
        if (err) {
            res.status(ERROR_SAVE_WHALES_INTERNAL3).send(err);
        } else {
            res.send({msg: "save whales ok :D", whale: whalesModel});
        }
    });
}
function savePage( page, parent, res ){
    var pageModel = new Pages( page );
    pageModel.init_backup(parent);
    pageModel.set('backup_num', 0);
    pageModel.save( function(err, room){
        if( err ){
            res.status(ERROR_SAVE_WHALES_INTERNAL3).send(err);
        }else{
            res.send({msg:"save pages ok :D", page: pageModel});
        }

    });
}
exports.file = function( req, res ){
    console.log('file uplaod');

    var token = req.headers.access_token;
    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(ERROR_SAVE_WHALES_INTERNAL0).send(err);
            }else if( !users ){
                res.status(ERROR_SAVE_WHALES_INVALID_TOKEN).send();
            }else if( users && users.length > 0 ){
                var user = users[0];
                var uuid = req.headers.uuid;
                var path = './dockerfiles/'+uuid+'/';
                console.log("path", path );


                fs.mkdir( path , function(err){
                    if( err && err.code !='EEXIST' )
                        res.status(601).send( err );
                    else{
                        var form = new formidable.IncomingForm();
                        //Formidable uploads to operating systems tmp dir by default
                        form.uploadDir = path;       //set upload directory
                        form.keepExtensions = true;     //keep file extension

                        form.parse(req, function(err, fields, files) {
                            res.writeHead(200, {'content-type': 'text/plain'});
                            res.write('received upload:\n\n');
                            console.log("form.bytesReceived");
                            //TESTING
                            console.log("file size: "+JSON.stringify( req.headers ));
                            console.log("file path: "+JSON.stringify(files.uploadedFile.path));
                            console.log("file name: "+JSON.stringify(files.uploadedFile.name));
                            console.log("file type: "+JSON.stringify(files.uploadedFile.type));
                            console.log("astModifiedDate: "+JSON.stringify(files.uploadedFile.lastModifiedDate));

                            //Formidable changes the name of the uploaded file
                            //Rename the file to its original name
                            fs.rename(files.uploadedFile.path, path+files.uploadedFile.name, function(err) {
                                if (err)
                                    throw err;
                                console.log('renamed complete');
                            });
                            res.end();
                        });

                    }

                })

            }
        });
    }else{
        res.status(ERROR_SAVE_WHALES_NO_TOKEN).send();
    }



};
// TODO : check structure of whales script
exports.whale = function( req, res ){
    if( req.method === 'PUT' && req.body ){
        var token = req.headers.access_token;
        if( token ){
            User.find({token:token}, function(err, users){
                if( err ){
                    res.status(ERROR_SAVE_WHALES_INTERNAL0).send(err);
                }else if( !users ){
                    res.status(ERROR_SAVE_WHALES_INVALID_TOKEN).send();
                }else if( users && users.length > 0 ){
                    var user = users[0];
                    var inputWhale = req.body.whale;

                    // check owner && committer
                    Whales.findOne( {uuid:inputWhale.uuid, backup_num : 0 }, function(err, whale){
                        if( err ) {
                            res.status(ERROR_SAVE_WHALES_INTERNAL1).send(err);
                        } else if ( whale.commitable(user.username) ) {
                            // backup
                            if( !req.body.replace ) {
                                whale.backup( function( err, doc ){
                                    if( err ){
                                        res.status(ERROR_SAVE_WHALES_INTERNAL2).send(err);
                                    }else{
                                        saveWhale( inputWhale, res );
                                    }
                                });
                            }else{
                                saveWhale( inputWhale, res );
                            }
                        } else {
                            res.status(ERROR_SAVE_NO_MATCH_COMMITTER).send();
                        }
                    });
                }
            });
        }else{
            res.status(ERROR_SAVE_WHALES_NO_TOKEN).send();
        }
    }else{

    }
}
exports.page = function( req, res ){
    if( req.method === 'PUT' && req.body ){
        var token = req.headers.access_token;
        if( token ){
            User.find({token:token}, function(err, users){
                if( err ){
                    res.status(ERROR_SAVE_WHALES_INTERNAL0).send(err);
                }else if( !users ){
                    res.status(ERROR_SAVE_WHALES_INVALID_TOKEN).send();
                }else if( users && users.length > 0 ){
                    var user = users[0];
                    var inputPage = req.body.page;

                    // check owner && committer
                    Pages.findOne( {uuid:inputPage.uuid, backup_num : 0 }, function(err, page){
                        if( err ) {
                            res.status(ERROR_SAVE_WHALES_INTERNAL1).send(err);
                        } else if ( page.commitable( user.username ) ) {
                            inputPage.committer = user.username;
                            inputPage.committer_list = page.committer_list;
                            // backup
                            if( !req.body.replace ) {
                                page.backup( function( err, doc ){
                                    if( err ){
                                        res.status(ERROR_SAVE_WHALES_INTERNAL2).send(err);
                                    }else{
                                        savePage( inputPage, page, res );
                                    }
                                });
                            }else{
                                savePage( inputPage, page, res );
                            }
                        } else {
                            res.status(ERROR_SAVE_NO_MATCH_COMMITTER).send();
                        }
                    });
                }
            });
        }else{
            res.status(ERROR_SAVE_WHALES_NO_TOKEN).send();
        }
    }else{

    }
}