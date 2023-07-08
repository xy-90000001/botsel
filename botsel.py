from seleniumwire import webdriver
from selenium import webdriver as cdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
# from chromedriver_py import binary_path
from threading import Thread

proxy_oxy = "http://Xy90000001:Xy90000001@unblock.oxylabs.io:60000"
# proxy_oxy2 = "unblock.oxylabs.io:60000:Xy90000001:Xy90000001"
url_adsite = "https://a000.ex16.repl.co/"
# url_ident = 'https://ident.me/'

chromeOptions = webdriver.ChromeOptions()
chromeOptions.add_argument('--no-sandbox')
chromeOptions.add_argument('--disable-setuid-sandbox')
# chromeOptions.add_argument('--disable-dev-shm-usage')
chromeOptions.add_argument("--headless")
# chromeOptions.add_argument("--remote-debugging-port=9222")  # this

def wiredriver(PROXY=None):
  seleniumwire_options = {
    'proxy': {
      'http': PROXY,
      'verify_ssl': False,
    },
    'start-maximized': True,
    'headless': True,
  }
  
  serv = Service(ChromeDriverManager().install())
  # serv = Service(binary_path)
  # serv = Service('chromium-browser')
  driver = webdriver.Chrome(service=serv, options=chromeOptions,seleniumwire_options=seleniumwire_options)
#   driver = webdriver.Chrome(service=serv)
  # driver = cdriver.Chrome(service=serv, options=chromeOptions)
  return driver

def mainloop():
  driver = wiredriver(proxy_oxy)
  # driver = wiredriver()
  # driver = cdriver.Chrome(options=chromeOptions)
  driver.get(url_adsite)
  # for i in range(10):
  while True:
    driver.refresh()


import keepalive
keepalive.keep_alive()
mainloop()

# def botsel_thread():
#   # t = threading.Thread(target=, args = (q,u))
#   t = Thread(target=mainloop)
#   t.start()
#   #time.sleep(1)



