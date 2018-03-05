/*var mongojs = require('mongojs');
var db = mongojs('diary',['diary', 'users','counters']);*/

var Diary = require('../lib/diary-model.js');
var User = require('../lib/user-model.js');
var Counter = require('../lib/counters-model.js');

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
	Diary.find({'public': true}, function(err, entries){
		if(err){
			res.status(200).json({'status': false, 'error': JSON.stringify(err)});
		}
		else{
			console.log(JSON.stringify(entries));
			var resArray = [];
			for (var i = 0; i < entries.length; i++) {
				var item = {
					id: entries[i]._id,
					author: entries[i].author,
					title: entries[i].title,
					public: entries[i].public,
					text: entries[i].text,
					publish_date: entries[i].publish_date
				};
				resArray.push(item);
			}
			res.status(200).json({
				'status': true,
				'result': resArray 
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
		User.findOne({'token': token}, function(err, user){
			if(err){
				res.status(200).json({'status': false, 'error': 'Invalid authentication token.'});
			}
			else{
				if(user !== null){
					Diary.find({'author': user.username}, function(err2, entries){
						if(err2){
							res.status(500).send(err);
						}
						else{
							var resArray = [];
							for (var i = 0; i < entries.length; i++) {
								var item = {
									id: entries[i]._id,
									author: entries[i].author,
									title: entries[i].title,
									public: entries[i].public,
									text: entries[i].text,
									publish_date: entries[i].publish_date
								};
								resArray.push(item);
							}
							res.status(200).json({
								'status': true,
								'result': resArray 
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

	console.log(title);

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
		User.findOne({'token': token}, function(err, user){
			if(err){
				res.status(200).json({'status': false, 'error': 'Invalid authentication token.'});
			}
			else{
				if(user !== null){

					Counter.findOneAndUpdate(
						{_id: "productid" },
						{$inc:{sequence_value: 1}},
						function(err, doc){
						//	console.log(doc);
						var item = {
							_id: doc.sequence_value,
							author: user.username,
							title: title,
							public: public,
							text: text
						};

						var newentry = new Diary(item);

						newentry.save(function(err, result){
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

	console.log(id);

	if(id === 0){
		res.status(200).json({'status': false, 'error': 'Id not defined.'});
	}
	else{
		Diary.findByIdAndRemove(id, function(err, result){
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
		Diary.findById(id, function(err, result){
				if(err){
					res.status(200).json({'status': false, 'error': 'Invalid authentication token.'});
				}
				else{
					result.public = public;
					result.save(function(err, entry){
						res.status(200).json({'status': true});
					});
				}
			}
		);
	}
};




