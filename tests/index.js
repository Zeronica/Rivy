var boot = require('../app').boot,
	shutdown = require('../app').shutdown,
	port = require('../app').port,
	expect = require('expect.js'),
	superagent = require('superagent');

var urlPath = 'http://localhost:' + port;

// describe('user login', function(){
// 	before(function() {
// 		boot();
// 	});

// 	describe('signup then get profile', function(){
// 		it('should register a new user', function(done){
// 			// delete the user if it already exists
// 			superagent
// 				.post(urlPath + '/deregister')
// 				.set('Content-Type', 'application/json')
// 				.send('{"username": "dummy@gmail.com", "password": "password"}')
// 				.end(function(res){
// 					superagent
// 						.post(urlPath + '/signup')
// 						.set('Content-Type', 'application/json')
// 						.send('{"username": "dummy@gmail.com", "password": "password"}')
// 						.end(function(res){
// 							//console.log(res);
// 							expect(res.status).to.equal(200);
// 							expect(res.body.token).not.to.be(undefined);
// 							token = res.body.token;
// 							done()
// 						});
// 				})
// 		})
// 		it('should authorize viewing me request', function(done){
// 			// not authorized call
// 			superagent
// 				.get(urlPath + '/api/v1/rivys')
// 				.end(function(res){
// 					expect(res.status).not.to.equal(200);
// 				})

// 			superagent
// 				.post(urlPath + '/login')
// 				.set('Content-Type', 'application/json')
// 				.send('{"username": "dummy@gmail.com", "password": "password"}')
// 				.end(function(res){
// 					expect(res.body.token).not.to.be(undefined);
// 					superagent
// 						.get(urlPath + '/api/v1/rivys')
// 						.set('x-access-token', res.body.token)
// 						.end(function(res){
// 							//console.log(res.body);
// 							expect(res.status).to.equal(200);
// 							expect(res.body).not.to.be(undefined);
// 							done();
// 						})
// 				})
// 		})
// 		it('should not authorize incorrect username', function(done){
// 			superagent
// 				.post(urlPath + '/login')
// 				.set('Content-Type', 'application/json')
// 				.send('{"username": "trolllullul@gmail.com", "password": "password"}')
// 				.end(function(res){
// 					console.log()
// 					expect(res.status).to.equal(401);
// 					done();
// 				})
// 		});

// 	});

// 	after(function() {
// 		shutdown();
// 	});
// });

var logThing = function(thing) {
	console.log("!!!!XXXXXXXXXXXXXXXXXXXXXX==============XXXXXXXXXXXXXXXXX!!!!!");
	console.log(thing);
}

var secureUrlPath = urlPath + '/api/v1';

var login = function(cb) {
	superagent
		.post(urlPath + '/login')
		.set('Content-Type', 'application/json')
		.send('{"username": "dummy@gmail.com", "password": "password"}')
		.end(function(res){
			expect(res.body.token).not.to.be(undefined);
			logThing(res.body);
			cb(res.body.token, res.body.user._id);
		})
}

var postTwoRivies = function(token, cb) {
	superagent
		.post(secureUrlPath + '/rivys')
		.set('x-access-token', token)
		.send({
			address: "2650 Haste St Berkeley, CA 94704",
			lat: "37.86646395921707",
			lng: "-122.25485689938068",
			title: "title1",
			body: "lululululululul1"
		})
		.end(function(res) {
			
			expect(res.status).to.equal(200);
			superagent
				.post(secureUrlPath + '/rivys')
				.set('x-access-token', token)
				.send({
					address: "2400 Durant Ave, Berkeley, CA",
					lat: "37.86751605570316",
					lng: "-122.26107962429523",
					title: "title2",
					body: "lululululululul2"
				})
				.end(function(res) { 
					expect(res.status).to.equal(200);
					superagent
						.get(secureUrlPath + '/locations/' + '37.86751605570316/-122.26107962429523/100')
						.set('x-access-token', token)
						.end(
							cb(res, token)
						)
				})
		})
}

describe('post 3 rivys of two locations and get those locations', function() {
	before(function () {
		boot();
	});

	it('should allow user to login and post rivies', function(done){
		login(function(token) {
			postTwoRivies(token, function(res) {
					expect(res.status).to.equal(200);
					//console.log(res);
					done();
			})
		})
	});

	after(function() {
		shutdown();
	});
})

// check user-rivy link
describe('check one-to-many relationship between user and rivys', function() {
	before(function () {
		boot();
	});

	it('should allow the user to find rivies based on self', function(done){
		login(function(token, user_id) {
			postTwoRivies(token, function(res, token) {
				
				// this checks getting rivys from the user
				superagent
					.get(secureUrlPath + '/rivys/filter/self')
					.set('x-access-token', token)
					.end(function(res) {
						expect(res.status).to.equal(200);
						console.log("===================================");
						console.log(res.body);
						expect(res.body.length).not.to.equal(0);
						// test all rivies
						expect(res.body[0].user).to.equal(user_id);
						// this checks getting user from rivy
						rivy_id = res.body[0]._id;

						superagent
							.get(secureUrlPath + '/rivy/' + rivy_id)
							.set('x-access-token', token)
							.end(function(res) {
								expect(res.status).to.equal(200);
								expect(res.body.user.username).to.equal("dummy@gmail.com");

								// check posting a comment to the rivy
								superagent
									.post(secureUrlPath + '/' + rivy_id + '/comments')
									.set('Content-Type', 'application/json')
									.set('x-access-token', token)
									.send('{"body": "lul"}')
									.end(function(res){
										expect(res.status).to.equal(200);
										done();
									})
							})
					})
			})
		})
	});

	after(function() {
		shutdown();
	});
})