import webview
import threading
import uvicorn

#FastAPI起動
def start_api():
    uvicorn.run('main : app',host = "127.0.0.1",port=8000,reload=False)

#別スレッド起動
threading.Thread(target=start_api,daemon=True).start()

webview.create_window(
  "Expence Trucker",
  "templates/index.html"
)

webview.start(debug=True) 