var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var counterDataSchema = new Schema({
	_id: String,
	sequence_value: Number
}, {collection: 'counters'});

var CounterData = mongoose.model('CounterData', counterDataSchema);

module.exports = CounterData;