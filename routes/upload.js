/**
 * Created by shinsungho on 14. 10. 23..
 */
var models = require('../models.js');
var User    = null;
var Whales 	= null;
var Pages	= null;

var NO_MATCH_WHALES_UUID        = 0x101;
var NO_MATCH_WHALES_NAME        = 0x102;
var NO_MATCH_WHALES_DESCRIPTION = 0x103;
var NO_MATCH_WHALES_LENGTH      = 0x104;
var NO_MATCH_WHALES_MINION      = 0x105;
var NO_MATCH_WHALES_COMMIT_MSG  = 0x106
var NO_MATCH_WHALES_CONSTRAIN   = 0x107;
var NO_MATCH_PAGE_LENGTH        = 0x108;
var NO_MATCH_PAGE_UUID          = 0x109;
var NO_MATCH_PAGE_NAME          = 0x10a;
var NO_MATCH_PAGE_DESCRIPTION   = 0x10b;
var NO_MATCH_PAGE_CONTENT       = 0x10c;
var NO_MATCH_PAGE_PARSER        = 0x10d;
var NO_MATCH_PAGE_COMMIT_MSG    = 0x10e;

var MATCH_WHALES    = 0x121;
var MATCH_PAGE      = 0x122;


function errorMsg(){
    var json = {};
    var args = [];

    json.code = arguments[0];

    for( var i = 1; i < arguments.length; i++ ) {
        args.push( arguments[i] )
    }

}

function updatePage( page, callbackUpdate, callbackSave){
    if( page.uuid && page.uuid.length > 0 && callbackUpdate){
        Pages.findByIdAndUpdate( page.uuid, page, callbackUpdate );
    }else if( callbackSave ){
        var pageModel = new Pages(page);
        pageModel.save( callbackSave );
    }
}
function compareWhales( src, dst ){

    // check whales script information
    // TODO : pass arguments
    if( src.uuid != dst.uuid )
        return errorMsg( NO_MATCH_WHALES_UUID );
    if( src.whales.length != dst.whales.length )
        return errorMsg( NO_MATCH_WHALES_LENGTH );
    if( src.whales.script_name != dst.whales.script_name )
        return errorMsg( NO_MATCH_WHALES_NAME );
    if( src.whales.description != dst.whales.description )
        return errorMsg( NO_MATCH_WHALES_DESCRIPTION );
    if( src.whales.commit_msg != dst.whales.commit_msg )
        return errorMsg( NO_MATCH_WHALES_COMMIT_MSG );





    var srcWhales = src.whales;
    var dstWhales = dst.whales;
    var length = srcWhales.length;

    // check whales script structure
    // TODO : pass arguments
    for( var  i = 0; i < length; i++ ){
        if( srcWhales[i].minion != dstWhales.minion )
            return errorMsg( NO_MATCH_WHALES_MINION );
        if( srcWhales[i].pages.length != dstWhales[i].pages.length )
            return errorMsg( NO_MATCH_PAGE_LENGTH);
        if( srcWhales[i].pages.constrain != dstWhales[i].pages.constrain )
            return errorMsg( NO_MATCH_WHALES_CONSTRAIN );

        var srcPages = srcWhales[i].pages;
        var dstPages = dstWhales[i].pages;
        var pageLength = srcPages.pages.length;

        var compare = null;
        for( var j = 0; j < pageLength; j++ ){
            if( compare = comparePage( srcPages[j], dstPages[j] ) )
                return compare;
        }
    }
    return true;
}
function comparePage( src, dst ){
    // check page information & contents
    // TODO : pass arguments
    if( src.uuid != dst.uuid )
        return errorMsg(NO_MATCH_PAGE_UUID);
    if( src.page_name != dst.page_name )
        return errorMsg(NO_MATCH_PAGE_NAME);
    if( src.commit_msg != dst.commit_msg )
        return errorMsg(NO_MATCH_PAGE_COMMIT_MSG);
    if( src.description != dst.description )
        return errorMsg(NO_MATCH_PAGE_DESCRIPTION);
    if( src.cont != dst.cont )
        return errorMsg(NO_MATCH_PAGE_CONTENT);
    if( src.cont_parser != dst.cont_parser )
        return errorMsg(NO_MATCH_PAGE_PARSER);

    return MATCH_PAGE;
}



exports.initialize = function( db ){
    User 	= models.User(db);
    Whales 	= require('../models/whales.js').Whales(db);
    Pages   = require('../models/pages.js').Pages(db);
}

exports.whales = function( req, res ){
    if( req.method === 'POST' && req.body ){
        var uploader = req.uploader;
        var whalesScript = req.body;

        var whales = whalesScript.whales;
        var whalesOwner = whalesScript.owner;

        if( whalesOwner && whalesOwner != uploader ){
            // error
            res.status( 550 ).send();
        }else if ( whalesOwner ){
            // update
            whales.forEach( function (ws, i) {
                var pages = ws.pages;
                pages.forEach(function (page, j) {


                    updatePage(page,
                        function (err) {
                            ws.pages[j] = page.uuid;
                            if (err) {
                                console.log('update error', err);
                            } else if (j == pages.length - 1 && i == whales.length - 1) {
                                console.log('end', ws);
                                donePages(ws, i);
                            }
                        },
                        function (err, room) {
                            ws.pages[j] = room.id;
                            if (err) {
                                console.log('saved_err', err);
                            } else if (j == pages.length - 1 && i == whales.length - 1) {
                                console.log('end', ws);
                                donePages(ws, i);
                            }
                        }
                    )
                });
                console.log("ws:", ws.pages);
            });
            res.send();
        }else{

            whalesScript.owner = uploader;

            if( whalesScript.commit_id && whalesScript.commit_id.length > 0 )
                whalesScript.commit_id = parseInt( whalesScript.commit_id ) + 1;

            whales.forEach(function (ws, i) {
                var pages = ws.pages;
                pages.forEach(function (page, j) {
                    updatePage(page,
                        function (err) {
                            ws.pages[j] = page.uuid;
                            if (err) {
                                console.log('update error', err);
                            } else if (j == pages.length - 1 && i == whales.length - 1) {
                                console.log('end', ws);
                                donePages(ws, i);
                            }
                        },
                        function (err, room) {
                            ws.pages[j] = room.id;
                            if (err) {
                                console.log('saved_err', err);
                            } else if (j == pages.length - 1 && i == whales.length - 1) {
                                console.log('end', ws);
                                donePages(ws, i);
                            }

                        }
                    )
                });
                console.log("ws:", ws.pages);
            });
            res.send();
        }
        function donePages( ws, index ){
            console.log(ws, whalesScript.whales);

            if( whalesScript.uuid && whalesScript.uuid.length > 0 ){
                // update
                Whales.findByIdAndUpdate( whalesScript.uuid, whalesScript, function(err){
                    if( err ){
                        console.log(' update error', err);
                    }
                });

            }else{
                // save
                var whalesModel = new Whales(whalesScript);
                whalesModel.save( function(err, room){
                    if( err ){
                        console.log(' saved error', err);
                    }else {
                        console.log('save ', room.id);
                        whales.uuid = room.id;
                    }

                });
            }

        }

    }

};
exports.page = function( req, res ){
    if( req.method === 'POST' && req.body ){
        console.log( req.body );
        var page = req.body;

        function donePage( err, id ){
            if( err )
                res.send(err);
            else {
                var id = page.uuid ? page.uuid : id;
                res.send('page updated '+id);
            }
        }
        updatePage( page,
            function(err){
                donePage( err );
            },
            function(err, room){
                donePage( err, room.id );
            }
        )
    }
};