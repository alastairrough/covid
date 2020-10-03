"""
parses local copy of VCH convid 19 exposures
public exposures
"""
import scrapy
# import re

def remove_html_tags(text):
    """Remove html tags from a string"""
    import re
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

class QuotesSpider(scrapy.Spider):
    name = "covid01"
    start_urls = [
            # 'http://localhost/public_exposures.html',
            'http://www.vch.ca/covid-19/public-exposures',
     ]

    # def parse(self, response):
    #     page = response.url.split("/")[-2]
    #     filename = 'quotes-%s.html' % page
    #     with open(filename, 'wb') as f:
    #         f.write(response.body)

    def parse(self, response):
    # #     """
    # #     use xpath response
    # #     """
    # #     # response is xpath
    # #     # scrapy regex outputs all match groups as strings
    # #     for myMatch in response.xpath('//*[@id="tabs-1"]/div[1]/table/tbody/tr/td[1]/p/text()').re(r'(([01]?[0-9]):([0-5][0-9]) ([AaPp][Mm]))'):

        for myMatch in response.xpath('//*[@id="9184"]/div').re(r'<span style="font-size:14px;">(.*?)<\/span>'):
        # for myMatch in response.xpath('//*[@id="9184"]/div/div[1]/div[1]/div[1]/span/span/text()').get():
            myMatch1 = remove_html_tags(myMatch)
            print(myMatch1)

        # for m2 in m1:
        #     m3 = remove_html_tags(m2)
        #     print("match is ",m3)




