var express = require('express');
var db = require('../models');
var isLoggedIn = require("../middleware/isLoggedIn");
var passport = require('../config/ppConfig');
var multer = require('multer');
var cloudinary = require('cloudinary');
var cloudinary2 = require('cloudinary');
var upload = multer({dest: './uploads/'});
var router = express.Router();

var images = [];

router.get('/', isLoggedIn, function(req, res){
  db.user.find({
    where: {id: req.user.id},
    include: [db.cloudinary]
  })
  .then(function(user){
    if(!user) throw Error();
    res.render('profile/index', {user: user, cloudinary2});
  })
  .catch(function(error){
    res.status(400).send("error");
  });
});

router.post('/', upload.single('myFile'), function(req,res){
	cloudinary.uploader.upload(req.file.path,function(result){
    images = [];
		images.push(result.public_id);
		  db.user.findById(req.user.id).then(function(user) {
        user.createCloudinary({
          src: result.public_id
        }).then(function(){

        });
	    });
    res.render('display', {images, cloudinary});
  });
});


module.exports = router;
