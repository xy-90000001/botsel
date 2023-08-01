import asyncio
from pyppeteer import launch
# import pyppeteer
import subprocess as s
import pyppeteer_stealth as p

s.call('mkdir /tmp/.cache', shell=True)
s.call("ENV XDG_CACHE_HOME='/tmp/.cache'",shell=True)
s.call("ENV PYPPETEER_HOME='/tmp/'", shell=True)

async def main():
    # pyppeteer.chromium_downloader.download_chromium()
    # help(pyppeteer.chromium_downloader.download_chromium)
    browser = await launch(headless=True)
    # browser = await launch(headless=True, executablePath = r'./chrome-linux/chrome', userDataDir = './')
    # browser = await launch(executablePath='./chrome-linux/chrome', disable-gpu=True, no-sandbox=True, single-process=True, disable-web-security=True, disable-dev-profile=True, headless=True )
    # browser = await launch(executablePath = './chrome-linux/chrome', headless = True)
    # browser = await launch({'headless': True,'args': ['--no-sandbox', '--disabled-setuid-sandbox', '--disable-dev-profile', 
    #              '--executablePath' = './chrome-linux/chrome',
    #              '--user-data-dir=/tmp']})
    page = await browser.newPage()
    url = 'http://ident.me'
    await page.goto(url)
    await page.screenshot({'path': 'example.png'})
    await browser.close()

asyncio.get_event_loop().run_until_complete(main())



















# from scrapy import Spider, Request
# import asyncio
# from pyppeteer import launch

# class ProxySpider(Spider):
#     name = 'proxy_spider'
#     start_urls = ['http://ident.me']

#     async def start_requests(self):
#         # print(p)
#         # browser = await launch(args=['--proxy-server=http://your-proxy-address:port'])
#         browser = await launch()
#         page = await browser.newPage()
#         await asyncio.sleep(2)  # Wait for any additional setup
#         await page.goto(self.start_urls[0])
#         await asyncio.sleep(2)  # Wait for any AJAX requests to complete
#         cookies = await page.cookies()
#         # input()
#         await browser.close()

#         cookies_dict = {cookie['name']: cookie['value'] for cookie in cookies}
#         yield Request(url=self.start_urls[0], cookies=cookies_dict, callback=self.parse)
        
#         print(p)
#     def parse(self, response):
#            # Continue scraping the website
#         pass

# ProxySpider.start_requests('ppp')
