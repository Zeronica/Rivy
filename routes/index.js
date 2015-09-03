var express = require('express');
var router = express.Router();
 
var auth = require('./auth.js');

var rivys = require('./rivys.js');
var locations = require('./locations.js');
var preload = require('./preload.js');
 
// main page
router.get('/', function(req, res) {
	res.render('index');
})

/*
 * Routes that can be accessed only by autheticated users
 */
// preload objects
router.param('rivy', preload.loadRivy);
router.param('location', preload.loadLocation);
router.param('comment', preload.loadComment);

/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);
router.post('/signup', auth.signup);
router.post('/deregister', auth.deregister);

// serve location, rivys, and rivy data
router.get('/api/v1/rivys', rivys.getAll);
router.get('/api/v1/locations/:lat/:lng/:distance', locations.getAllWithinBounds);
router.get('/api/v1/rivys/:location', rivys.getAllAtLocation);
router.get('/api/v1/rivy/:rivy', rivys.getOne);
router.get('/api/v1/rivys/filter/self', rivys.getAllForSelf);

// comment and rivy creation
router.post('/api/v1/rivys', rivys.createRivy);
router.post('/api/v1/:rivy/comments', rivys.createRivyComment);

// comment and rivy upvote
router.get('/api/v1/rivy/upvote/:rivy', rivys.upvoteRivy);
router.get('/api/v1/:rivy/comments/:comment/upvote', rivys.upvoteRivyComment);


// // test routes without auth
// // router.get('/rivys', rivys.getAll);
// router.post('/rivys', rivys.createRivy);
// //router.get('/location/:location', locations.getOne);
// // router.get('/rivys/:location', rivys.getAllAtLocation);
// router.get('/locations/:lat/:lng/:distance', locations.getAllWithinBounds);
// router.get('/rivy/:rivy', rivys.getOne);

//  // rivys and comments
// router.get('/api/v1/rivys', rivys.getAll);
// router.get('/api/v1/rivys/:location', rivys.getAllAtLocation);
// router.get('/api/v1/rivy/:rivy', rivys.getOne);
// router.post('/api/v1/rivys', rivys.createRivy);
// router.get('/api/v1/rivy/upvote/:rivy', rivys.upvoteRivy);
// router.get('/api/v1/:rivy/comments/:comment/upvote', rivys.upvoteRivyComment);
// router.post('/api/v1/:rivy/comments', rivys.createRivyComment);
// router.get('/api/v1/rivys/filter/self', rivys.getAllForSelf);

// // locations
// router.get('/api/v1/locations', locations.getAll);
// router.get('/api/v1/locations/:lat/:lng/:distance', locations.getAllWithinBounds);
// router.get('/api/v1/location/:location', locations.getOne);

module.exports = router;