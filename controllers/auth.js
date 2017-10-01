var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();

router.post('/signup', function(req, res) {
  console.log(req.body.email);
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread(function(user, created) {
    if (created) {
      // FLASH
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logged in'
      })(req, res);
    } else {
      // FLASH
      req.flash('error', 'Email already exists');
      res.redirect('/');
    }
  }).catch(function(error) {
    // FLASH
    req.flash('error', error.message);
    res.redirect('/');
  });
});


// FLASH
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: 'Invalid username and/or password',
  successFlash: 'You have logged in'
}));

router.get('/logout', function(req, res) {
  req.logout();
  // FLASH
  req.flash('success', 'You have logged out');
  res.redirect('/');
});

module.exports = router;
