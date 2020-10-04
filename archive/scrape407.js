// converts BCFerries daily schedule to crontab
// Giving up and trying via database
// add JSON object to database and re-export to assign name to key
// solves problem of Deprecation Warning. See cron logs 
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var mysql = require("mysql");
var hour;
var minute;
var AMPM;

var con = mysql.createConnection({
    host: "localhost",
    user: "alastair",
    password: "",
    database: "sitepoint"
});

request("http://localhost/schedule_data.html", function (error, response, body) {
    //request("http://orca.bcferries.com:8080/cc/marqui/arrivals-departures.asp?dept=HSB&route=03", function(error, response, body) {
    if (error) {
        console.log("Error: " + error);
    }
    if (body) {
        var $ = cheerio.load(body);
        $('td').each(function (index) {
            var test = $(this);
            var test1 = /((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))/.exec(test);
            var json = JSON.stringify(test1);

            // parse the json object
            var obj = JSON.parse(json);
            for (i in obj) {
                hour = obj[2];
                previousHour = parseInt(hour, 10) - 1;
                minute = obj[3];
                AMPM = obj[4];
                if (AMPM == "PM" && hour !== "12") {
                    hour = parseInt(hour, 10) + 12;
                }
                else if (AMPM == "PM" && hour == "12") {
                    hour = parseInt(hour, 10);
                }
                var crontimes = {
                    hour: hour,
                    minute: minute,
                    AMPM: AMPM
                };
                con.query('INSERT INTO schedule2Crontab SET ?', crontimes, function (err, res) {
                    if (err) throw err;
                    console.log('Last insert ID:', res.insertId);
                });
            }
        });
        con.end();
    }
    else { console.log("Body empty"); }
});
