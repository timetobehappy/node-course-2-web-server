const request = require('request');
const express = require('express');
const path = require('path');
const moment = require('moment');
const hbs = require('hbs');
const fs = require('fs')



const port = process.env.PORT || 3000;


//var lineReader;
var out = "<ul id=myList>";


var options = {
    //url: 'http://m.kmart.com/toys-games-dolls-accessories-baby-dolls/b-20722',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        //'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) CriOS/58.0.3019.0 Mobile/13B143 Safari/601.1.46',
        'Pragma': 'akamai-x-get-client-ip, akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-check-cacheable, akamai-x-get-cache-key, akamai-x-get-extracted-values, akamai-x-get-nonces, akamai-x-get-ssl-client-session-id, akamai-x-get-true-cache-key, akamai-x-serial-no, akamai-x-feo-trace, akamai-x-get-request-id'
    }
};

var getResponseForUrls = function() {


  var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream('mobiletestgroup.txt')
  });

  console.log('Inside getResponseForUrls');

    lineReader.on('line', function(line) {
        console.log('Line from file:', line);


        options.url = line;
        //options.headers.'User-Agent'="Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) CriOS/58.0.3019.0 Mobile/13B143 Safari/601.1.46";
        request.head(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log('\n');
                // console.log((JSON.stringify(response.headers)));
                // console.log('\n');
                // console.log('\n');
                if (JSON.stringify(response.headers).indexOf('phantomjs-workerid') == -1) {
                //if (JSON.stringify(response.headers).indexOf("ORIGIN_INDICATOR=BOT") == -1) {
                    console.log(`${line} is going to Production`);
                    //out = out + "<li>" + `${line} is going to Prod` + "</li>";
                    out = out + "<li>" + `.........` + "</li>";
              //  } else if (JSON.stringify(response.headers).indexOf("ORIGIN_INDICATOR=PROD") == -1) {
                } else {
                    console.log(`${line} is going to Bot`);
                    out = out + "<li>" + `${line} is going to Bot` + "</li>";
                }

            } else {
                console.log(`${error} for ${line}`);
            }
        });
    });



}

var getResponseForUrlsDesk = function() {

  var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream('desktoptestgroup.txt')
  });

  console.log('Inside getResponseForUrls');

    lineReader.on('line', function(line) {
        console.log('Line from file:', line);


        options.url = line;
        //options.headers.'User-Agent'="Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) CriOS/58.0.3019.0 Mobile/13B143 Safari/601.1.46";
        request.head(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {

                //console.log(typeof(JSON.stringify(response.headers).indexOf('phantomjs-workerid')));
                if (JSON.stringify(response.headers).indexOf("ORIGIN_INDICATOR=BOT") == -1) {
                //if (JSON.stringify(response.headers).indexOf('phantomjs-workerid') == -1) {
                    console.log(`${line} is going to Production`);
                    out = out + "<li>" + `${line} is going to Prod` + "</li>";
                } else {
                    console.log(`${line} is going to Bot`);
                    out = out + "<li>" + `${line} is going to Bot` + "</li>";
                }

            } else {
                console.log(`${error} for ${line}`);
            }
        });
    });



}

var app = express();
//var currentYear = moment().format('YYYY');
hbs.registerHelper('getCurrentYear', () => {
    return moment().format('YYYY');
})

hbs.registerHelper('toUpperCaseHelper', (text) => {
    return text.toUpperCase();
})

hbs.registerHelper('botList', () => {

    if (port === 3000) {


    var temp;

    console.log('Inside botList');

    getResponseForUrls();




    temp=out;
    out = "<ul id=myList>";

    return temp + "</ul>"+"<br>";
  }

});

hbs.registerHelper('botListDesk', () => {

    var temp;

    console.log('Inside botList');

    getResponseForUrlsDesk();




    temp=out;
    out = "<ul id=myList>";

    return temp + "</ul>"+"<br>";

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


app.get('/mobile', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Mobile Test Page',
        welcomeMessage: 'This is the new home page!!!!.'
    });
})

app.get('/desktop', (req, res) => {
    res.render('desktop.hbs', {
        pageTitle: 'Desktop Test Page',
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
