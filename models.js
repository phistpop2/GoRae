/**
 * Created by sungho on 2014-07-21.
 */
var mongoose = require('mongoose'),
    crypto = require('crypto');

var Schema = mongoose.Schema;
var uuid = require('node-uuid');

require('date-utils');

var Document = new Schema(
    {
        properties: ['title', 'data', 'tags', 'user_id'],

        indexes: [
            'title',
            'user_id'
        ]

    }
);

var Vagrant = new Schema(
    {
        count : {type:Number}
    }
);


var User = new Schema(
    {
        username : { type : String, unique: true },
        password : { type : String },
        salt : {type:String},
        level : {type : Number },
        token : {type:String},
        workspace : [
            {
                whales : {type:String}
            }
        ]
    }
);
var Whales = new Schema({
    init_uuid : {type:String},
    derive_uuid : {type:String},
    parent_uuid : {type:String},
    uuid : {type:String},
    owner : {type:String},
    commit_id : {type:Number},
    commit_date: {type:String},
    commit_msg : {type:String},
    committer : {type:String},
    backup_num :{type:String},
    backup_date : {type:String},
    script_name: {type:String},
    description : {type:String},
    pushed : {type:Boolean},
    whales : [
        {
            minion:String,
            pages:[String]
        }
    ]
});
var Pages = new Schema({
    init_uuid : {type:String},
    derive_uuid : {type:String},
    parent_uuid : {type:String},
    uuid : {type:String},
    owner : {type:String},
    commit_id : {type:Number},
    commit_date: {type:String},
    commit_msg : {type:String},
    committer : {type:String},
    page_name : {type:String},
    description : {type:String},
    backup_num :{type:String},
    backup_date : {type:String},
    pushed : {type:Boolean},
    cont : {type:String},
    cont_parser : {type:String}
});

User.path('username').get( function(v){
    return v;
});

User.methods.saltPassword = function(v){
    //this._password = v;
    this.salt = this.makeSalt();
    this.password = this.encryptPassword(v);
}


User.methods.authenticate = function(plainText) {
    var ps1 = this.encryptPassword(plainText);
    console.log('ps1', ps1);
    console.log('ps2', this.password);
    return ps1 === this.password;
}
User.methods.makeSalt = function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
}
User.methods.encryptPassword = function(password) {

    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');

}

User.methods.isValid = function() {
        // TODO: Better validation
    return this.username && this.username.length > 0 && this.username.length < 255
        && this.password && this.password.length > 0 && this.password.length < 255;
}
User.methods.triggerSave = function(okFn, failedFn) {
    if (this.isValid()) {
        this.save(okFn);
    } else {
        failedFn();
    }
}

Pages.methods.triggerSave = function(okFn, failedFn) {
    this.save(okFn);
}

User.methods.makeAccessToken =  function(){
    this.token = uuid.v4();
};

Whales.methods.backup = function( callback ){
    var date = new Date();
    var json = {
        backup_num : 1,
        backup_date : date.toFormat('YYYY-MM-DD-HH24:MI:SS')
    }
    this.update( json, callback );
}
Whales.methods.do_commit = function( callback ){
    var date = new Date();
    var json = {
        backup_num : 0,
        commit_id : isNaN( this.commit_id )? 0 : this.commit_id + 1,
        commit_date : date.toFormat('YYYY-MM-DD-HH24:MI:SS')
    }
    this.update( json, callback );
}
Whales.methods.init_commit = function( parent ){
    var uid = uuid.v4();
    this.uuid = uid;
    this.init_uuid = parent.init_uuid;
    this.derive_uuid = parent.derive_uuid;
    this.parent_uuid = parent.uuid;
    this.owner = parent.owner;
    this.committer = parent.committer;
    this.commit_id = parent.commit_id;
    this.backup_num = 0;
    this.pushed = false;

    var date = new Date();
    this.commit_date = date.toFormat('YYYY-MM-DD-HH24:MI:SS');
    this.backup_date = this.commit_date;
}
Whales.methods.do_push = function( callback ){
    var date = new Date();
    var json = {
        backup_num : 0,
        commit_id : isNaN( this.commit_id )? 0 : this.commit_id + 1,
        commit_date : date.toFormat('YYYY-MM-DD-HH24:MI:SS')
    }
    this.update( json, callback );
}
Whales.methods.init_push = function( parent ){
    var uid = uuid.v4();
    this.uuid = uid;
    this.init_uuid = parent.init_uuid;
    this.derive_uuid = parent.derive_uuid;
    this.parent_uuid = parent.uuid;
    this.owner = parent.owner;
    this.committer = parent.committer;
    this.commit_id = parent.commit_id;
    this.backup_num = 0;
    this.pushed = false;

    var date = new Date();
    this.commit_date = date.toFormat('YYYY-MM-DD-HH24:MI:SS');
    this.backup_date = this.commit_date;
}
Whales.methods.initialize = function( username ){
    var uid = uuid.v4();
    this.uuid = uid;
    this.init_uuid = uid;
    this.derive_uuid = uid;
    this.parent_uuid = uid;
    this.owner = username;
    this.committer = username;
    this.commit_id = 0;
    this.backup_num = 0;
    this.pushed = false;

    var date = new Date();
    this.commit_date = date.toFormat('YYYY-MM-DD-HH24:MI:SS');
    this.backup_date = this.commit_date;
}

Pages.methods.backup = function( callback ){
    var date = new Date();
    var json = {
        backup_num : 1,
        backup_date : date.toFormat('YYYY-MM-DD-HH24:MI:SS')
    }
    this.update( json, callback );
}
Pages.methods.do_commit = function( callback ){
    var date = new Date();
    var json = {
        backup_num : 0,
        commit_id : isNaN( this.commit_id )? 0 : this.commit_id + 1,
        commit_date : date.toFormat('YYYY-MM-DD-HH24:MI:SS')
    }
    this.update( json, callback );
}
Pages.methods.init_commit = function( parent ){
    var uid = uuid.v4();
    this.uuid = uid;
    this.init_uuid = parent.init_uuid;
    this.derive_uuid = parent.derive_uuid;
    this.parent_uuid = parent.uuid;
    this.owner = parent.owner;
    this.committer = parent.committer;
    this.commit_id = parent.commit_id;
    this.backup_num = 0;
    this.pushed = false;

    var date = new Date();
    this.commit_date = date.toFormat('YYYY-MM-DD-HH24:MI:SS');
    this.backup_date = this.commit_date;
}
Pages.methods.initialize = function( username ){
    var uid = uuid.v4();
    this.uuid = uid;
    this.init_uuid = uid;
    this.derive_uuid = uid;
    this.parent_uuid = uid;
    this.owner = username;
    this.committer = username;
    this.commit_id = 0;
    this.backup_num = 0;
    this.pushed = false;

    var date = new Date();
    this.commit_date = date.toFormat('YYYY-MM-DD-HH24:MI:SS');
    this.backup_date = this.commit_date;
}


mongoose.model('Document', Document);
mongoose.model('User', User );
mongoose.model('Vagrant', Vagrant);

exports.User = function(db) {
    return db.model('User');
};
exports.Vagrant = function(db){
    return db.model('Vagrant');
}

exports.Document = function(db) {
    return db.model('Document');
};