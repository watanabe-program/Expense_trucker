from sqlalchemy import Column, Integer,String
from database import Base

class Expense(Base):
    __tablename__ = "expenses" #テーブル名

    #各カラム
    expense_id = Column(Integer,primary_key=True)
    date = Column(String)
    item_id = Column(Integer)
    amount = Column(Integer)
    payment_method_id = Column(Integer)
    place = Column(String)
