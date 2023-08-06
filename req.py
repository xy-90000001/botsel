print('#################################reqqqqqqqqqqqqqqqq################################')
import requests as req
from time import sleep

url_adsite = 'https://a000.ex16.repl.co/'
url_aclick = 'https://click.a-ads.com/2199641/2/'
url_aipm = 'https://ad.a-ads.com/2199641?size=728x90'
url_2bt = 'http://traffic2bitcoin.com/ptp2.php?ref=Exash'
url_adsterra = 'https://www.highcpmrevenuegate.com/dahcgmdy89?key=cbcfa1e9a4c631faf6ed1b29519abfce'

proxies = {'http': "http://exash:Xy90000001@unblock.oxylabs.io:60000",'https': "http://exash:Xy90000001@unblock.oxylabs.io:60000",}
# curl 'http://quotes.toscrape.com/js/' -U 'exash:Xy90000001' -x 'unblock.oxylabs.io:60000' -H 'x-oxylabs-geo-location: United States' -H 'x-oxylabs-render: html' -k -v 
proxy_oxy = "http://exash:Xy90000001@unblock.oxylabs.io:60000"

# r.get(url_adsite, proxies=proxies)

session = req.Session()
session.proxies = proxies

def mainloop():
  # for i in range(5000):
  c = 0
  while True:
    c+=1
    if c==50:
      req.get(url_ping)
      c = 0
    # print(i)
    session.get(url_aipm, verify=False)
    # sleep(1)
    # session.get(url_click, verify=False)
    session.get(url_2bt, verify=False)
    session.get(url_adsterra, verify=False)

try:
  mainloop()
except:
  print('err')

import keepalive
keepalive.keep_alive()


