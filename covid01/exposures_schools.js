// scrapes VCH 
// npm install cheerio request mysql
var request = require('request');
var cheerio = require('cheerio');

request("http://localhost/schools_exposures.html", function (
    error,
    response,
    body
) {
    // console.log(body)
    var $ = cheerio.load(body);
    // $("#809 > div").html();
    test = $("#809 > div").html();
    // test = $("#809 > div").text();
    // test = $.html();
    console.log(test);
});
