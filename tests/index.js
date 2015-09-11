var expect = require('expect.js'),
	superagent = require('superagent');
	mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test');
console.log(mongoose.connection.db.collectionNames);


var urlPath = "http://localhost:5000";

var data = {
	userData: [
		{
			username: "dummy@gmail.com",
			password: "password"
		}
	]
}

// reuseable componenets
var deregisterUsers = function(cb) {

	var deReg = function(i) {
		if (i >= data.userData.length)
			return cb()

		superagent
			.post(urlPath + '/deregister')
			.set('Content-Type', 'application/json')
			.send(JSON.stringify(data.userData[i]))
			.end(function(res){
				expect(res.status).to.equal(200);
				deReg(i+1)
			})
	}

	deReg(0);
}

// var login = function(userIndex, cb) {
// 	superagent
// 		.post()
// }


// testing user account authentication
describe('Testing', function() {
	after(function(done) {
		// cleanup
		deregisterUsers(done)
	})

	describe('Accounts', function(done) {
		it('should sign up a user', function(done) {
			superagent
				.post(urlPath + '/signup')
				.set('Content-Type', 'application/json')
				.send(JSON.stringify(data.userData[0]))
				.end(function(res){
					expect(res.status).to.equal(200);
					expect(res.body.token).not.to.be(undefined);
					done();
				})
		})
		// it ('should allow the user to log in and view a list of rivys', function(done) {
		// 	superagent

		// })
	})

	// describe ('rivys', function(done) {
	// 	it ('should allow ')
	// })
})