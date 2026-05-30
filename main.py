from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from expenses_db import ExpensesSessionLocal,expenses_engine,ExpensesBase
from master_db import MasterSessionLocal,master_engine,MasterBase
from models import Expense,Items,Users,PaymentMethods
from schemas import ExpenceCreate,LoginData
from datetime import datetime
from log import create_log
import configparser
import os
import sys

app = FastAPI()
today = datetime.now().strftime('%Y$m%d')

#世界中のどこからでもAPIを叩けるようにする設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = getattr(
    sys,
    '_MEIPASS',
    os.path.dirname(os.path.abspath(__file__))
)
INI_PATH = os.path.join(BASE_DIR, "master.ini")

MASTER_DB_FILE = "master.db"

is_new_db = not os.path.exists(MASTER_DB_FILE)

ExpensesBase.metadata.create_all(bind=expenses_engine)
MasterBase.metadata.create_all(bind=master_engine)

config = configparser.ConfigParser()
config.read(INI_PATH,encoding = 'utf-8')


#マスタデータを入れる
def insert_master():
    db = MasterSessionLocal()
    dict_user = dict(config.items('user'))
    i1 = 1
    for key1,value1 in dict_user.items():
        user = Users(user_id = i1, user_name =key1,password= value1)
        db.add(user)
        i1 += 1

    dict_items = dict(config.items('items'))
    i2 = 1
    for key2,value2 in dict_items.items():
        item = Items(item_id = i2, item_name = value2)
        db.add(item)
        i2 += 1

    dict_payment_methods = dict(config.items('paymentmethods'))
    i3 = 1
    for key2,value3 in dict_payment_methods.items():
        payment_method = PaymentMethods(payment_method_id = i3, payment_method_name = value3)
        db.add(payment_method)
        i3 += 1

    db.commit()
    db.close()

if is_new_db:
    insert_master()

logger = create_log()
#ログイン認証
@app.post("/login")
def login(data:LoginData):
    db = MasterSessionLocal()

    user = db.query(Users).filter(
        Users.user_id == data.userId,
        Users.password == data.password,
    ).first()

    if user:
        user_name = user.user_name 
        logger.info(f'{user_name}さんがログインしました')
        return {"result":"ok"}
    
    return {'result':"ng"}

#マスタデータ取得
@app.get("/items")
def get_items():
    db = MasterSessionLocal()
    try:
        items = db.query(Items).all()
        return [
            {
                "itemId":i.item_id,
                "name":i.item_name
            }
            for i in items
        ]
        
    finally:
        db.close()

@app.get("/paymentMethods")
def get_payment_methods():
    db = MasterSessionLocal()
    try:
        payment_methods = db.query(PaymentMethods).all()
        return [
            {
                "paymentMethodId":p.payment_method_id,
                "name":p.payment_method_name
            }
            for p in payment_methods
        ]
    finally:
        db.close()

@app.get("/users")
def get_users():
    db = MasterSessionLocal()
    try:
        users = db.query(Users).all()
        return [
            {
                "userId":u.user_id,
                "userName":u.user_name,
                "password":u.password,
            }
            for u in users
        ]
    finally:
        db.close()

#一覧を表示(Select)
@app.get("/expenses/{user_id}")
def get_expenses(user_id:int):
    db = ExpensesSessionLocal()
    try:
        expenses = db.query(Expense).filter(Expense.user_id == user_id,Expense.is_deleted == 0).all()
        logger.info('支出一覧を表示しました')
        return [
            {
                "id": e.expense_id,
                "paidAt" : e.paid_at,
                "itemId" : e.item_id,
                "amount" :e.amount,
                "paymentMethodId" :e.payment_method_id,
                "place" :e.place,
                "note" :e.note,
                "isDeleted" :e.is_deleted,
            }
            for e in expenses
        ]
    finally:
        db.close()

#登録(Insert)
@app.post("/expenses")
def create_expenses(expense:ExpenceCreate):
    db = ExpensesSessionLocal()
    try:
        new_exp = Expense(
            paid_at=expense.paidAt,
            item_id=expense.itemId,
            amount=expense.amount,
            payment_method_id=expense.paymentMethodId,
            place = expense.place,
            note = expense.note,
            user_id = expense.userId
        )



        db.add(new_exp)
        db.commit()
        logger.info(f'{expense.itemId}を追加しました{expense.paidAt}、{expense.amount}円')
        return {'message' : 'ok','id' : new_exp.expense_id}
    finally:
        db.close()

#支出編集
@app.patch("/expenses/{expense_id}")
def update_expenses(expense_id:int ,expense:ExpenceCreate):
    db = ExpensesSessionLocal()
    try:
        db_expense = db.query(Expense).filter(Expense.expense_id == expense_id).first()

        if not db_expense:
            return {"error": "not found"}
        
        db_expense.paid_at=expense.paidAt
        db_expense.item_id=expense.itemId
        db_expense.amount=expense.amount
        db_expense.payment_method_id=expense.paymentMethodId
        db_expense.place = expense.place
        db_expense.note = expense.note
        db_expense.updated_at = today
        db.commit()
        logger.info(f'{expense.itemId}を編集しました{expense.paidAt}、{expense.amount}円')
        return {'message' : 'updated'}
    finally:
        db.close()

#支出削除
@app.patch("/expenses/delete/{expense_id}")
def delete_expenses(expense_id:int ):
    db = ExpensesSessionLocal()
    try:
        db_expense = db.query(Expense).filter(Expense.expense_id == expense_id).first()

        if not db_expense:
            return {"error": "not found"}
        db_expense.is_deleted = 1
        db.commit()
        logger.info(f'{Expense.expense_id}を削除しました')
        return {'message' : 'updated'}
    finally:
        db.close()