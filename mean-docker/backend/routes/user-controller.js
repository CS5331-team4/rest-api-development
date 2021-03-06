const bcrypt = require('bcrypt');

/*var mongojs = require('mongojs');
var db = mongojs('diary',['user', 'members', 'users']);*/

var User = require('../lib/user-model.js');


module.exports.listEndpoints = function(req, res){
	let endpoints = [
		'/',
		'/meta/heartbeat',
		'/meta/members',
		'/users/register',
		'/users/authenticate',
		'/users/expire',
		'/users',
		'/diary',
		'/diary',
		'/diary/create',
		'/diary/delete',
		'/diary/permission'
	];

	res.status(200).json({
		'status': true,
		'result': endpoints
	});
}

module.exports.heartbeat = function(req, res){
	res.status(200).send({'status': true});
};

module.exports.listMembers = function(req, res){
	res.status(200).json({'status': true, 'result': ['Vipul Sharma', 'Sonal Devadas Shenoy', 'Prakhar Gahlot', 'Perache Loic Ludvoic']});
/*	db.members.find(function(err, members){
		if(err){
			res.send(err);
		}
		else{
			res.status(200).json({'status': true, 'result': members.map(member => member.name) });
		}
	});*/
};

module.exports.registerUser = function(req, res){
	let username = req.body.username || '';
	let password = req.body.password || '';
	let fullname = req.body.fullname || '';
	let age 	 = req.body.age || 0;
	let flag = 0;

	if(username === ''){
		res.status(500).json({'error':'username cannot be empty'});
	}
	else if(password === ''){
		res.status(500).json({'error':'password cannot be empty'});
	}
	else if(fullname === ''){
		res.status(500).json({'error':'your name cannot be empty'});
	}
	else if(age === 0){
		res.status(500).json({'error':'age field cannot be zero or empty'});
	}
	else{
		User.find(function(err, users){
			if(err){
				res.send(err);
			}
			for(let user of users){
				if(user.username === username){
					flag = 1;
					break;
				}
			}

			if(flag === 1){
				res.status(200);
				res.json({'status': false, 'error': 'User already exists!'});
			}
			else{
				let item = {
					username: username,
					password: bcrypt.hashSync(password, 10),
					fullname: fullname,
					age: age,
					token: ''
				};

				var newUser = new User(item);

				newUser.save(function(err, newUser){
					if(err){
						res.status(500);
						res.json({"error": "unable to register new user"});
					}
					res.status(201).json({"status": true});
				});
			}

		});
	}

};

/*module.exports.displayTasks = function(req, res, next){
	db.user.find(function(err, tasks){
		if(err){
			res.send(err);
		}
		res.send(tasks);
	});
};

module.exports.displayTask = function(req, res){
	db.user.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, user){
		if(err){
			res.send(err);
		}
		else{
			res.json(user);
		}
	});
};*/

module.exports.getUserData = function(req, res){

	var token = req.body.token || '';

	if(token === ''){
		res.status(500).json({'status': false,'error':'Invalid authentication token.'});
	}
	else{
		User.findOne({'token': token}, function(err, user){
			if(err){
				res.status(200).json({'status': false,'error': 'Invalid authentication token.'});
			}
			else{
				res.json({
					'status': true,
					'result': {
						'username': user.username,
						'fullname': user.fullname,
						'age': user.age
					}
				});
			}
		});
	}
};

