var boot = require('../app').boot,
	shutdown = require('../app').shutdown,
	port = require('../app').port,
	expect = require('expect.js'),
	superagent = require('superagent');

var urlPath = 'http://localhost:' + port;

describe('user login', function(){
	// before(function() {
	// 	boot();
	// });

	describe('signup then get profile', function(){
		it('should register a new user', function(done){
			// delete the user if it already exists
			superagent
				.post(urlPath + '/deregister')
				.set('Content-Type', 'application/json')
				.send('{"username": "dummy@gmail.com", "password": "password"}')
				.end(function(res){
					superagent
						.post(urlPath + '/signup')
						.set('Content-Type', 'application/json')
						.send('{"username": "dummy@gmail.com", "password": "password"}')
						.end(function(res){
							expect(res.status).to.equal(200);
							expect(res.body.token).not.to.be(undefined);
							token = res.body.token;
							done()
						});
				})
		})
		it('should authorize viewing me request', function(done){
			superagent
				.post(urlPath + '/login')
				.set('Content-Type', 'application/json')
				.send('{"username": "dummy@gmail.com", "password": "password"}')
				.end(function(res){
					expect(res.body.token).not.to.be(undefined);
					superagent
						.get(urlPath + '/me')
						.set('x-access-token', res.body.token)
						.end(function(res){
							expect(res.status).to.equal(200);
							expect(res.body.data).not.to.be(undefined);
							expect(res.body.data.username).to.equal("dummy@gmail.com");
							done();
						})
				})
		})
		it('should not authorize incorrect username', function(done){
			superagent
				.post(urlPath + '/login')
				.set('Content-Type', 'application/json')
				.send('{"username": "trolllullul@gmail.com", "password": "password"}')
				.end(function(res){
					console.log()
					expect(res.status).to.equal(401);
					done();
				})
		});

	});

	// after(function() {
	// 	shutdown();
	// });
});