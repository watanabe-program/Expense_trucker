import logging
import os
from datetime import datetime,timedelta
from pathlib import Path

def create_log():
  today = datetime.now()    
  #2か月以上前のログテーブルは削除
  kaihai_date = today - timedelta(days=60)
  logs_dir = Path('logs')
  logs_dir.mkdir(exist_ok=True)
  for f in logs_dir.iterdir():
    file_time = datetime.fromtimestamp(f.stat().st_mtime)
    if file_time < kaihai_date:
      f.unlink()

  today_date = today.strftime('%Y%m%d')
  log_name = f'{today_date}_log.txt'
  # ログファイル
  logger = logging.getLogger()
  logger.setLevel(logging.INFO)
  logger.handlers.clear()
  file_handler = logging.FileHandler(
      os.path.join("logs", log_name),
      encoding="utf-8"
  )

  file_handler.setLevel(logging.INFO)
  formatter = logging.Formatter(
      "%(asctime)s [%(levelname)s] %(message)s"
  )
  file_handler.setFormatter(formatter)
  logger.addHandler(file_handler)

  # pywebviewログ抑制
  logging.getLogger("pywebview").setLevel(logging.WARNING)

  return logger