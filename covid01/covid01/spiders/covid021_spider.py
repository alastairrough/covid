"""
parses local copy of VCH convid 19 exposures
school exposures
outputs list of lists to tabulate
"""
import scrapy
# import re
from tabulate import tabulate

outputList = []


def remove_html_tags(text):
    """Remove html tags from a string"""
    import re
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

class QuotesSpider(scrapy.Spider):
    name = "covid021"
    start_urls = [
        'http://localhost/schools_exposures.html',
        # 'http://www.vch.ca/covid-19/school-exposures',
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

        # response.xpath('//*[@id="809"]/div').get()
        # <span[^>]*>[\s\S]+<\/span>
        for myMatch in response.xpath('//*[@id="809"]/div/div//span/text()').getall():
        # for myMatch in response.xpath('//*[@id="809"]/div').re(r'<span[^>]*>(.*?)<\/span>'):
        # for myMatch in response.xpath('//*[@id="809"]/div').re(r'<span[^>]*>[\s\S]+<\/span>'):
        # for myMatch in response.xpath('//*[@id="809"]/div').re(r'<span style="font-size:14px;">(.*?)<\/span>'):
        # for myMatch in response.xpath('//*[@id="9184"]/div/div[1]/div[1]/div[1]/span/span/text()').get():
            # myMatch1 = remove_html_tags(myMatch)
            # print(myMatch)
            myMatch1 = remove_html_tags(myMatch)
            outputList.append([myMatch1]) 
            # print(myMatch1)
            
        # print(outputList)
        # print(list(outputList))
        # print(tabulate(myMatch1,tablefmt="plain"))
        # print(tabulate(myMatch1,tablefmt="github"))
        print(tabulate(outputList,tablefmt="grid"))
