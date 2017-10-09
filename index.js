require('dotenv').config();
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var multer = require('multer');
var cloudinary = require('cloudinary');
var upload = multer({dest: './uploads/'});
var bodyParser = require('body-parser');
var request = require('request');
var db = require('./models');
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


var images = [];
var passport = require('./config/ppConfig');
// initialize the passport configuration and session as middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res) {
    res.render('index', {images, cloudinary});
});

app.post('/', upload.single('myFile'), function(req,res){
	cloudinary.v2.uploader.upload(req.file.path,{ width: 350, height: 350, crop: "limit" },function(error, result){
    images = [];
		images.push(result.public_id);
    res.render('display', {images, cloudinary});
  });
});

app.get('/error', function(req,res){
  res.render('error');
})

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error');
  });
}
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error');
});


app.use('/auth', require('./controllers/auth'));
app.use('/profile', require('./controllers/profile'));
app.use(redirectUnmatched);

function redirectUnmatched(req, res) {
  res.render("error");
}


var server = app.listen(process.env.PORT || 3000);

module.exports = server;
