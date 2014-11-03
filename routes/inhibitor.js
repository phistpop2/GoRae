/**
 * Created by shinsungho on 14. 10. 28..
 */
var express = require('express'),
    app= express();

var vagrant = require('vagrant');
//var whales = require('./whales');
var Docker = require('dockerode');
var express = require('express');
var whalesHelper = require( '../whales' );


var models = require('../models.js');
var User    = null;
var Whales 	= null;
var Pages	= null;
var Egg = null;
var Minions = null;
var Vagrant = null;
var socketMap = null;
require('date-utils');



function getSocket( id ){

    return socketMap[id];
}


exports.initialize = function( db, map ){
    User 	= models.User(db);
    Vagrant = models.Vagrant(db);
    Whales 	= require('../models/whales.js').Whales(db);
    Pages   = require('../models/pages.js').Pages(db);
    Egg     = require('../models/egg.js').Egg(db);
    Minions = require('../models/minions.js').Minions(db);
    socketMap = map;


    Vagrant.find( {}, function(err, v ){
        if( v && v.length > 0 ){

        }else if( err ){

        }else{
            var vagrant = new Vagrant({ count : 0 });
            vagrant.save( function( err, room ){

            });
        }
    });
    vagrant.debug = true;
}


exports.egg = function(req, res){
    var token = req.headers.access_token;
    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(501).send(err);
            }else if( !users ){
                res.status(502).send();
            }else if( users && users.length > 0 ){
                // put data
                // vargrant.up


                Minions.find({name:req.body.name}, function( err, minions ){
                    if( minions && minions.length > 0 ){
                        res.status(503).send();
                    }else{
                        var egg = new Egg({
                            owner : token,
                            ram : req.body.ram,
                            cpu : req.body.cpu,
                            name : req.body.name
                        });
                        egg.initialize();
                        egg.save( function( err, room ){

                            if( err ){
                                res.status(504).send();
                            }else{
                                res.send( req.body );
                                vagrant.up(function (code) {});
                            }
                        });
                    }
                });
            }
        });
    }else{
        res.status(505).send();
    }
}
exports.getEgg = function( req, res ){
    var index = req.params.index;
    Egg.find({}, null, {sort:{spawn:1} }, function(err, categories) {
        console.log( categories );
        if( categories && categories.length > 0 ) {
            // TODO : socket.emit

            console.log( index, categories[index-1] )
            res.send(categories[index-1]);
        }else
            // TODO : socket.emit
            res.send();
    });
}
exports.getEggCount = function( req, res ){
    Egg.count({}, function( err, count ){
        // TODO : socket.emit vagrant up!
        console.log( 'count!', count);
        res.send( {count:count} );
    });
}

exports.minion = function( req, res ){
    console.log( req.body );
    var minion = req.body;
    delete minion['_id'];
    var token = minion.owner;

    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(506).send(err);
            }else if( !users ){
                res.status(507).send();
            }else if( users && users.length > 0 ){
                // TODO : socket.emit update
                Minions.update(
                    {name:minion.name},
                    minion,
                    { upsert: true },
                    function(err, num){
                        if( err || num < 1 ){
                            var minion = new Minions(minion);
                            minion.save( function( err, room ){
                                res.send();
                            });
                        }else{
                            res.send();
                        }

                    }
                );
            }
        });

    }else{
        res.status(509).send();
    }
}
exports.userMinion = function( req, res ){
    var token = req.headers.access_token;
    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(501).send(err);
            }else if( !users ){
                res.status(502).send();
            }else if( users && users.length > 0 ){
                // put data
                // vargrant.up
                Egg.find( {owner:token}, function( err, eggs ){
                    if( err ){
                        res.status(509).send();
                    }else{
                        res.send( {msg:"user minion", minions : eggs } );
                    }
                });
            }
        });
    }else{
        res.status(505).send();
    }
}
exports.abcd = function( req, res ){
    var token = req.headers.access_token;
    var optsc = {
        'Hostname': '',
        'User': '',
        'AttachStdin': true,
        'AttachStdout': true,
        'AttachStderr': true,
        'Tty': true,
        'OpenStdin': true,
        'StdinOnce': false,
        'Env': [],
        'Cmd': [],
        'Dns': ['8.8.8.8', '8.8.4.4'],
        'Image': 'whales/d3',
        'Volumes': [""],
        'VolumesFrom':'',
        'WorkDir':'/data/test',
        // 'PortBindings':{
        // "2368/tcp":{}
        // },
        'PublishAllPorts':true
    };
    var keyword = req.params.keyword ? req.params.keyword : "";
    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(501).send(err);
            }else if( !users ){
                res.status(502).send();
            }else if( users && users.length > 0 ){
                Minions.findOne( {owner:token}, function( err, minion ){
                    if( minion ){
                        var docker = new Docker( { socketPath: false, host: 'http://'+minion.ip, port: '2375'} );
                        docker.loadImage('./share/d3.tar',optsc, function(err, data){
                            if(err) res.send(err)
                            else {
                                whalesHelper.createContainer(docker, optsc, function(data){
                                    res.send(data)
                                })

                            }
                        });
                    }else{
                        res.status(502).send();

                    }
                });
            }
        });
    }else{
        res.status(505).send();
    }


}

