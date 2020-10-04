// scrapes VCH 

{/* 
<ul id="fruits">
  <li class="apple">Apple</li>
  <li class="orange">Orange</li>
  <li class="pear">Pear</li>
</ul> 
*/}

var cheerio = require('cheerio');

const $ = cheerio.load('<ul id="fruits"><li class="apple">Apple</li><li class="orange">Orange</li><li class="pear">Pear</li></ul>')

test = $('.apple', '#fruits').text()
//=> Apple
console.log(test);

test = $('ul .pear').attr('class')
//=> pear
console.log(test);

test = $('li[class=orange]').html()
//=> Orange
console.log(test);
