const express = require('express');
const path = require('path');
const moment = require('moment');
const hbs = require('hbs');
const fs = require('fs')
const request = require('request');


const port = process.env.PORT || 3000;

var options = {
    //url: 'http://m.kmart.com/toys-games-dolls-accessories-baby-dolls/b-20722',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
            //'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) CriOS/58.0.3019.0 Mobile/13B143 Safari/601.1.46'
    }
};

var lineReader;

var app = express();
//var currentYear = moment().format('YYYY');
hbs.registerHelper('getCurrentYear', () => {
    return moment().format('YYYY');
})

hbs.registerHelper('toUpperCaseHelper', (text) => {
    return text.toUpperCase();
})

hbs.registerHelper('botList', () => {

    lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('mobiletestgroup_small.txt')
    });



    var out = "<ul>";

    lineReader.on('line', function(line) {
        options.uri = line;
        console.log(options.uri);
        request.head(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {

                //console.log(typeof(JSON.stringify(response.headers).indexOf('phantomjs-workerid')));
                if (JSON.stringify(response.headers).indexOf('phantomjs-workerid') == -1) {
                    out = out + "<li>" + `${line} is going to Prod` + "</li>";
                    //console.log(`${options.url} is going to Prod`);
                } else {
                    //console.log(`${options.url} is going to Bot`);
                    out = out + "<li>" + `${line} is going to Bot` + "</li>";
                }

            } else {
                console.log(error);
                //console.log(`${line} gave a http response of ${response.statusCode}`);
                //out = out + "<li>" + `${line} gave a http response of ${response.statusCode}` + "</li>";
            }
        });

        out = out + "<li>" + "line" + "</li>";
    });



    return out + "</ul>";

});
hbs.registerPartials(path.join(__dirname, '/views/partials'));
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
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


app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
})
