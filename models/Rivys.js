var mongoose = require('mongoose');

var RivySchema = new mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    upvotes: {type: Number, default: 0},
  	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  	location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true}
});

RivySchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

// var maxRating = 5;
// var minRating = 0;
// RivySchema.pre('save', function(next) {
// 	if (this.rating > maxRating)
// 		this.rating = maxRating;
// 	else if (this.rating < minRating)
// 		this.rating = minRating;
// 	next();
// });

mongoose.model('Rivy', RivySchema);