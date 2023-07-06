from flask import Flask, render_template
from threading import Thread
import subprocess as s
import time, os

app = Flask(__name__)

@app.route('/')
def home():
#   return render_template('index.html', value=str(f))
    return 'botsel'

def run():
#   app.run(host='0.0.0.0')#, port=8080, use_reloader=False, debug=True)
  app.run()

import botsel
botsel.botsel_thread()
run()

# def keep_alive():
#   # t = threading.Thread(target=, args = (q,u))
#   t = Thread(target=run)
#   #file1 = open('cach.txt', 'r')
#   #f = file1.read()
#   t.start()
#   #file1 = open('cach.txt', 'r')
#   # print(file.read())
#   #f = file1.read()
#   #time.sleep(1)
