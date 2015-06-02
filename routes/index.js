var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var jwt = require("jwt-simple");
var User = mongoose.model('User');

//testing purposes obviously
var jwt_secret = "ABC";

function respondWithError(res, err) {
	res.json({
		type: false,
		data: "Error occured: " + err
	});
}

function saveUser(email, password, callback) {
	var userModel = new User();
	userModel.username = email;
	userModel.password = password;
	userModel.save(callback);
}

function genToken(user) {
	var expires = expiresIn(7);
	var token = jwt.encode({
		exp: expires
	}, require('../config/secret')());

	return {
		token: token,
		expires: expires,
		user: user
	};
}

function expiresIn(numDays) {
	var dateObj = new Date();
	return dateObj.setDate(dateObj.getDate() + numDays);
}

// render dummy view
router.get('/', function(req, res, next) {
	res.render('dummy.ejs');
});

router.post('/login', function(req, res){
	User.findOne({username: req.body.username, password: req.body.password}, function(err, user){
		if (err) {
			respondWithError(res, err);
		} else {
			if (user) {
				res.json(genToken(user));
			} else {
				res.status(401);
				res.json({
					status: 401,
					type: false,
					data: "Incorrect username/password"
				});
			}
		}
	});
});

router.post('/signup', function(req, res){
	//	console.log(typeof req.body.username);
	User.findOne({username: req.body.username, password: req.body.password}, function(err, user){
		if (err) {
			res.json({
				type: false,
				data: "Error occured: " + err
			});
		} else {
			if (user) {
				res.status(401);
				res.json({
					status: 401,
					type: false,
					data: "User already exists!"
				});
			} else {
				// register the new user
				saveUser(req.body.username, req.body.password, function(err, user){
					if (err) {
						respondWithError(res, err);
					} else {
						res.json(genToken(user));
					}
				});
			};
		}
	});
});

// testing purposes only
router.post('/deregister', function(req, res){
	User.findOne({username: req.body.username, password: req.body.password}, function(err, user) {
		if (err) {
			res.json({
				type: false,
				data: "Error occured " + err
			});
		} else {
			if (user) {
				User.remove({_id: user._id}, function(err){
					if (err) {
						res.json({
							type: false,
							data: "Error occured " + err
						});			
					} else {
						res.json({
							type: true,
							data: "user removed!"
						});
					}
				})
			} else {
				res.status(401);
				res.json({
					status: 401,
					type: false,
					data: "user does not exist!"
				})
			}
		}
	});
});

function ensureAuthorized(req, res, next) {
	// var bearerToken;
	// var bearerHeader = req.headers["authorization"];
	// if (typeof bearerHeader !== 'undefined') {
	// 	var bearer = bearerHeader.split(" ");
	// 	bearerToken = bearer[0];
	// 	jwt.verify(bearerToken, jwt_secret, function(err) {
	// 		if (err) {
	// 			console.log(err);
	// 		} else {
	// 			req.token = bearerToken;
	// 			next();
	// 		}
	// 	});
	// } else {
	// 	res.send(403);
	// }

	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  	// below to valid username
  	//var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

  	if (token) {
  		try {
  			var decoded = jwt.decode(token, require('../config/secret.js')());
  			// if expired
  			if (decoded.exp <= Date.now()) {
  				res.json({
  					"status": 400,
  					"message": "Token Expired"
  				});
  				return;
  			} else {
  				next();
  			}
  		} catch(err) {
  			res.status(500);
  			res.json({
  				"status": 500,
  				"message": "Oops something went wrong",
  				"error": err
  			});
  			return;
  		}
  	} else {
  		res.status(401);
  		res.json({
  			"status": 401,
  			"message": "Invalid token or key"
  		})
  		return;
  	}
}

router.get('/me', ensureAuthorized, function(req, res) {
	User.findOne({token: req.token}, function(err, user) {
		if (err) {
			res.json({
				type: false,
				data: "Error occured " + err
			});
		} else {
			res.json({
				type: true,
				data: user
			});
		}
	});
});

module.exports = router;
