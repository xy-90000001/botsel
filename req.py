print('#################################reqqqqqqqqqqqqqqqq################################1')
import requests as req
from time import sleep
from requests.auth import HTTPProxyAuth

url_adsite = 'https://a000.ex16.repl.co/'
url_aclick = 'https://click.a-ads.com/2199641/2/'
url_aipm = 'https://ad.a-ads.com/2199641?size=728x90'
url_2bt = 'http://traffic2bitcoin.com/ptp2.php?ref=Exash'
url_adsterra = 'https://www.highcpmrevenuegate.com/dahcgmdy89?key=cbcfa1e9a4c631faf6ed1b29519abfce'
url_coinserom = 'https://ads.coinserom.com/publisher?adsunit=437'
url_adshare = 'https://app.adaround.net/supply/register?iid=LSPCjcKqClgpTzcWw67CsXs8w649'
url_taco = "https://cysgx.alpheratzscheat.top/?pl=3t7M8ZcKoUSC3A0Q1--mxg"
#url_ping = "https://botreq.onrender.com/"
url_ping = "https://req-fcsh.onrender.com/"
# <div class="_fa7cdd4c68507744" data-placement="4803df9cffe6498ea6fff5948dd09854" style="width:320px;height:100px;display: inline-block;margin: 0 auto"></div>
# <script type="text/javascript" src="https://app.adaround.net/main.js" async></script>

user = "groups-SHADER+BUYPROXIES94952"
user = "groups-RESIDENTIAL"
user= "groups-auto"
password= "apify_proxy_kLL2nn1MA5Wd468LmDvPExVB8Np06o0fryYf"
password2= "apify_proxy_q2rPe7qovWxkU71fLmJKwHp0NL6wZi0S20IS"
#proxy_apy = f'http://<{user}>:<apify_proxy_kLL2nn1MA5Wd468LmDvPExVB8Np06o0fryYf>@proxy.apify.com:8000'
proxy_apy = f'http://<{user}>:<{password2}>@proxy.apify.com:8000'
proxies = {'http': proxy_apy, 'https':proxy_apy,}
# proxies = {'http': "http://Xy90000001req2:Xy90000001req2@unblock.oxylabs.io:60000",'https': "http://Xy90000001req2:Xy90000001req2@unblock.oxylabs.io:60000",}
# curl 'http://quotes.toscrape.com/js/' -U 'exash:Xy90000001' -x 'unblock.oxylabs.io:60000' -H 'x-oxylabs-geo-location: United States' -H 'x-oxylabs-render: html' -k -v 
proxy_oxy = "http://Cache0000:Cache000@unblock.oxylabs.io:60000"
proxies = {'http': proxy_oxy, 'https':proxy_oxy,}
# auth = HTTPProxyAuth(user, password2)

session = req.Session()
session.proxies = proxies
# session.auth = auth

def mainloop():
  # for i in range(5000):
  c = 0
  #
  run=0
  while True:
    c+=1
    run+=1
    if c==10:
      req.get(url_ping)
      sleep(3)
      c = 0
    # print(i)
    session.get(url_aipm, verify=False)
    # req.get(url_aipm)
    # sleep(1)
    # session.get(url_click, verify=False)
    session.get(url_2bt, verify=False)
    # req.get(url_2bt)
    session.get(url_adsterra, verify=False)
    # req.get(url_adsterra)
    # session.get(url_taco, verify=False)
    # req.get(url_taco)
    # session.get(url_adshare, verify=False)
 # except:
    #print("errloop")
    

mainloop()

import keepalive
keepalive.keep_alive()




