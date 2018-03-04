var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var users = require('./routes/user-controller');
var authenticateController = require('./routes/authenticate-controller');
var diary = require('./routes/diary-controller');

//database connection
var mongojs = require('mongojs');
var db = mongojs('mongodb://database:27017/tasklist',['users']);
const port = process.env.PORT || '8080';


//process.env.SECRET_KEY = 'aisikitaisi';
var secureRoutes = express.Router();
//var routes = express.Router();

var app = express();

//view engine
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);*/

//set static folder for all the angular stuff
//app.use(express.static(path.join(__dirname, 'dist')));

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



/*app.use('/', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
	next();
});*/

app.use(function (req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
 res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
 next();
});

app.use('/', secureRoutes);
//app.use('/', routes);

/*app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});*/

var publicRoutes = [
	{path: '/', method: 'GET'},
	{path: '/meta/heartbeat', method: 'GET'},
	{path: '/meta/members', method: 'GET'},
	{path: '/users/register', method: 'POST'},
	{path: '/users/authenticate', method: 'POST'},
	{path: '/diary', method: 'GET'}
]

//Validation middleware
secureRoutes.use(function(req, res, next){

	var found = publicRoutes.filter(obj => obj.path===req.url && obj.method===req.method);

	if(found.length > 0){
		next();
	}
	else{

		var token = req.body.token || req.get('token');

		if(token){
			/*jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
				if(err){
					res.status(500).json({status: false});
				}
				else{
					next();
				}
			})*/
			db.users.findOne({'token': token}, function(err, user){
				if(err){
					res.status(200).json({'status': false, 'error': 'Invalid authentication token.'});
				}
				else{
				//	console.log(user);
					if(user){
						if(typeof user.token !== 'undefined' && user.token === token){
							next();
						}
						else{
							res.status(200).json({'status': false, 'error': 'Invalid authentication token.'});
						}
					}
					else{
						res.status(200).json({'status': false, 'error': 'Invalid authentication token.'});
					}

				}
			});

		}
		else{
			res.status(200).json({'status': false, 'error': 'Invalid authentication token.'});
		}

	}

});

secureRoutes.get('/', users.listEndpoints);
secureRoutes.get('/meta/heartbeat', users.heartbeat);
secureRoutes.get('/meta/members', users.listMembers);
secureRoutes.post('/users/register', users.registerUser);
secureRoutes.post('/users/authenticate', authenticateController.authenticate);
secureRoutes.post('/users/expire', authenticateController.logout);
secureRoutes.post('/users', users.getUserData);
secureRoutes.get('/diary', diary.getAllEntries);
secureRoutes.post('/diary', diary.getUserEntries);
secureRoutes.post('/diary/create', diary.createEntry);
secureRoutes.post('/diary/delete', diary.deleteEntry);
secureRoutes.post('/diary/permission', diary.updateEntryPermission);


app.listen(port, function(){
	console.log('Server started on port: '+ port);
});

/*const server = http.createServer(app);

server.listen(port, () => console.log(`running on localhost:${port}`));
*/
