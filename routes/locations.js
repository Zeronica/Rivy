var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Location = mongoose.model('Location');


var computeCoordBounds = function(lat, lon, d) {
	earthRad = 6371;
	r = d/earthRad;

	latT = Math.asin(Math.sin(lat)/Math.cos(r));

	deltaLon = Math.acos( ( Math.cos(r) - Math.sin(latT) * Math.sin(lat) ) / ( Math.cos(latT) * Math.cos(lat) ) );
      // = Math.asin(Math.sin(r)/Math.cos(lat));

    var o = {
		latmin : lat - r,
		latmax : lat + r,
		lngmin : lon - deltaLon,
		lngmax : lon + deltaLon
	}

	return o;
};

router.param('location', function(req, res, next, id) {
  var query = Location.findById(id);

  query.exec(function (err, location) {
	if (err) { return next(err); }
	if (!location) { return next(new Error('can\'t find location')); }

	req.location = location;
	return next();
  });
});

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

// GET a list of locations
/*
given a lat, lng, and distance, filter based on bounds
*/
router.get('/:lat/:lng/:distance', function(req, res, next) {
		o = computeCoordBounds(Number(req.params.lat), Number(req.params.lng), Number(req.params.distance));
		console.log(o);
		Location.find( { lng: {$lt: o.lngmax, $gt: o.lngmin}, lat: {$lt: o.latmax, $gt: o.latmin} }, function(err, locations){
			if (err) {
				return next(err);
			}
			res.json(locations);
		});
});

// GET a single location given an id
router.get('/:location', function(req, res, next) {
	res.json(req.location);
});

module.exports = router;


