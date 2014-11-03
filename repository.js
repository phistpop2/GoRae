/**
 * Created by sungho on 2014-07-22.
 */
var express = require('express'),
    app = module.exports = express(),
    mongoose = require('mongoose'),
    mongoStore = require('connect-mongodb'),
    socket = require('socket.io'),
    db,
    io,
    server,
    Document,
    User,
    Whales,
    Pages,
    Settings = { development: {}, test: {}, production: {} };

var Docker = require('dockerode');
var http = require('http');
var path = require('path');
var jquery = require('jquery');
var restify= require('restify');
var fs = require('fs');
var crypto = require('crypto');
var exec  = require('child_process').exec;
var uuid = require('node-uuid');


// Converts a database connection URI string to
// the format connect-mongodb expects
function mongoStoreConnectionArgs() {

    return { dbname: db.db.databaseName,
        host: db.db.serverConfig.host,
        port: db.db.serverConfig.port,
        username: db.user,
        password: db.pass };
}

var MAIN_PORT = 8090;
var DB_PORT = 27017;
var MAIN_DB = 'mongodb://localhost:'+DB_PORT+'/whales';


app.set('port', MAIN_PORT);
app.set('db-uri', MAIN_DB);

db = (mongoose.connect(app.set('db-uri')));
if( !db.db ) db = db.connections[0];

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
var favicon = require( 'serve-favicon' );
var cookieParser = require('cookie-parser');
var logger = require( 'morgan' );
var methodOverride = require( 'method-override' );
var session = require('express-session');

//app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended:true}));
app.use(cookieParser('optional secret string'));

//app.use(express.cookieDecoder());
app.use(session({
    secret: 'keyboard cat',
    store: mongoStore(mongoStoreConnectionArgs()),
    resave: true,
    saveUninitialized: true
}));
//app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }));
app.use(logger('dev'));
app.use(methodOverride());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/')));



// model
var models = require('./models.js');

app.User 	= User 		= models.User(db);
app.whales 	= Whales 	= require('./models/whales.js').Whales(db);
app.Pages	= Pages 	= require('./models/pages.js').Pages(db);



var create = require('./routes/create');
var upload = require('./routes/upload');
var commit = require('./routes/commit');
var branch = require('./routes/branch');
var checkout = require('./routes/checkout');
var pull = require('./routes/pull');
var push = require('./routes/push');
var save = require('./routes/save');


var sign = require('./routes/sign');
var search = require('./routes/search');

var main = require('./routes/main');
var repo = require('./routes/repo');
var launcher = require('./routes/launcher');

var minion = require('./routes/minion');
var inhibitor = require('./routes/inhibitor');
var sockets = {};


create.initialize(db);
upload.initialize(db);
commit.initialize(db);
branch.initialize(db);
checkout.initialize(db);
save.initialize(db);
sign.initialize(db);
search.initialize(db);
repo.initialize(db);
launcher.initialize(db);
minion.initialize(db);
inhibitor.initialize(db, sockets);

app.post('/users/signup', sign.up );
app.post('/users/signin', sign.in );
app.get('/users/:username', sign.username );


app.post('/create/whale', loadUser, create.whales);
app.post('/create/page', loadUser, create.page);

app.post('/checkout/whale', loadUser, checkout.whales );
app.post('/checkout/page', loadUser, checkout.page);

app.post('/upload/whale', loadUser, upload.whales);
app.post('/upload/page', loadUser, upload.page);

app.post('/branch/whale', loadUser, branch.whale);
app.post('/branch/page', loadUser, branch.page);

app.post('/commit/whale', loadUser, commit.whale);
app.post('/commit/page', loadUser, commit.page);

app.post('/push/whale', loadUser, push.whale);
app.post('/push/page', loadUser, push.page);


app.get('/pages', loadUser, search.pages);
app.get('/whales', loadUser, search.whales);
app.get('/pages/:uuid', loadUser, search.page );
app.get('/whales/:uuid', loadUser, search.whale );
app.get('/pageMine', loadUser, search.pagesMine);
app.get('/pageNotMine', loadUser, search.pagesNotMine);
app.put('/pages/:uuid', loadUser, save.page );
app.put('/whales/:uuid', loadUser, save.whale );

app.get('/search', loadUser, repo.user);



// for minion
app.post('/egg', inhibitor.egg);
app.get('/egg/:index', inhibitor.getEgg );
app.get('/eggCount', inhibitor.getEggCount);
app.post('/minion', inhibitor.minion);
app.get('/minion', loadUser, inhibitor.userMinion);
app.get('/container/:name', loadUser, inhibitor.containerList);
app.get('/dockerfile/:keyword', loadUser, inhibitor.dockerList);
app.get('/dockerfile/', loadUser, inhibitor.dockerList);
app.put('/dockerfile', loadUser, inhibitor.genDocker);
app.post('/mean', loadUser, inhibitor.meanRun );
app.post('/mean2', loadUser, inhibitor.meanRun2 );
app.get('/abcde', loadUser, inhibitor.abcd );
app.get('/destroy', loadUser, inhibitor.destroy);



app.post('/upload', save.file);


app.get('/main*', loadUser, main.main );

app.get('/launcher', launcher.test );

app.get('/test', function( req, res ){
    res.send( {msg:"test!"});
});

function loadUser(req, res, next) {
    if (req.session.username) {
        User.findById(req.session.username, function(user) {
            if (user) {
                req.currentUser = user;
                next();
            } else {
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/');
    }
}
app.get('/', function(req, res) {
    res.render( 'index.ejs',
        {
            title:'Docker',
            tail : '2014 11 01'

        } );
});
// Sessions
app.get('/sessions/new', function(req, res) {
    res.render('sessions/signin.ejs', {
        locals: { user: new User() }
        // TODO : Show detail error - req.query.sign_fail or sign_code
    });
});
// login 시도
app.post('/sessions', function(req, res) {
    User.findOne({username:req.body.user.username}, function(err, user){
        if( err ) {}
        if (user && user.authenticate(req.body.user.password)) {
            req.session.username = user.username;
            req.session.userport = {};
            res.redirect('/main');
        } else {
            // TODO: Show error
            console.log('error!');
            res.redirect('/sessions/new?sign_fail=true');
        }
        console.log('show error0')
    });
});
app.delete('/sessions', loadUser, function(req, res) {
    if (req.session) {
        req.session.destroy(function() {});
    }
    res.redirect('/sessions/new');
});


if (!module.parent) {
    server = http.createServer(app).listen(app.set('port'), handler );
    io = socket.listen( server );
    io.sockets.on('connection', function(socket){
        socket.on( 'reg', function(data){
            sockets[data] = socket;
        });
    });
}

function handler(){
    console.log('Express server listening on port ' + app.set('port'));
}