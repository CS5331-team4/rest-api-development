var mongojs = require('mongojs');
var db = mongojs('mongodb://database:27017/tasklist',['diary', 'users','counters']);

/*function getNextSequenceValue(sequenceName){

   	db.counters.findAndModify({
		query:{'_id': sequenceName },
		update: {$inc:{'sequence_value':1}},
		new:true
	}, function(err, doc){
		console.log(doc);
	});
	
   return sequenceDocument.sequence_value;
}*/

module.exports.getAllEntries = function(req, res){
	db.diary.find({'public': true}, function(err, entries){
		if(err){
			res.status(200).json({'status': false, 'error': JSON.stringify(err)});
		}
		else{
			for (var i = 0; i < entries.length; i++) {
				entries[i].id = entries[i]._id;
				delete entries[i]._id;
			}
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
		res.status(200).json({'status': false, 'error': 'Invalid authentication token.'});
	}
	else{
		db.users.findOne({'token': token}, function(err, user){
			if(err){
				res.status(200).json({'status': false, 'error': 'Invalid authentication token.'});
			}
			else{
				if(user !== null){
					db.diary.find({'author': user.username}, function(err2, entries){
						if(err2){
							res.status(500).send(err);
						}
						else{
							for (var i = 0; i < entries.length; i++) {
								entries[i].id = entries[i]._id;
								delete entries[i]._id;
							}
							res.status(200).json({
								'status': true,
								'result': entries 
							});
						}
					});
				}
				else{
					res.status(200).json({'status': false, 'error': 'Invalid authentication token.'});
				}
			}
		});
	}
};

module.exports.createEntry = function(req, res){

	var title = req.body.title || '';
	var public = req.body.public || false;
	var text = req.body.text || '';
	var token = req.body.token || '';

	if(title === ''){
		res.status(500).json({'status': false, 'error': 'title not defined'});
	}
	else if(public === ''){
		res.status(500).json({'status': false, 'error': 'Please define whether the entry is private or public'});
	}
	else if(text === ''){
		res.status(500).json({'status': false, 'error': 'Please define some text for the diary entry'});
	}
	else{
		db.users.findOne({'token': token}, function(err, user){
			if(err){
				res.status(200).json({'status': false, 'error': 'Invalid authentication token.'});
			}
			else{
				if(user !== null){

					db.counters.findAndModify({
						query:{'_id': "productid" },
						update: {$inc:{'sequence_value':1}},
						new:true
					}, function(err, doc){
					//	console.log(doc);
						db.diary.insert({
							'_id': doc.sequence_value,
							'author': user.username,
							'title': title,
							'public': public,
							'text': text,
							'publish_date': new Date()
						}, function(err, result){
							if(err){
								res.status(200).json({'status': false, 'error': 'Invalid authentication token.'});
							}
							else{
								res.status(201).json({'status': true, 'result': {'id': result._id}});
							}
						});

					});

				}
				else{
					res.status(200).json({'status': false, 'error': 'Invalid authentication token.'});
				}
			}
		});		
	}
};

module.exports.deleteEntry = function(req, res){

	var id = req.body.id || 0;

	if(id === 0){
		res.status(200).json({'status': false, 'error': 'Id not defined.'});
	}
	else{
		db.diary.remove({
			'_id': id
		}, function(err, result){
			if(err){
				res.status(200).json({'status': false, 'error': 'Invalid authentication token.'});
			}
			else{
			//	console.log(result);
				res.status(200).json({'status': true});
			}
		});
	}
};

module.exports.updateEntryPermission = function(req, res){

	var id = req.body.id || 0;
	var public = req.body.public;

	if(typeof public === 'undefined'){
		res.status(500).json({'status': false, 'error': 'permissions are not defined.'});
	}
	else if(id === 0){
		res.status(500).json({'status': false, 'error': 'id not defined.'});
	}
	else{
		db.diary.update(
			{'_id': id},
			{$set: {'public': public}},
		 	function(err, result){
				if(err){
					res.status(200).json({'status': false, 'error': 'Invalid authentication token.'});
				}
				else{
				//	console.log(result);
					res.status(200).json({'status': true});
				}
			}
		);
	}
};




