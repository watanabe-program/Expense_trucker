from sqlalchemy import Column, Integer,String
from expenses_db import ExpensesBase
from master_db import MasterBase
from datetime import datetime
today = datetime.now().strftime('%Y%m%d')

#支出テーブル
class Expense(ExpensesBase):
    __tablename__ = "expenses" #テーブル名

    #各カラム
    expense_id = Column(Integer,primary_key=True)#primary_keyをtrueにするだけで自動採番になる
    paid_at = Column(String)
    place = Column(String)
    amount = Column(Integer)
    item_id = Column(Integer)
    payment_method_id = Column(Integer)
    user_id = Column(Integer)
    note = Column(String)
    created_at = Column(String,default=today)
    updated_at = Column(String,default=today)
    is_deleted = Column(Integer,default=0)

#ユーザーマスタ
class Users(MasterBase):
    __tablename__ = "users" #テーブル名
    #各カラム
    user_id = Column(Integer,primary_key=True)
    user_name = Column(String)
    password = Column(String)
    
#支出種類マスタ
class Items(MasterBase):
    __tablename__ = "items" #テーブル名

    #各カラム
    item_id = Column(Integer,primary_key=True)#primary_keyをtrueにするだけで自動採番になる
    item_name = Column(String)

#支払方法マスタ
class PaymentMethods(MasterBase):
    __tablename__ = "payment_methods" #テーブル名

    #各カラム
    payment_method_id = Column(Integer,primary_key=True)#primary_keyをtrueにするだけで自動採番になる
    payment_method_name = Column(String)