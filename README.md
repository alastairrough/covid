# Covid alerts
## Reference
1. https://docs.scrapy.org/en/latest/intro/tutorial.html
1. http://www.vch.ca/covid-19/school-exposures
1. http://www.vch.ca/covid-19/public-exposures
1. https://stackoverflow.com/questions/40856730/how-to-run-scrapy-project-in-jupyter


## Wrokflow to set up

```
scrapy startproject covid01
```
code for our first Spider. Save it in a file named  under the  directory in your project

```
./covid01/spiders/covid01_spider.py
```
css selector 
```
#\39 184 > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span > span
#\39 184 > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span > span
```
xpath 
```
//*[@id="9184"]/div/div[1]/div[1]/div[1]/span/span
/html/body/form/div[6]/div/span/div[1]/div[2]/div/div[2]/div/div[1]/main/div[3]/div/div/div[1]/div[2]/div/div[1]/div[1]/div[1]/span/span
```
from project directory
```
scrapy crawl covid01
```
use the shell
```
scrapy shell 'http://localhost/public_exposures.html'
scrapy shell 'http://localhost/schools_exposures.html'

response.css('title')
response.css('title::text').getall()
response.css('title').getall()
response.css('title::text').get()
response.css('title::text').re(r'Vancouver.*')

response.xpath('//title')
response.xpath('//title/text()').get()

response.xpath('//*[@id="9184"]')
response.xpath('//*[@id="9184"]/div/div[1]/div[1]/div[1]/span/span')

First panel
###########
response.xpath('//*[@id="9184"]/div/div[1]/div[1]/div[1]/span/span/text()').get()
Out[34]: 'Park Drive'
response.xpath('//*[@id="809"]/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/span/span/text()').get()
Out[4]: 'Cedar Walk Program, Vancouver School District'

Location:
//*[@id="9184"]/div/div[1]/div[1]/div[1]/span/span

Address:
//*[@id="9184"]/div/div[1]/div[1]/div[2]/span[1]

Date: 
//*[@id="9184"]/div/div[1]/div[1]/div[2]/span[4]

response.xpath('//*[@id="9184"]/div/div[1]/div[1]/div[2]/span[4]/text()').get()
response.xpath('//*[@id="809"]/div/div[1]/div[1]/div[1]/div[1]/div[3]/span[4]/text()').get()

Second Panel
############
response.xpath('//*[@id="9184"]/div/div[1]/div[2]/span/span/text()').get()
Out[48]: 'Abruzzo Cappuccino Bar'

Location:
response.xpath('//*[@id="9184"]/div/div[1]/div[2]/span/span/text()').get()

Address:
response.xpath('//*[@id="9184"]/div/div[1]/div[3]/span[1]/text()').get()

Date:
response.xpath('//*[@id="9184"]/div/div[1]/div[3]/span[4]/text()').get()

response.xpath('//*[@id="9184"]/div/div/div/div/span/span/text()').get()

All panels
##########
response.xpath('//*[@id="9184"]/div/div/div/div/span/span/text()').get()
response.xpath('//*[@id="9184"]/div/div/div/div/span/span/text()').getall()

response.xpath('//*[@id="9184"]/div/div/div/div/span/span/text()').getall()
    ...: 
Out[59]: 
['Park Drive',
 'The King’s Head Public House',
 'The West Pub',
 'Flying Beaver Bar and Grill']

response.xpath('//*[@id="9184"]/div/div/div/span/span/text()').getall()
Out[48]: 'Abruzzo Cappuccino Bar'

response.xpath('//*[@id="9184"]/div/div[2]/span/span/span/text()').get()
response.xpath('//*[@id="9184"]/div/div/span/span/span/text()').get()
response.xpath('//*[@id="9184"]/div/div[2]/span/span/span/text()').getall()
response.xpath('//*[@id="9184"]/div/div/span/text()').get()
response.xpath('//*[@id="9184"]/div/div/span/text()').getall()
Out[70]: 'Wreck Beach'

Top down from "panel-body"
#########################
response.xpath('//*[@id="9184"]/div').get()
Out[4]: 'Cedar Walk Program, Vancouver School District'
response.xpath('//*[@id="809"]/div').get()


response.xpath('/html/body/form/div[6]/div/span/div[1]/div[2]/div/div[2]/div/div[1]/main/div[3]/div/div/div[1]/div[2]/div/div[1]/div[1]/div[1]/span/span/text()').get()
Out[36]: 'Park Drive'

response.xpath('//*[@id="accordion"]').get()
response.xpath('//*[@id="accordion"]/text()').get()

response.xpath('//*[@id="DeltaPlaceHolderMain"]/div[1]/div[2]/div/div[2]/div/div[1]/main').get()

```
## with Regex
<span style="font-size:14px;">(.*?)<\/span>

m1 = response.xpath('//*[@id="9184"]/div').re(r'<span style="font-size:14px;">(.*?)<\/span>')
m2 = re.match('<span style="color:#843275;font-size:16px;">(.*?)<\/span>', m1)
m2 = re.match('Beaver', m1)
m2 = re.search('Beaver', m1)
m2 = re.findall('Beaver', m1)

for m2 in m1:
    print("match is ",m2)

for m2 in m1:
    m3 = re.match('September 26', m2)
    print("match is ",m3)

for m2 in m1:
    m3 = re.search('September 26', m2)
    print("match is ",m3)

for m2 in m1:
    m3 = re.findall('September 26', m2)
    print("match is ",m3)

for m2 in m1:
    m3 = re.match('<span style="color:#843275;font-size:16px;">(.*?)<\/span>', m2)
    print("match is ",m3)

for m2 in m1:
    m3 = re.search('<span style="color:#843275;font-size:16px;">(.*?)<\/span>', m2)
    print("match is ",m3)

<span style="color:#843275;font-size:16px;">

def remove_html_tags(text):
    """Remove html tags from a string"""
    import re
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

for m2 in m1:
    m3 = remove_html_tags(m2)
    print("match is ",m3)


### Investigate this command
```
You can start your first spider with:
    cd covid01
    scrapy genspider example example.com
```

### Issue with empty span
In the schools pages there are 2 HTML structures

<div style="font-size:16px;">
    <span style="font-size:14px;">Address:&nbsp;4685 Keith Road, West Vancouver, BC</span><br>
    <span style="font-size:14px;">Potential exposure date(s):&nbsp;</span>
    <span style="font-size:14px;">September 16 to 18, September 21 to 24</span>
</div>

<div style="font-size:16px;">
    <span style="font-size:14px;">Address:&nbsp;12300 Blundell Road, Richmond, BC</span><br>
    <span style="font-size:14px;">Potential exposure date(s):&nbsp;</span>
    <span aria-hidden="true" style="font-size:14px;"></span>
    <span style="font-size:14px;">
        <span aria-hidden="true">
        </span>
        September 11 to 18
    </span>
</div>

response.xpath('//*[@id="809"]/div/div[1]/div[1]/div[5]/div[4]/div[4]/div[2]/span[4]/text()')