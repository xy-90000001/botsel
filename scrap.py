import asyncio
from pyppeteer import launch
import pyppeteer

async def main():
    # pyppeteer.chromium_downloader.download_chromium()
    # help(pyppeteer.chromium_downloader.download_chromium)
    # browser = await launch()
    browser = await launch(executablePath='./chrome-linux/chrome')
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