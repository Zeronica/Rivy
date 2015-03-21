var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Location = mongoose.model('Location');


// GET a list of all locations
/*needs to specify a center longitude and latitude,
as well as a radius*/
router.get('/', function(req, res, next) {
	Location.find(function(err, locations) {
		if (err) {
			return next(err);
		}
		res.json(locations);
	});
});

module.exports = router;


