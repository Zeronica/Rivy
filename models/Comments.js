var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: {type: String, required: true},  
  author: String,
  upvotes: {type: Number, default: 0},
  upvoted: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  rivy: { type: mongoose.Schema.Types.ObjectId, ref: 'Rivy'}
});

var CommentLikeSchema = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	comment: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'},
	positive: {type: Boolean}
});

CommentSchema.methods.upvote = function(user, cb) {
	this.upvoted.push(user);
	this.upvotes += 1;
	this.save(cb);
};

mongoose.model('Comment', CommentSchema);
mongoose.model('CommentLike', CommentLikeSchema);