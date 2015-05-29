var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var jwt = require("jsonwebtoken");
var User = mongoose.model('User');

//testing purposes obviously
var jwt_secret = "ABC";

// render dummy view
router.get('/', function(req, res, next) {
	res.render('dummy.ejs');
});

router.post('/auth', function(req, res){
	User.findOne({email: req.body.email, password: req.body.password}, function(err, user){
		if (err) {
			res.json({
				type: false,
				data: "Error occured: " + err
			});
		} else {
			if (user) {
				res.json({
					type: true,
					data: user,
					token: user.token
				});
			} else {
				res.json({
					type: false,
					data: "Incorrect email/password"
				});
			}
		}
	});
});

router.post('/signup', function(req, res){
	User.findOne({email: req.body.email, password: req.body.password}, function(err, user){
		if (err) {
			res.json({
				type: false,
				data: "Error occured: " + err
			});
		} else {
			if (user) {
				res.json({
					type: false,
					data: "User already exists!"
				});
			} else {
				var userModel = new User();
				userModel.email = req.body.email;
				userModel.password = req.body.password;
				userModel.save(function(err, user){
					user.token = jwt.sign(user, jwt_secret);
					user.save(function(err, user1){
						res.json({
							type: true,
							data: user1,
							token: user1.token
						});
					});
				});
			}
		}
	});
});

// testing purposes only
router.post('/deregister', function(req, res){
	User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
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
				res.json({
					type: false,
					data: "user does not exist!"
				})
			}
		}
	});
});

function ensureAuthorized(req, res, next) {
	var bearerToken;
	var bearerHeader = req.headers["authorization"];
	if (typeof bearerHeader !== 'undefined') {
		var bearer = bearerHeader.split(" ");
		bearerToken = bearer[0];
		jwt.verify(bearerToken, jwt_secret, function(err) {
			if (err) {
				console.log(err);
			} else {
				req.token = bearerToken;
				next();
			}
		});
	} else {
		res.send(403);
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
