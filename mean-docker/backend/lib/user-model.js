var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userDataSchema = new Schema({
	username: String,
	fullname: String,
	password: String,
	age: Number,
	token: String
}, {collection: 'users'});

var UserData = mongoose.model('UserData', userDataSchema);

module.exports = UserData;