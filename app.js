'use strict';

var http    = require( 'http' );
var express = require( 'express' );
var app     = express();

var exphbs    = require( 'express3-handlebars' );

// getting main controller for routes
var mainController = require( './controllers/main' );

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
	helpers: {}//,
	//partialsDir: __dirname +'/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname +'/views');

// serving static content
app.use( express.static( __dirname + '/public' ) );

// Emulating RESTful app
app.use( express.methodOverride() );
app.use( express.cookieParser() );

// use express session middleware
// using client cookie storage. Do not store sensitive information on the client. See Redis for an alternative to storing session info
app.use( express.session({
	store: new express.session.MemoryStore(),
	secret: 'mysecret!',
	key: 'mykey!'
} ) );

// routing for application
mainController( app );

http.createServer( app ).listen( app.get( 'port' ) );
console.log( 'Application listening to port:', app.get( 'port' ));