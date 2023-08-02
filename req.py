print('#################################reqqqqqqqqqqqqqqqq################################')
import requests as req
from time import sleep

url_adsite = 'https://a000.ex16.repl.co/'
url_click = 'https://click.a-ads.com/2199641/2/'
url_ipm = 'https://ad.a-ads.com/2199641'

# proxies= {adf}
# r.get(url_adsite, proxies=proxies)
for i in range(20):
  print(i)
  req.get(url_ipm)
  sleep(1)
  req.get(url_click)
  
# from requests_html import HTMLSession
# session = HTMLSession()
# for i in range(3):
#   print(i)
#   r = session.get(url_adsite)
#   r.html.render()

import keepalive
keepalive.keep_alive()
