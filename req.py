print('#################################reqqqqqqqqqqqqqqqq################################')
import requests as req
from time import sleep

url_adsite = 'https://a000.ex16.repl.co/'
url_click = 'https://click.a-ads.com/2199641/2/'
url_ipm = 'https://ad.a-ads.com/2199641'


proxies = {'http': "http://exash:Xy90000001@unblock.oxylabs.io:60000",'https': "http://exash:Xy90000001@unblock.oxylabs.io:60000",}
# curl 'http://quotes.toscrape.com/js/' -U 'exash:Xy90000001' -x 'unblock.oxylabs.io:60000' -H 'x-oxylabs-geo-location: United States' -H 'x-oxylabs-render: html' -k -v 
proxy_oxy = "http://exash:Xy90000001@unblock.oxylabs.io:60000"

# r.get(url_adsite, proxies=proxies)

session = req.Session()
session.proxies = proxies

def mainloop():
  for i in range(20):
    print(i)
    # req.get(url_ipm)
    session.get(url_ipm, verify=False)
    # sleep(1)
    session.get(url_click, verify=False)
  
# from requests_html import HTMLSession
# session = HTMLSession()
# for i in range(3):
#   print(i)
#   r = session.get(url_adsite)
#   r.html.render()
try:
  mainloop()
except:
  print('err')
    


import keepalive
keepalive.keep_alive()
