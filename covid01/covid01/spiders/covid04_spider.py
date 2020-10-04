"""
from covid04_spider.py
parses local copy of VCH convid 19 exposures
public exposures
outputs to json file
"""
import scrapy
import logging
import re

def remove_html_tags(text):
    """Remove html tags from a string"""
    import re
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)
    
# class QuotesSpider(scrapy.Spider):
class covid(scrapy.Spider):
    name = "covid04"
    start_urls = [
            'http://localhost/public_exposures.html',
            # 'http://www.vch.ca/covid-19/public-exposures',
     ]
    custom_settings = {
        'LOG_LEVEL': logging.WARNING,
        # Used for pipeline 1
        'ITEM_PIPELINES': {'__main__.JsonWriterPipeline': 1},
        'FEED_FORMAT': 'json',                                 # Used for pipeline 2
        'FEED_URI': 'schoolsresult.json'                        # Used for pipeline 2
    }

    def parse(self, response):
        """
        use xpath response
        """
        # scrapy regex outputs all match groups as strings
        for myMatch in response.xpath('//*[@id="9184"]/div').re(r'<span style="font-size:14px;">(.*?)<\/span>'):
        # for myMatch in response.xpath('//*[@id="809"]/div/div//span/text()').getall():
        # for myMatch in response.css('div.table-responsive > table > tbody > tr > td:nth-child(1) > p::text').re(r'(([01]?[0-9]):([0-5][0-9]) ([AaPp][Mm]))'):
            myMatch1 = remove_html_tags(myMatch)
            print(myMatch1)
                ######
            yield {
                    '': myMatch,
            }
