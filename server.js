const express = require('express');
const path = require('path');
const moment = require('moment');
const hbs = require('hbs');
const fs = require('fs')

const PORT = process.ENV.PORT || 3000;

var app = express();
//var currentYear = moment().format('YYYY');
hbs.registerHelper('getCurrentYear', () => {
    return moment().format('YYYY');
})

hbs.registerHelper('toUpperCaseHelper', (text) => {
    return text.toUpperCase();
})
hbs.registerPartials(path.join(__dirname, '/views/partials'));
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err)=>{
      if(err)
      {
        console.log('Unable to append to server.log.')
      }
    })

    next();
});

app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(__dirname + '/public'))


app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'This is the new home page!!!!.'
    });
})

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
})

app.get('/json', (req, res) => {
    res.send({
        name: 'Andrew',
        likes: [
            'swimming',
            'fishing',
            4
        ]
    })
})


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`)
})
