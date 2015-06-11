var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var User = mongoose.model('User');
 
var auth = {
 
  login: function(req, res) {
 
    var username = req.body.username || '';
    var password = req.body.password || '';
 
    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
 
    findUser(username, password, function(err, user) {
      if(!user) { 
          res.status(401);
          res.json({
            status: 401,
            type: false,
            data: "User does not exist!"
          });
          return;
      }
      res.json(genToken(user));
    })
 
  },

  signup : function(req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';
 
    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    findUser(username, password, function(err, user) {
      if(user) { 
          res.status(401);
          res.json({
            status: 401,
            type: false,
            data: "User already exists!"
          });
          return;
      }
      // register the new user
      saveUser(username, password, function(err, user){
        if (err) {
          res.json({
            type: false,
            data: "Error occured: " + err
          });
        } else {
          res.json(genToken(user));
        }
      });
    });

  },

  deregister : function(req, res) {

    var username = req.body.username || '';
    var password = req.body.password || '';
 
    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    findUser(username, password, function(err, user) {
      if (!user) {
          res.status(401);
          res.json({
            status: 401,
            type: false,
            data: "User doesn not exist!"
          });
      }
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
    });

  }, 
 
  // validate: function(username, password) {
  //   return User.findOne({username: username, password: password});
  // },
 
  // validateUser: function(username) {
  //   return undefined;
  // },

}
 
// private method
function genToken(user) {
  var expires = expiresIn(7); // 7 days
  var token = jwt.encode({
    exp: expires,
    userID: user._id
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

function saveUser(username, password, callback) {
    var userModel = new User();
    userModel.username = username;
    userModel.password = password;
    userModel.save(callback);
}

function findUser(username, password, callback) {
  User.findOne({username: username, password: password}, callback);
}
 
module.exports = auth;