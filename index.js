require('dotenv').config();
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var multer = require('multer');
var cloudinary = require('cloudinary');
var upload = multer({dest: './uploads/'});
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

var session = require('express-session');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

var passport = require('./config/ppConfig');
// initialize the passport configuration and session as middleware
app.use(passport.initialize());
app.use(passport.session());

var images = [];

app.get('/', function(req, res) {
  // var apiUrl = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';
  // var apiKey = '777602b32d52468babf62398a5630de4';
  // var params = {
  //     "returnFaceId": "true",
  //     "returnFaceLandmarks": "false",
  //     "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
  // };
  // request({
  //   url: apiUrl,
  //   qs:{
  //     api_key: apiKey,
  //     query: params
  //   }
  // }, function(error, response, body){
  //   var face = JSON.parse(body);
  //   console.log(face);
    res.render('index', {images, cloudinary});
  // })
});

app.post('/', upload.single('myFile'), function(req,res){
	cloudinary.uploader.upload(req.file.path,function(result){
		images.push(result.public_id);
		res.redirect('/');
	});
	// res.send(req.file);

});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));


var server = app.listen(process.env.PORT || 3000);

module.exports = server;
