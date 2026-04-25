from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

#db = SessionLocal()でここでselect,insert,delete,updateができる
DATABASE_URL = "sqlite:///./expenses.db" #sqliteのdbでexpenses.dbというファイルを作る

engine = create_engine(DATABASE_URL,echo=True) #engineはsqliteとpythonの中継役
SessionLocal = sessionmaker(bind=engine) #DB操作するためのインスタンスを作成
Base = declarative_base() #sqlAlchemyにこれがdbと知らせるためのもの