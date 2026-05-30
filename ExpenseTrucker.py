import webview
import threading
import time
import uvicorn
from fastapi.staticfiles import StaticFiles
from main import app
import sys
import os

BASE_DIR = getattr(
    sys,
    '_MEIPASS',
    os.path.dirname(os.path.abspath(__file__))
)
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
INI_PATH = os.path.join(BASE_DIR, "master.ini")

#templatesフォルダを公開
app.mount(
    "/static",
    StaticFiles(directory=TEMPLATES_DIR),
    name="static"
)

#FastAPI起動
def start_api():
    uvicorn.run(app,host = "127.0.0.1",port=8000)

    
    

if __name__ == "__main__":
  
  t = threading.Thread(target=start_api,daemon=True)
  t.start()

  time.sleep(2)

  webview.create_window(
    "Expence Trucker",
    "http://127.0.0.1:8000/static/index.html"
  )

  webview.start() 