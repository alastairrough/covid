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
    password: "**",
    database: "sitepoint"
});

d = new Date();
var mins = ('0' + d.getMinutes()).slice(-2);
var hours = ('0' + d.getHours()).slice(-2);
var months = ('0' + (d.getMonth() + 1)).slice(-2);
var dates = ('0' + d.getDate()).slice(-2);
//var df = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
var df = d.getFullYear() + '-' + months + '-' + dates; //var filename = d.getDate() + '-' + (d.getMonth() + 1) + '-' + (d.getYear() - 100) + '-' + d.getHours() + mins;
//var filenameToday = d.getDate() + '-' + (d.getMonth() + 1) + '-' + (d.getYear() - 100);
var filenameToday = dates + '-' + months + '-' + (d.getYear() - 100);
//request("http://orca.bcferries.com:8080/cc/marqui/at-a-glance.asp", function(error, response, body) {
request("http://localhost/temp2.html", function(error, response, body) {
    if (error) {
        console.log("Error: " + error);
    }
    //    console.log("Status code: " + response.statusCode);

    var $ = cheerio.load(body);

    $('td').each(function(index) {
        //    var title = $(this).find('p.title > a.title').text().trim();
        //    var score = $(this).find('div.score.unvoted').text().trim();
        //    var user = $(this).find('a.author').text().trim();
        var test = $(this);
        var test1 = /^ *(.*\b(?:route=03)\b.*) *$/.exec(test);
        var load = /[0-9]{1,3}\,[0-9]{1,3}\,[0-9]{1,3}/.exec(test1);
        var sailingID = /ID=[0-9]{4}/.exec(test1);
        var sailing = /[0-9]{4}/.exec(sailingID);
        var deptID = /dept=[A-Z]{3}/.exec(test1);
        var dept = /[A-Z]{3}/.exec(deptID);
        var route = /route=03/.exec(test1);
        if (test1 !== null && load !== null && sailing !== null) {
            //filename, date , time, day of the week, total load, car load, oversize load, sailing time
            //console.log('loads' + filenameToday + '.txt,' + df + ',' + d.getHours() + mins + ',' + d.getDay() + ',' + dept + ',' + load + ',' + sailing);
            //fs.appendFileSync('loads' + filenameToday + '.txt', df + ',' + hours + mins + ',' + d.getDay() + ',' + dept + ',' + load + ',' + sailing + '\n');
            var regexp = /[^,]+/gi;
            var str = String(load);
            var matches_array = str.match(regexp);
            var totalLoad = matches_array[0]; //parse load string
            var carLoad = matches_array[1]; //parse load string
            var oversizeLoad = matches_array[2]; //parse load string
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
            //filename, date , time, day of the week, total load, car load, oversize load, sailing time
//            console.log(sailingRecord);
//            fs.appendFileSync('loads_306' + filenameToday + '.txt', df + ',' + hours + mins + ',' + d.getDay() + ',' + dept + ',' + totalLoad + ',' + carLoad + ',' + oversizeLoad + ',' + sailing + '\n');
            console.log('loads_306' + filenameToday + '.txt', df + ',' + hours + mins + ',' + d.getDay() + ',' + dept + ',' + totalLoad + ',' + carLoad + ',' + oversizeLoad + ',' + sailing);
//            fs.appendFileSync('loads_306' + filenameToday + '.txt', df + ',' + hours + mins + ',' + d.getDay() + ',' + dept + ',' + totalLoad + ',' + carLoad + ',' + oversizeLoad + ',' + sailing + '\n');
            //Insert into MySQL
            /*con.query('INSERT INTO SailingLoads SET ?', sailingRecord, function(err, res) {
                if (err) throw err;
                console.log('Last insert ID:', res.insertId);
            }); */
        }
    });
//    con.end();
});