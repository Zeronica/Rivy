var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: {type: String, required: true},  
  author: String,
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  rivy: { type: mongoose.Schema.Types.ObjectId, ref: 'Rivy'}
});

CommentSchema.methods.upvote = function(userID, cb) {
	// this.upvoted.findOne(userID, function(err, uID) {
	// 	if (!uID) {
	// 		this.upvoted.push(userID);
	// 	} else {
	// 		cb(new Error("the user has already upvoted"));
	// 	}
	// })
	this.upvotes += 1;
	this.save(cb);
};

mongoose.model('Comment', CommentSchema);