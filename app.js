'use strict';

//Core Modules
var fs              = require( 'fs' );
var http            = require( 'http' );
var https           = require( 'https' );

//Basic Dependencies
var express         = require( 'express' );
var passport        = require('passport'); //Using the passport.js library for authentication
var mongoose        = require('mongoose');

//required express 4 middleware
var session         = require('express-session');
var cookieParser    = require('cookie-parser');
var compression     = require('compression');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var flash           = require('connect-flash');

//mongo session storage
var MongoStore      = require('connect-mongo')(session);

var exphbs          = require( 'express3-handlebars' );
var helpers         = require('./lib/hbs-helpers');

//Loading configuration options
var config         = require( 'config' );

//passport strategies and configuration
var passportStrats  = require('./lib/passport-strategies.js');

// getting main controller for routes
var mainController  = require( './controllers/main' );

// creating express application
var app             = express();

// configure express
express.static.mime.define( { 'application/x-font-woff': [ 'woff' ] } );
express.static.mime.define( { 'application/x-font-ttf': [ 'ttf' ] } );
express.static.mime.define( { 'application/vnd.ms-fontobject': [ 'eot' ] } );
express.static.mime.define( { 'font/opentype': [ 'otf' ] } );
express.static.mime.define( { 'image/svg+xml': [ 'svg' ] } );
app.use( compression() ); // gzipping
app.set( 'port', process.env.PORT || 3000 ); //setting port

// Configuring view engine
app.engine('hbs', exphbs({
	defaultLayout: 'main',
	extname: '.hbs',
	helpers: helpers
	//partialsDir: __dirname +'/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname +'/views');

// serving static content
app.use( express.static( __dirname + '/public' ) );
app.use( '/bower_components', express.static( __dirname + '/bower_components' ) );

// Emulating RESTful app
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use( methodOverride() );
app.use( cookieParser('mysecret!') );

//using mongostore for session storage
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: 'mySecret!',
	store: new MongoStore({
		db : config.mongodb.name
	})
}));

// configuring passport authentication
passportStrats(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routing for application
mainController( app, passport );

// connecting to our db
mongoose.connect(config.mongodb.url);

if ( config.ssl ) {
	https.createServer({
		key: fs.readFileSync( config.ssl.key ),
		cert: fs.readFileSync( config.ssl.cert )
	}, app ).listen( app.get( 'port' ) );

} else {
	// otherwise starting the server up without SSL
	http.createServer( app ).listen( app.get( 'port' ) );
}
console.log( 'Application listening to port:', app.get( 'port' ));