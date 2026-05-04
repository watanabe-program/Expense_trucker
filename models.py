from sqlalchemy import Column, Integer,String
from database import Base
from datetime import datetime
today = datetime.now().strftime('%Y%m%d')

class Expense(Base):
    __tablename__ = "expenses" #テーブル名

    #各カラム
    expense_id = Column(Integer,primary_key=True)#primary_keyをtrueにするだけで自動採番になる
    paid_at = Column(String)
    place = Column(String)
    amount = Column(Integer)
    item_id = Column(Integer)
    payment_method_id = Column(Integer)
    user_id = Column(String)
    created_at = Column(String,default=today)
    updated_at = Column(String,default=today)
    is_deleted = Column(Integer,default=0)