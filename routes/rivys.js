var mongoose = require('mongoose');
var Rivy = mongoose.model('Rivy');
var Comment = mongoose.model('Comment');
var Location = mongoose.model('Location');
var CommentLike = mongoose.model('CommentLike');

// given raw location data, attempts to find an exact
// match in the database, if not creates a new entry
// either way returns a location_id
var processLocationData = function(data, next, cb) {
	console.log(data);

	return Location.findOne({address: data.address}, function(err, location) {
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

// check whether the user has already upvoted. 

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
		console.log(req.body);
		if (!req.body.location && !(req.body.address && req.body.lng && req.body.lat)) {
		  return next(new Error("if location_id is not provided, location_address, location_lng, location_lat must be provided"));
		}

		saveRivy = function(location) {
			req.body.location = location;
			console.log(req.body);
			rivy = new Rivy(req.body);

			rivy.save(function(err, rivy){
				if(err){ return next(err); }

				res.json(rivy);
			});
		}

		// get a location_id for this rivy
		if (!req.body.location) {
			data = {address: req.body.address, lng: req.body.lng, lat: req.body.lat};
			processLocationData(data, next, saveRivy); 
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

	upvoteRivyComment: function(req, res, next) {

		var saveNewLikeCB = function(err, commentLike) {
			if (err) { return next(err); }

			console.log("dsafdsafdsafdsavsafda");
			console.log(req.comment);
			console.log(req.user);

			req.comment.upvote(req.user, function(err, comment){
				if (err) { return next(err); }

				res.json(comment);
			});
		};

		var checkForExistingLikeCB = function(err, like) {
			if (err) { return next(err); }

			if (!like) {
				var commentLike = new CommentLike({user: req.user, comment: req.comment});
				commentLike.save(saveNewLikeCB);
			} else {
				res.status(500);
			      res.json({
			        "status": 500,
			        "message": "already liked"
			      });
			      return;			
			}
		};

		CommentLike.findOne({user: req.user, comment: req.comment}, checkForExistingLikeCB);
	},

	upvoteRivy: function(req, res, next) {
		req.rivy.upvote(req.userID, function(err, rivy){
			if (err) { return next(err); }

			res.json(rivy);
		});
	},
}

module.exports = rivys;