exports.dockerList = function( req, res ){
    var token = req.headers.access_token;

    var keyword = req.params.keyword ? req.params.keyword : "";
    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(501).send(err);
            }else if( !users ){
                res.status(502).send();
            }else if( users && users.length > 0 ){
                Minions.findOne( {owner:token}, function( err, minion ){
                    if( minion ){
                        console.log( 'minion!!!', minion );
                        var docker = new Docker( { socketPath: false, host: 'http://'+minion.ip, port: '2375'} );
                        whalesHelper.searchImage( docker, keyword, function( err, list ){
                            if( err ){
                                console.log( err );
                                res.status(512).send( err );
                            }else{
                                res.send( list );
                            }
                        });
                    }else{
                        res.status(502).send();

                    }
                });
            }
        });
    }else{
        res.status(505).send();
    }

}

exports.containerList = function( req, res ){
    var token = req.headers.access_token;

    var minionName = req.params.name;
    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(501).send(err);
            }else if( !users ){
                res.status(502).send();
            }else if( users && users.length > 0 ){

                Minions.findOne( {owner:token, name:minionName}, function( err, minion ){
                    if( minion ){
                        var docker = new Docker( { socketPath: false, host: 'http://'+minion.ip, port: '2375'} );
                        whalesHelper.getContainerlist( docker, function(err, list){
                            if( err ){
                                res.status(532).send();

                            }else{
                                res.send(list);

                            }

                        });
                    }else{
                        res.status(502).send();
                    }
                });
            }
        });
    }else{
        res.status(505).send();
    }
}

exports.genDocker = function( req, res ){
    var token = req.headers.access_token;
    var dockerfile = req.body.dockerfile;
    var minionName = req.body.name;
    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(501).send(err);
            }else if( !users ){
                res.status(502).send();
            }else if( users && users.length > 0 ){

                Minions.findOne( {owner:token, name:minionName}, function( err, minion ){
                    if( minion ){
                        // get socket
                        var socket = getSocket( token );

                        var docker = new Docker( { socketPath: false, host: 'http://'+minion.ip, port: '2375'} );
                        whalesHelper.pullAndRunWithSocket( docker, dockerfile, socket, function(err,data){
                            if( err ){

                            }else{

                            }

                        });
                    }else{
                        res.status(502).send();
                    }
                });
            }
        });
    }else{
        res.status(505).send();
    }
}
exports.meanRun = function( req, res ){
    var token = req.headers.access_token;

    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(501).send(err);
            }else if( !users ){
                res.status(502).send();
            }else if( users && users.length > 0 ){

                var skip = 0;

                if( req.body.index && req.body.index == 3 ) {
                    skip = 1;
                    delete req.body['index'];
                }

                Egg.find({}, null, {sort:{spawn:1} }, function(err, categories) {
                    console.log( categories );
                    if( categories && categories.length > 0 ) {
                        // TODO : socket.emit
                        var minionName = categories[skip].name;
                        Minions.findOne( {owner:token, name:minionName}, function( err, minion ){
                            if( minion ){

                                var socket = getSocket( token );

                                    var docker = new Docker({
                                        socketPath: false,
                                        host: 'http://' + minion.ip,
                                        port: '2375'
                                    });

                                whalesHelper.MEANRunWithSocket( docker, req.body, socket, function(err,data){
                                    if( err ){
                                        res.status(502).send();

                                    }else{
                                        res.send( data );
                                    }
                                });
                            }else{

                            }
                        });

                    }else{
                        res.status(502).send();

                    }
                    // TODO : socket.emit

                });


            }
        });
    }else{
        res.status(505).send();
    }
}
exports.destroy = function(req, res ){
    vagrant.destroy('-f',function (code) {});
    res.send();
}

exports.meanRun2 = function( req, res ){
    var token = req.headers.access_token;

    if( token ){
        User.find({token:token}, function(err, users){
            if( err ){
                res.status(501).send(err);
            }else if( !users ){
                res.status(502).send();
            }else if( users && users.length > 0 ){

                if( req.body.index ==  6){

                    var socket = getSocket(token);
                    var docker = new Docker({
                        socketPath: false,
                        host: 'http://172.17.8.103',
                        port: '2375'
                    });
                    whalesHelper.MEANRunWithSocket2(docker, req.body, socket, function (err, data) {
                        if (err) {
                            res.status(502).send();

                        } else {
                            res.send(data);
                        }
                    });


                }else {

                    var skip = 0;
                    if (req.body.index && req.body.index > 3) {
                        skip = req.body.index - 3;
                        delete req.body['index'];
                    }

                    Egg.find({}, null, {sort: {spawn: 1}}, function (err, categories) {
                        console.log(categories);
                        if (categories && categories.length > 0) {
                            // TODO : socket.emit
                            var minionName = categories[skip].name;
                            Minions.findOne({owner: token, name: minionName}, function (err, minion) {
                                if (minion) {

                                    var socket = getSocket(token);
                                    var docker = new Docker({
                                        socketPath: false,
                                        host: 'http://' + minion.ip,
                                        port: '2375'
                                    });
                                    whalesHelper.MEANRunWithSocket2(docker, req.body, socket, function (err, data) {
                                        if (err) {
                                            res.status(502).send();

                                        } else {
                                            res.send(data);
                                        }
                                    });
                                } else {

                                }
                            });

                        } else {
                            res.status(502).send();

                        }
                        // TODO : socket.emit

                    });
                }


            }
        });
    }else{
        res.status(505).send();
    }
}