from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

#db = SessionLocal()でここでselect,insert,delete,updateができる
MASTER_DATABASE_URL = "sqlite:///./master_develop.db" #sqliteのdbでexpenses.dbというファイルを作る

master_engine = create_engine(MASTER_DATABASE_URL,echo=False) #engineはsqliteとpythonの中継役
MasterSessionLocal = sessionmaker(bind=master_engine) #DB操作するためのインスタンスを作成
MasterBase = declarative_base() #sqlAlchemyにこれがdbと知らせるためのもの

