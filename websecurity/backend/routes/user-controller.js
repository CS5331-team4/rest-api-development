
var mongojs = require('mongojs');
var db = mongojs('tasklist',['user', 'members', 'users']);

module.exports.heartbeat = function(req, res){
	res.status(200).send({status: true});
};

module.exports.listMembers = function(req, res){
	db.members.find(function(err, members){
		if(err){
			res.send(err);
		}
		res.status(200).json({'status': 'true', 'result': members.map(member => ({name: member.name, metric_number: member.metric_number})) });
	});
};

module.exports.registerUser = function(req, res){
	let username = req.body.username || '';
	let password = req.body.password || '';
	let fullname = req.body.fullname || '';
	let age 	 = req.body.age || '';
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
	else if(age === ''){
		res.status(500).json({'error':'age field cannot be zero or empty'});
	}
	else{
		db.users.find(function(err, users){
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
				res.json({'status': 'false', 'error': 'username already exists'});
			}
			else{
				let newUser = {
					"username": username,
					"password": password,
					"fullname": fullname,
					"age": age
				};

				db.users.save(newUser, function(err, newUser){
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
		res.status(500).json({'status': 'false','error':'token is empty'});
	}
	else{
		db.users.findOne({'token': token}, function(err, user){
			if(err){
				res.status(200).json({'status': 'false','error': 'Invalid authentication token.'});
			}
			else{
				res.json({
					'status': true,
					'result': {
						'username': user.username,
						'fullname': user.fullname,
						'age': parseInt(user.age)
					}
				});
			}
		});
	}
};

