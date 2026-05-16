from sqlalchemy import Column, Integer,String
from database import Base
from datetime import datetime
today = datetime.now().strftime('%Y%m%d')

#支出テーブル
class Expense(Base):
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
class Users(Base):
    __tablename__ = "users" #テーブル名
    #各カラム
    user_id = Column(Integer,primary_key=True)
    user_name = Column(String)
    password = Column(String)
    
#支出種類マスタ
class Items(Base):
    __tablename__ = "items" #テーブル名

    #各カラム
    item_id = Column(Integer,primary_key=True)#primary_keyをtrueにするだけで自動採番になる
    item_name = Column(String)

#支払方法マスタ
class PaymentMethods(Base):
    __tablename__ = "payment_methods" #テーブル名

    #各カラム
    payment_method_id = Column(Integer,primary_key=True)#primary_keyをtrueにするだけで自動採番になる
    payment_method_name = Column(String)

#履歴テーブル
class Logs(Base):
    __tablename__ = "logs" #テーブル名

    #各カラム
    _log_id = Column(Integer,primary_key=True)#primary_keyをtrueにするだけで自動採番になる
    function_id = Column(String)
    function_name = Column(String)
    error_logs = Column(String)
    user_id = Column(Integer)
    created_at = Column(String,default=today)