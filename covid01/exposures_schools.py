"""
from covid03_spider.py
parses local copy of VCH convid 19 exposures
school exposures
outputs to json file
"""

import json
import scrapy
import logging
import re
from scrapy.crawler import CrawlerProcess


def remove_html_tags(text):
    """Remove html tags from a string"""
    import re
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

class JsonWriterPipeline(object):

    def open_spider(self, spider):
        self.file = open('schoolsresult.jl', 'w')

    def close_spider(self, spider):
        self.file.close()

    def process_item(self, item, spider):
        line = json.dumps(dict(item)) + "\n"
        self.file.write(line)
        return item
    
class covid_schools(scrapy.Spider):
    name = "covid03"
    start_urls = [
        # 'http://localhost/schools_exposures.html',
        'http://www.vch.ca/covid-19/school-exposures',
    ]
    custom_settings = {
        'LOG_LEVEL': logging.DEBUG,
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
        # for myMatch in response.xpath('//*[@id="809"]/div/div//span/text()').getall(): # original page
        for myMatch in response.xpath('//*[@id="6683"]/div/div//span/text()').getall():  # page update Oct 8, 2020
                print(myMatch)
                ######
                yield {
                     'school': myMatch,
                }

process = CrawlerProcess({
    'USER_AGENT': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)'
})

# process.crawl(QuotesSpider)
process.crawl(covid_schools)
process.start()