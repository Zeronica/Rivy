var expect = require('expect.js'),
	superagent = require('superagent');

var urlPath = "http://localhost:5000";

var data = {
	userData: [
		{
			username: "dummy@gmail.com",
			password: "password"
		}
	]
}

// testing user account authentication
describe('Accounts ', function() {
	before(function(done) {
		superagent
			.post(urlPath + '/deregister')
			.set('Content-Type', 'application/json')
			.send(JSON.stringify(data.userData[0]))
			.end(function(res){
				expect(res.status).to.equal(200);
				done();
			})
	})

	it('should sign up a user', function(done) {
		superagent
			.post(urlPath + '/signup')
			.set('Content-Type', 'application/json')
			.send(JSON.stringify(data.userData[0]))
			.end(function(res){
				console.log(res);
				expect(res.status).to.equal(200);
				expect(res.body.token).not.to.be(undefined);
				done();
			})
	})
})