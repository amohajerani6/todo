const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const ejs = require('ejs');
const mongoose = require('mongoose')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

mongoose.connect("mongodb+srv://amohajerani6:KpzxlEtnT8wlscCN@cluster0.piaytyc.mongodb.net/todo")
const app = express();
app.use(session({
  secret: 'secretsaregood',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

var userSchema = new mongoose.Schema({
  username: String,
  password: String
  // whatever else
});

mongoList = mongoose.model('list', {
  'username': String,
  'item': String
})

userSchema.plugin(passportLocalMongoose)

User = mongoose.model('accounts', userSchema)

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set('view engine', 'ejs');
app.use(express.static('public'))

app.use(bodyParser.urlencoded({
  extended: false
}))

// date
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var day = today.getDay();
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
var day = days[day]

today = day + ', ' + mm + '/' + dd + '/' + yyyy;


var toDoItem = ''

app.get('/', function(req, res) {
  res.render('home')
})

app.get('/list', function(req, res) {
  if (req.isAuthenticated()) {
    mongoList.find({
        username: req.user.username
      },
      function(err, results) {
        if (results) {
          var items = results
        } else {
          var items = []
        }
        res.render('list', {
          today: today,
          toDoItems: items
        })
      })
  } else {
    res.redirect('/login')
  }
})


app.get('/register', function(req, res) {
  res.render('register')
})
app.get('/login', function(req, res) {
  res.render('login')
})

app.post('/register', function(req, res) {
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      res.redirect('/register')
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/list')
      })
    }
  })
})

app.post('/login', function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })
  req.login(user, function(err) {
    if (err) {
      console.log(err)
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/list')
      })
    }
  })
})



app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/')
    }
  })
})


app.post('/list', function(req, res) {
  newItem = new mongoList({
    username: req.user.username,
    item: req.body.toDoInput
  })
  newItem.save()
  res.redirect('/list')
})

app.post('/delete', function(req, res) {
  var id = req.body.checkbox;
  mongoList.findByIdAndRemove(id, function(err) {
    if (err) {console.log(err)}
    else {console.log('successfully deleted task')
      res.redirect('/list')}
  });

})



app.listen(process.env.PORT || 3000, console.log('listening'))
