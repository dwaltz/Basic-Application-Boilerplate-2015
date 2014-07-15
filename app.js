'use strict';

var express     = require( 'express' );
var passport    = require('passport'); //Using the passport.js library for authentication
var app         = express();
var mongoose = require('mongoose');

var exphbs    = require( 'express3-handlebars' );
var helpers = require('./lib/hbs-helpers');

//Loading configuration options
var config = require('./config')[ false ? 'local' : 'prod' ];

//passport strategies and configuration
var passportStrats = require('./lib/passport-strategies.js');

// getting main controller for routes
var mainController = require( './controllers/main' );

// connecting to our db
mongoose.connect(config.mongodb.url);

// configure express
express.static.mime.define( { 'application/x-font-woff': [ 'woff' ] } );
express.static.mime.define( { 'application/x-font-ttf': [ 'ttf' ] } );
express.static.mime.define( { 'application/vnd.ms-fontobject': [ 'eot' ] } );
express.static.mime.define( { 'font/opentype': [ 'otf' ] } );
express.static.mime.define( { 'image/svg+xml': [ 'svg' ] } );
app.use( express.compress() ); // gzipping
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

// Emulating RESTful app
app.use( express.bodyParser() );
app.use( express.methodOverride() );
app.use( express.cookieParser() );

// use express session middleware
// user authentication and secrets can be stored in a session.
if( false  ){
	//var vcap = JSON.parse(process.env.VCAP_SERVICES);

	//Production session storage.
	//This session storage can also be used locally if you have redis(or session storage db) running locally.
	/*app.use(express.session({
		store: new RedisStore({
			host: vcap.redis[0].credentials.host,
			port: vcap.redis[0].credentials.port,
			db: vcap.redis[0].name,
			pass: vcap.redis[0].credentials.password
		}),
		secret: 'boilerplateSessionSecret',
		key: 'boilerplate'
	}));*/
} else {
	//This is session storage for developement.
	//This can not be used in production code because express uses browser cookie storage by default.
	app.use(express.session({
		store: new express.session.MemoryStore(),//Browser cookie storage
		secret: 'mysecret!',
		key: 'mykey!'
	}));
}

// configuring passport authentication
passportStrats(passport);
app.use(passport.initialize());
app.use(passport.session());

// routing for application
mainController( app, passport );

// start server
app.listen(app.get('port'), function() {
	console.log( 'Application listening to port:', app.get( 'port' ));
});