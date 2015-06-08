var mongoose = require('mongoose');
var Rivy = mongoose.model('Rivy');
var Comment = mongoose.model('Comment');
var Location = mongoose.model('Location');

// given raw location data, attempts to find an exact
// match in the database, if not creates a new entry
// either way returns a location_id
var processLocationData = function(data, cb) {
	return Location.findOne(data, function(err, location) {
		// if location already exists
		if (location) {
			return cb(location);
		}

		// construct a new location
		var newLocation = new Location(data);
		newLocation.save(function(err, location) {
			if (err) {
				return next(err);
			}
			return cb(location);
		});
	});
}

var rivys = {

	getAll: function(req, res, next) {
		Rivy.find({}, function(err, rivys) {
			if (err){return next(err);}
			res.json(rivys);
		})
	},

	getAllAtLocation: function(req, res, next) {
		Rivy.find({location: req.location}, function(err, rivys){
			if (err){return next(err);}
			res.json(rivys);
		});
	},

	getOne: function(req, res) {
	  req.rivy.populate('comments', function(err, rivy) {
		if (err) { return next(err); }

		res.json(rivy);
	  });
	},

	createRivy: function(req, res, next) {
		// check, the body should have location object, 
		// with either the location_id, or a new address and longitude and latitude
		console.log(req);
		console.log(req.body);
		if (!req.body.location && !(req.body.address && req.body.lng && req.body.lat)) {
		  return next(new Error("if location_id is not provided, location_address, location_lng, location_lat must be provided"));
		}

		saveRivy = function(location) {
			req.body.location = location;
			rivy = new Rivy(req.body);

			rivy.save(function(err, rivy){
				if(err){ return next(err); }

				res.json(rivy);
			});
		}

		// get a location_id for this rivy
		if (!req.body.location) {
			data = {address: req.body.address, lng: req.body.lng, lat: req.body.lat};
			processLocationData(data, saveRivy); 
		} else {
			Location.findById(req.body.location, function(err, location) {
				if (!location) {
					return next(new Error("could not find location!"));
				}
				saveRivy(location);
			});
		}
	},

	createRivyComment: function(req, res, next) {
		var comment = new Comment(req.body);
		comment.rivy = req.rivy;

		comment.save(function(err, comment){
			if(err){ return next(err); }

			req.rivy.comments.push(comment);
			req.rivy.save(function(err, rivy) {
			 	if(err){ return next(err); }

			 	res.json(comment);
			});
		});
	},

	upvoteRivy: function(req, res, next) {
		req.rivy.upvote(function(err, rivy){
			if (err) { return next(err); }

			res.json(rivy);
		});
	},

	upvoteRivyComment: function(req, res, next) {
		req.comment.upvote(function(err, comment){
			if (err) { return next(err); }

			res.json(comment);
		});
	}
}

module.exports = rivys;