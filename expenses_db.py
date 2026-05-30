from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

#db = SessionLocal()でここでselect,insert,delete,updateができる
EXPENSES_DATABASE_URL = "sqlite:///./expenses_develop.db" #sqliteのdbでexpenses.dbというファイルを作る

expenses_engine = create_engine(EXPENSES_DATABASE_URL,echo=False) #engineはsqliteとpythonの中継役
ExpensesSessionLocal = sessionmaker(bind=expenses_engine) #DB操作するためのインスタンスを作成
ExpensesBase = declarative_base() #sqlAlchemyにこれがdbと知らせるためのもの

