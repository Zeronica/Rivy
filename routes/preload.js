var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Rivy = mongoose.model('Rivy');
var Comment = mongoose.model('Comment');
var Location = mongoose.model('Location');

var preload = {
	
	loadRivy: function(req, res, next, id) {
		var query = Rivy.findById(id);

		query.exec(function (err, rivy){
			if (err) { return next(err); }
			if (!rivy) { return next(new Error('can\'t find rivy')); }

			req.rivy = rivy;
			return next();
		});
	},

	loadLocation: function(req, res, next, id) {
	  var query = Location.findById(id);

	  query.exec(function (err, location) {
		if (err) { return next(err); }
		if (!location) { return next(new Error('can\'t find location')); }

		req.location = location;
		return next();
	  });
	}, 

	loadComment: function(req, res, next, id) {
	  console.log(id);
	  var query = Comment.findById(id);

	  query.exec(function (err, comment){
		if (err) { return next(err); }
		if (!comment) { return next(new Error('can\'t find comment')); }

		req.comment = comment;
		return next();
	  });
	}
}

module.exports = preload;