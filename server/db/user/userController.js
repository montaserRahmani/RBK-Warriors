
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var User = require("./userModel.js");
var configAuth = require("../../config/auth.js");

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
  clientID: configAuth.gitHubAuth.clientID,
  clientSecret: configAuth.gitHubAuth.clientSecret,
  callbackURL: configAuth.gitHubAuth.clientURL
},
function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    console.log('IM in MONGO creation');
    process.nextTick(function () {
      User.findOneAndUpdate({ _id: profile.id },{$set:{
        displayName: profile.displayName,
        email: profile.emails[0].value,
        img: profile._json.avatar_url,
        following: profile._json.following,
        followers: profile._json.followers,
        publicRepos: profile._json.public_repos
      }}, {new: true}, function (err, user) {
        if(err) {
          return done(err)
        }
        if(user) {
          return done(null,user)
        } else {
          var newUser = new User();
          newUser._id = profile.id;
          newUser.username = profile.username;
          newUser.displayName = profile.displayName;
          newUser.profileUrl = profile.profileUrl;
          newUser.email = profile.emails[0].value;
          newUser.img = profile._json.avatar_url;
          newUser.following = profile._json.following;
          newUser.followers = profile._json.followers;
          newUser.publicRepos = profile._json.public_repos;
          newUser.save(function(err){
            if(err){throw err;}
            return done(null,newUser);
          })
        }
      });
    });
  }
  ));

module.exports ={
	getAllUsers : function (req, res) {
   User.find().exec(function (err, alluser) {
     if(err){
      res.status(500).send('err');
    }else{
      res.json(alluser)
    }
  });
 },

 getOneUser : function (req,res) {
   User.findById(req.params.id, function (err, teacher) {  
    if (err) {
      res.send(err)
    }else{
      res.json(teacher)
    } 
  })
 },

 validateAccount: function(req,res){
  if(req.user.completed){
    if(req.user.activated){
      res.status(201).send(req.user);
    }else{
      res.status(403).send('not activated');
    }
  }else{
    res.status(401).send(req.user);
  }
 }
}