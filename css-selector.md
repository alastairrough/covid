# CSS Selector

## References
1. https://developers.google.com/web/tools/chrome-devtools/console/utilities


using with covid exposure site. Aim to scrape a complete HTML table or div from site rather than scraping elements and reconstructing.

Code that works in browser console:

```
# returns first paragraph element
$('p');
$('p').innerText;
etc


# clear() clears the console of its history.

clear();

# dir(object) displays an object-style listing of all the specified object's properties. This method is an alias for the Console API's console.dir() method.

The following example shows the difference between evaluating document.body directly in the command line, and using dir() to display the same element:

document.body;
dir(document.body);

# opens the document.body in the Elements panel:
inspect(document.body);


$(selector, [startNode])
$(selector) returns the reference to the first DOM element with the specified CSS selector. When called with one argument, this function is an alias for the document.querySelector() function.

The following example returns a reference to the first <img> element in the document:
$('img');
$('img').src;
$('div');
$('div').innerText;
$('div').innerHTML;
$('div').outerText;
$('div').outerHTML;

# for school exposures
# copy Selector
document.querySelector();
# copy JS Path (need to replace "\" with "\\")
$('#\\38 09')
document.querySelector('#\\38 09')
document.querySelector("#\\38 09 > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span > span")

```
## Xpath
```
$x(path, [startNode])
```
$x(path) returns an array of DOM elements that match the given XPath expression.

For example, the following returns all the <p> elements on the page:
```
$x("//p")

# returns all the <p> elements that contain <a> elements:
$x("//p[a]")

# for school exposures
$x('//*[@id="809"]')
$x('//*[@id="809"]/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/span/span/text()')

```



Code that doesnt work (yet)
```

$('div').length;

```