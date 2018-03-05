var jwt = require('jsonwebtoken');
/*var mongojs = require('mongojs');
var db = mongojs('diary',['users']);*/
var uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');

var User = require('../lib/user-model.js');

module.exports.authenticate = function(req, res){

	var username = req.body.username || '';
	var password = req.body.password || '';

	if(username === '' || password === ''){
		res.status(200).json({'status': 'false', 'error': 'username or password is either incorrect or empty'});
	}
	else{
		User.findOne({'username': username}, function(err, user){
			if(err){
				res.status(200).json({'status': false});
			}
			else{
				if(user !== null){
				//	console.log(user);
					if(bcrypt.compareSync(password, user.password)){
						/*var userdata = {
							'username': username,
							'password': password
						};

						var token = jwt.sign(userdata, process.env.SECRET_KEY, {
							expiresIn: 4000
						});*/

						var token = uuidv4();
						
						User.findOneAndUpdate(
							{'username': username},
							{'token': token},
							function(err, result){
								if(err){
									res.status(200).json({'status': false});
								}
								else{
									res.json({
										'status': true,
										'result': {'token': token}
									});
								}
							}
						);
					}
					else{
						res.status(200).json({'status': false});
					}	
				}
				else{
					res.status(200).json({'status': false});
				}
				
			}
		});
	}
};

module.exports.logout = function(req, res){
	var tokenToBeDeleted = req.body.token || req.get('token') || '';
//	console.log(tokenToBeDeleted);
	if(tokenToBeDeleted === ''){
		res.status(200).json({'status': false});
	}
	else{
	//	console.log(tokenToBeDeleted);

		User.findOneAndUpdate(
			{'token': tokenToBeDeleted},
			{'token': ''},
			function(err, result){
				if(err){
					res.status(200).json({'status': false});
				}
				else{
					res.json({'status': true});
				}
			}
		);


	}
}