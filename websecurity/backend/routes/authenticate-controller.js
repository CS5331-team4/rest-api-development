var jwt = require('jsonwebtoken');
var mongojs = require('mongojs');
var db = mongojs('tasklist',['users']);
var uuidv4 = require('uuid/v4');

module.exports.authenticate = function(req, res){

	console.log(req.body.username + ' ' + req.body.password);
	var username = req.body.username || '';
	var password = req.body.password || '';

	if(username === '' || password === ''){
		res.status(200).json({'status': 'false', 'error': 'username or password is either incorrect or empty'});
	}
	else{
		db.users.findOne({'username': username}, function(err, user){
			if(err){
				res.send(err);
			}
			else{
				if(user !== null){
					console.log(user);
					if(password === user.password){
						/*var userdata = {
							'username': username,
							'password': password
						};

						var token = jwt.sign(userdata, process.env.SECRET_KEY, {
							expiresIn: 4000
						});*/

						var token = uuidv4();
						
						db.users.update(
							{'username': username},
							{$set: {'token': token}},
							function(err, result){
								if(err){
									res.status(500).send(err);
								}
								else{
									res.json({
										'status': 'true',
										'token': token
									});
								}
							}
						);
					}
					else{
						res.status(200).json({'status': false, 'error': 'incorrect password. Please try again'});
					}	
				}
				else{
					res.status(200).json({'status': false, 'error': 'username does not exist'});
				}
				
			}
		});
	}
};

module.exports.logout = function(req, res){
	var tokenToBeDeleted = req.body.token || req.get('token') || '';
	console.log(tokenToBeDeleted);
	if(tokenToBeDeleted === ''){
		res.status(500).json({status: false});
	}
	else{
		console.log(tokenToBeDeleted);
		db.users.update({'token': tokenToBeDeleted}, {$set: {'token': ''}});
		res.status(200).json({'status': 'true'});
	}
}