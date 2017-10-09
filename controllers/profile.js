var express = require('express');
var db = require('../models');
var isLoggedIn = require("../middleware/isLoggedIn");
var passport = require('../config/ppConfig');
var multer = require('multer');
var cloudinary = require('cloudinary');
var upload = multer({dest: './uploads/'});
var router = express.Router();

var images = [];

router.get('/', isLoggedIn, function(req, res){
    db.user.find({
      where: {id: req.user.id},
      include: [{
        model:db.image,
        order:'"isFavorite" DESC'
      }]
    })
  .then(function(user){
    if(!user) throw Error();
    res.render('profile/index', {user: user, cloudinary});
  })
  .catch(function(error){
    res.status(400).send("error");
  });
});

router.post('/', upload.single('myFile'), function(req,res){
  	cloudinary.v2.uploader.upload(req.file.path,{ width: 350, height: 350, crop: "limit" },function(error, result){
      images = [];
  		images.push(result.public_id);
  		  db.user.findById(req.user.id).then(function(user) {
          user.createImage({
            src: result.public_id
          }).then(function(){
          });
  	    });
      res.render('display', {images, cloudinary});
  })
});

router.get('/display/:id', isLoggedIn, function(req, res){
  var imageToRender = req.params.id;
  images = [];
  db.image.findById(imageToRender).then(function(image){
    var cloudId = image.src;
    res.render('display', {images, cloudId, cloudinary});
  });
});

router.post('/favorite/:id', function(req,res){
  var imageToFavorite = req.params.id;
  db.image.findById(imageToFavorite).then(function(image){
    image.updateAttributes({
      isFavorite: true
    })
  }).then(function(){
      res.redirect('/profile');
    });
  });

router.post('/unfavorite/:id', function(req,res){
  var imageToUnfavorite = req.params.id;
  db.image.findById(imageToUnfavorite).then(function(image){
    image.updateAttributes({
      isFavorite: false
    })
  }).then(function(){
      res.redirect('/profile');
  });
});

router.delete('/:id', function(req, res) {
    var imageToDelete = req.params.id;
    db.image.destroy({
      where: {id: imageToDelete}
    }).then(function(){
      res.redirect('/profile/index');
    })
});

module.exports = router;
