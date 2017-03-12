var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
	name : {
		type: String
	},
	text : {
		type : String,
		required : true
	}
});

module.exports = mongoose.model('comments', commentSchema);

// module.exports.create({text: 'coolMinion'}, function(err, doc) {
// 	if(err) throw err;
//     console.log(doc);
// });