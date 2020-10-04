// scrapes VCH 

var cheerio = require('cheerio');

const $ = cheerio.load('<h2 class="title">Hello world</h2>')
$('h2.title').text('Hello there!')
$('h2').addClass('welcome')
test = $.html();
console.log(test);

