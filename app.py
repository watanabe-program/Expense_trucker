import webview
import threading
import uvicorn
from fastapi.staticfiles import StaticFiles
from main import app

#templatesフォルダを公開
app.mount("/static",StaticFiles(directory='templates'),name="static")

#FastAPI起動
def start_api():
    uvicorn.run('app:app',host = "127.0.0.1",port=8000)
    

if __name__ == "__main__":
  
  t = threading.Thread(target=start_api,daemon=True)
  t.start()

  webview.create_window(
    "Expence Trucker",
    "http://127.0.0.1:8000/static/index.html"
  )

  webview.start(debug=True) 