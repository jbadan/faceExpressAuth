var express = require('express');
var db = require('../models');
var isLoggedIn = require("../middleware/isLoggedIn");
var passport = require('../config/ppConfig');
var multer = require('multer');
var cloudinary = require('cloudinary');
// var cloudinary2 = require('cloudinary');
var upload = multer({dest: './uploads/'});
var router = express.Router();

var images = [];

router.get('/', isLoggedIn, function(req, res){
  db.user.find({
    where: {id: req.user.id},
    include: [db.image]
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
  });
});

router.get('/display/:id', isLoggedIn, function(req, res){
  var imageToRender = req.params.id;
  db.image.findById(imageToRender).then(function(image){
    var cloudId = image.src;
    res.render('display', {images, cloudId, cloudinary});
  });
});

// router.post('/:id', function(req,res){
//   var imageToFavorite = req.params.id;
//   db.cloudinary.findById(imageToFavorite).then(function(image){
//     image.createFavorite({
//       isFavorite: true
//     })
//   })
//   res.redirect('/profile/');
// })

router.delete('/:id', function(req, res) {
    var imageToDelete = req.params.id;
    db.image.destroy({
      where: {id: imageToDelete}
    }).then(function(){
      res.redirect('/profile/index');
    })
});

module.exports = router;
