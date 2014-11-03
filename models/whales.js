/**
 * Created by shinsungho on 14. 10. 24..
 */
var mongoose = require('mongoose'),
    crypto = require('crypto');

var Schema = mongoose.Schema;
var uuid = require('node-uuid');

require('date-utils');


// TODO : committer list
var Whales = new Schema({
    init_uuid : {type:String},
    derive_uuid : {type:String},
    parent_uuid : {type:String},
    uuid : {type:String},
    owner : {type:String},
    deriver : {type:String},
    commit_id : {type:Number},
    commit_date: {type:String},
    commit_msg : {type:String},
    committer : {type:String},
    committer_list : [String],
    backup_num :{type:String},
    backup_date : {type:String},
    script_name: {type:String},
    description : {type:String},
    dockerfile : [String],
    pushed : {type:Boolean},
    whales : [
        {
            minion:String,
            constrain:String,
            pages:[String]
        }
    ]
});

Whales.methods.initialize = function( username ){
    var uid = uuid.v4();
    this.uuid = uid;
    this.init_uuid = uid;
    this.derive_uuid = uid;
    this.parent_uuid = uid;
    this.owner = username;
    this.deriver = username;
    this.committer = username;
    this.committer_list = [username];
    this.commit_id = 0;
    this.backup_num = 0;
    this.pushed = false;

    var date = new Date();
    this.commit_date = date.toFormat('YYYY-MM-DD-HH24:MI:SS');
    this.backup_date = this.commit_date;
}


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
    this.deriver = parent.deriver;
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
    this.deriver = parent.deriver;
    this.committer = parent.committer;
    this.commit_id = parent.commit_id;
    this.backup_num = 0;
    this.pushed = false;

    var date = new Date();
    this.commit_date = date.toFormat('YYYY-MM-DD-HH24:MI:SS');
    this.backup_date = this.commit_date;
}
Whales.methods.init_branch = function( parent, username ){
    var uid = uuid.v4();
    this.uuid = uid;
    this.init_uuid = parent.init_uuid;
    this.derive_uuid = parent.uuid;
    this.parent_uuid = parent.uuid;
    this.owner = parent.owner;
    this.deriver = username;
    this.committer = username;
    this.committer_list = [username];
    this.commit_id = 0;
    this.backup_num = 0;
    this.pushed = false;

    var date = new Date();
    this.commit_date = date.toFormat('YYYY-MM-DD-HH24:MI:SS');
    this.backup_date = this.commit_date;
}
Whales.methods.commitable = function( username ){
    return ( this.committer_list.indexOf( username ) > -1 );
}


mongoose.model('Whales', Whales);
exports.Whales = function(db){
    return db.model('Whales');
};
