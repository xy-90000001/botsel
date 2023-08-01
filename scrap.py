import asyncio
from pyppeteer import launch
import pyppeteer
import subprocess as s

# import pyppeteer_stealth as p

s.call('mkdir /tmp/.cache', shell=True)
s.call("ENV XDG_CACHE_HOME='/tmp/.cache'",shell=True)
s.call("ENV PYPPETEER_HOME='/tmp/'", shell=True)

# async def main():
#     # pyppeteer.chromium_downloader.download_chromium()
#     # help(pyppeteer.chromium_downloader.download_chromium)
#     browser = await launch(headless=True)
#     # browser = await launch(headless=True, executablePath = r'./chrome-linux/chrome', userDataDir = './')
#     # browser = await launch(executablePath='./chrome-linux/chrome', disable-gpu=True, no-sandbox=True, single-process=True, disable-web-security=True, disable-dev-profile=True, headless=True )
#     # browser = await launch(executablePath = './chrome-linux/chrome', headless = True)
#     # browser = await launch({'headless': True,'args': ['--no-sandbox', '--disabled-setuid-sandbox', '--disable-dev-profile', 
#     #              '--executablePath' = './chrome-linux/chrome',
#     #              '--user-data-dir=/tmp']})
#     page = await browser.newPage()
#     url = 'http://ident.me'
#     await page.goto(url)
#     await page.screenshot({'path': 'example.png'})
#     await browser.close()

# asyncio.get_event_loop().run_until_complete(main())



from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    for browser_type in [p.chromium, p.firefox, p.webkit]:
        try:
            browser = browser_type.launch()
            page = browser.new_page()
            page.goto('http://playwright.dev')
            page.screenshot(path=f'example-{browser_type.name}.png')
            browser.close()
except Exception as e:
            print(browser_type, ' : ...tryfail...', e)
            
            

