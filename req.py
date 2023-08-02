print('#################################reqqqqqqqqqqqqqqqq################################')
import requests as req

url_adsite = 'https://a000.ex16.repl.co/'
url_ad = 'https://click.a-ads.com/2199641/2/'

# proxies= {adf}
# r.get(url_adsite, proxies=proxies)
for i in range(5):
  print(i, 'a')
  req.get(url_adsite)
  
for i in range(9):
  print(i)
  req.get(url_adsite)


# from requests_html import HTMLSession
# session = HTMLSession()
# for i in range(3):
#   print(i)
#   r = session.get(url_adsite)
#   r.html.render()
