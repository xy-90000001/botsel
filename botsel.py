from seleniumwire import webdriver
from selenium import webdriver as cdriver
from selenium.webdriver.chrome.service import Service
# from webdriver_manager.chrome import ChromeDriverManager
# from chromedriver_py import binary_path
from threading import Thread
# import chromedriver_binary

proxy_oxy = "http://Xy90000001:Xy90000001@unblock.oxylabs.io:60000"
# proxy_oxy2 = "unblock.oxylabs.io:60000:Xy90000001:Xy90000001"
url_adsite = "https://a000.ex16.repl.co/"
# url_ident = 'https://ident.me/'

chromeOptions = webdriver.ChromeOptions()
chromeOptions.add_argument('--no-sandbox')
chromeOptions.add_argument('--disable-setuid-sandbox')
chromeOptions.add_argument('--disable-dev-shm-usage')#overcome limited resource problems
chromeOptions.add_argument("--headless")
# chromeOptions.add_argument("--remote-debugging-port=9222")  # this
# path_chrome = "chrome/opt/google/chrome/google-chrome"
# path_chrome = './google-chrome'
# path_chrome = './portablechrome/ChromePortableGCPM/chromeGCPM.desktop'
path_chrome = './cdriver/chrome-linux/chrome'
# path_chrome = '/workspaces/botsel/google-chrome'
# path_chrome = 'cb/google-chrome'
chromeOptions.binary_location = path_chrome

def wiredriver(PROXY=None):
  seleniumwire_options = {
    'proxy': {
      'http': PROXY,
      'verify_ssl': False,
    },
    'start-maximized': True,
    'headless': True,}
  
  # serv = Service(ChromeDriverManager().install())
  # serv = Service(binary_path)
  # serv = Service(path_chrome)
  # driver = webdriver.Chrome(service=serv, options=chromeOptions,seleniumwire_options=seleniumwire_options)
  # driver = webdriver.Chrome(service=serv, options=chromeOptions)
  driver = webdriver.Chrome(options=chromeOptions)
  # driver = cdriver.Chrome(service=serv, options=chromeOptions)
  return driver

def mainloop():
  print('loop')
  # driver = wiredriver(proxy_oxy)
  driver = wiredriver()
  # driver = cdriver.Chrome(options=chromeOptions)
  print('init')
  driver.get(url_adsite)
  print('got url')
  # driver.get(url_ident)
  for i in range(5):
    print(i,'views! ')
  # while True:
    driver.refresh()

mainloop()
# cmd = ['apt-get install docker']
# import subprocess as s
# s.call('docker ps', shell=True)
# s.call('apt install chromium-browser', shell=True)
import keepalive
keepalive.keep_alive()
# mainloop()

# def botsel_thread():
#   # t = threading.Thread(target=, args = (q,u))
#   t = Thread(target=mainloop)
#   t.start()
#   #time.sleep(1)