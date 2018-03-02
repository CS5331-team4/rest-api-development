var mongojs = require('mongojs');
var db = mongojs('tasklist',['diary', 'users']);

module.exports.getAllEntries = function(req, res){
	db.diary.find({'public': 'true'}, function(err, entries){
		if(err){
			res.status(500).send(err);
		}
		else{
			res.status(200).json({
				'status': true,
				'result': entries 
			});
		}
	});
};

module.exports.getUserEntries = function(req, res){

	var token = req.body.token || '';

	if(token === ''){
		res.status(500).json({'status': false, 'error': 'token not defined'});
	}
	else{
		db.users.findOne({'token': token}, function(err, user){
			if(err){
				res.status(500).send(err);
			}
			else{
				if(user !== null){
					db.diary.find({'author': user.username}, function(err2, entries){
						if(err2){
							res.status(500).send(err);
						}
						else{
							res.status(200).json({
								'status': true,
								'result': entries 
							});
						}
					});
				}
			}
		});
	}
};

module.exports.createEntry = function(req, res){

	var author = req.body.author || '';
	var title = req.body.title || '';
	var public = req.body.public || false;
	var text = req.body.text || '';

	if(author === ''){
		res.status(500).json({'status': false, 'error': 'author not defined'});
	}
	else if(title === ''){
		res.status(500).json({'status': false, 'error': 'title not defined'});
	}
	else if(public === ''){
		res.status(500).json({'status': false, 'error': 'Please define whether the entry is private or public'});
	}
	else if(text === ''){
		res.status(500).json({'status': false, 'error': 'Please define some text for the diary entry'});
	}
	else{
		db.diary.insert({
			'author': author,
			'title': title,
			'public': public,
			'text': text,
			'publish_date': new Date()
		}, function(err, result){
			if(err){
				res.status(500).send(err);
			}
			else{
				res.status(201).json({'status': true, 'result': {'id': result._id}});
			}
		});
	}
};

module.exports.deleteEntry = function(req, res){

	var id = req.body.id || '';

	if(id === ''){
		res.status(500).json({'status': false, 'error': 'id not defined'});
	}
	else{
		db.diary.remove({
			'_id': mongojs.ObjectId(id)
		}, function(err, result){
			if(err){
				res.status(500).send(err);
			}
			else{
				console.log(result);
				res.status(200).json({'status': true});
			}
		});
	}
};

module.exports.updateEntryPermission = function(req, res){

	var id = req.body.id || '';
	var public = req.body.public;

	if(typeof public === 'undefined'){
		res.status(500).json({'status': false, 'error': 'permissions are not defined'});
	}
	else if(id === ''){
		res.status(500).json({'status': false, 'error': 'id not defined'});
	}
	else{
		db.diary.update(
			{'_id': mongojs.ObjectId(id)},
			{$set: {'public': public}},
		 	function(err, result){
				if(err){
					res.status(500).send(err);
				}
				else{
					console.log(result);
					res.status(200).json({'status': true});
				}
			}
		);
	}
};




