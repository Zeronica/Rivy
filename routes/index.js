var express = require('express');
var router = express.Router();

// allow access
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// render dummy view
router.get('/', function(req, res, next) {
	res.render('dummy.ejs');
});

module.exports = router;
