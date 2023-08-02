print('#################################reqqqqqqqqqqqqqqqq################################')
# import requests as req

url_adsite = 'https://a000.ex16.repl.co/'
# proxies= {adf}
# r.get(url_adsite, proxies=proxies)

from requests_html import HTMLSession
session = HTMLSession()
for i in range(3):
  print(i)
  r = session.get(url_adsite)
  r.html.render()
