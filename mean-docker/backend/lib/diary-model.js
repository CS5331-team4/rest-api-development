var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var diaryDataSchema = new Schema({
	_id: Number,
	author: String,
	title: String,
	public: Boolean,
	text: String,
	publish_date: {type: Date, default: Date.now}
}, {collection: 'diary'});

var DiaryData = mongoose.model('DiaryData', diaryDataSchema);

module.exports = DiaryData;