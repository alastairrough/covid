// reads the database for crontab values
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var mysql = require("mysql");
const _ = require('lodash/fp');
var hour;
var minute;
var AMPM;

var con = mysql.createConnection({
    host: "localhost",
    user: "alastair",
    password: "",
    database: "sitepoint"
});


con.connect();
con.query("SELECT DISTINCT * FROM schedule2Crontab;", function (err, results, fields) {
    // if (err) throw err;
    if (err) console.log("Error: " + err);
    var json = JSON.stringify(results);
    const crontimes = Object.freeze(
        JSON.parse(json));
    //    console.log(crontimes);

    // Filter
    console.log(
        _.filter(crontimes, function (val) {
            return val === 'AM';
        })
    );
});
con.end();