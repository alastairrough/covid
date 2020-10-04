// from http://www.netinstructions.com/simple-web-scraping-with-node-js-and-javascript/ //
// prereqs:
// sudo apt-get install nodejs
// sudo apt-get install npm
// npm install cheerio request mysql
// outputs to mysql
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "alastair",
    password: "",
    database: "sitepoint"
});

d = new Date();
var mins = ('0' + d.getMinutes()).slice(-2);
var hours = ('0' + d.getHours()).slice(-2);
var months = ('0' + (d.getMonth() + 1)).slice(-2);
var dates = ('0' + d.getDate()).slice(-2);
var df = d.getFullYear() + '-' + months + '-' + dates;
var filenameToday = dates + '-' + months + '-' + (d.getYear() - 100);
request("http://orca.bcferries.com:8080/cc/marqui/at-a-glance.asp", function(error, response, body) {
//    request("http://localhost/temp2.html", function(error, response, body) {
    if (error) {
        console.log("Error: " + error);
        //console.log("Status code: " + response.statusCode);
        //console.log("Body empty: ");
    }
   
    if(body) 
    {
    var $ = cheerio.load(body);

    $('td').each(function(index) {
        var test = $(this);
        var test1 = /^ *(.*\b(?:route=03)\b.*) *$/.exec(test);
        var load = /[0-9]{1,3}\,[0-9]{1,3}\,[0-9]{1,3}/.exec(test1);
        var sailingID = /ID=[0-9]{4}/.exec(test1);
        var sailing = /[0-9]{4}/.exec(sailingID);
        var deptID = /dept=[A-Z]{3}/.exec(test1);
        var dept = /[A-Z]{3}/.exec(deptID);
        var route = /route=03/.exec(test1);
        if (test1 !== null && load !== null && sailing !== null) {
            fs.appendFileSync('loads' + filenameToday + '.txt', df + ',' + hours + mins + ',' + d.getDay() + ',' + dept + ',' + load + ',' + sailing + '\n');
            var regexp = /[^,]+/gi;
            var str = String(load);
            var matches_array = str.match(regexp);
            var sailingRecord = {
                CaptureDate: df,
                CaptureTime: hours + mins,
                dayofWeek: d.getDay(),
                Departing: dept,
                totalLoad: matches_array[0], //parse load string
                carLoad: matches_array[1], //parse load string
                oversizeLoad: matches_array[2], //parse load string
                sailingTime: sailing
            };
            con.query('INSERT INTO SailingLoadsMay18 SET ?', sailingRecord, function(err, res) {
                if (err) throw err;
                console.log('Last insert ID:', res.insertId);
            });

        }
    });
    con.end();
    }
    else{
         console.log("Body empty");
    }
});