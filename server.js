const express = require('express')
const bodyParser = require('body-parser')
const https = require('https');

const app = express()
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
const days = ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday","Saturday"]
var day=days[day]

today = day+', '+mm + '/' + dd + '/' + yyyy;
var toDoItem=''
var items=[]

app.get('/', function(req, res) {
  res.render('index', {today:today, toDoItems:items})
})

// till here

app.post('/', function(req, res)
{
  items.push(req.body.toDoInput)
  res.redirect('/')

})

app.listen(3000, console.log('listening'))
