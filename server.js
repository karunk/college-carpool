//CALL THE PACKAGES --------------------------
var express 		= require('express');
var path    		= require('path');
var mongoose 		= require('mongoose');
var morgan 			= require('morgan');
var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');

var app     = express();
var port    = process.env.PORT || 8080;
var configDB = require('./config/database.js');





mongoose.connect(configDB.url);


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

app.use(express.static(__dirname + '/public'));



//API ROUTES------------------------
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes); 


//MAIN CATCHALL ROUTE ------------------
app.get('*', function(req, res){
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


//SERVER START
app.listen(port);
console.log('Magic happens at port ' + port);