from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from expenses_db import ExpensesSessionLocal,expenses_engine,ExpensesBase
from master_db import MasterSessionLocal,master_engine,MasterBase
from models import Expense,Items,Users,PaymentMethods
from schemas import ExpenceCreate,LoginData
from datetime import datetime
from log import create_log

app = FastAPI()
today = datetime.now().strftime('%Y$m%d')

#世界中のどこからでもAPIを叩けるようにする設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ExpensesBase.metadata.create_all(bind=expenses_engine)
MasterBase.metadata.create_all(bind=master_engine)

#マスタデータを入れる
db = MasterSessionLocal()

user1 = Users(user_id = 1, user_name = 'noriko',password= 'test')
user2 = Users(user_id = 2, user_name = 'Tsuyoshi',password= 'test')
if db.query(Users).count() == 0:
    db.add_all([user1,user2])

item1 = Items(item_id = 1, item_name = '食費')
item2 = Items(item_id = 2, item_name = '水道代・光熱費')
item3 = Items(item_id = 3, item_name = 'その他')

if db.query(Items).count() == 0:
    db.add_all([item1,item2,item3])

payment_method1 = PaymentMethods(payment_method_id = 1, payment_method_name = '現金')
payment_method2 = PaymentMethods(payment_method_id = 2, payment_method_name = 'クレジットカード')
payment_method3 = PaymentMethods(payment_method_id = 3, payment_method_name = 'コード決済')
payment_method4 = PaymentMethods(payment_method_id = 4, payment_method_name = 'その他')
if db.query(PaymentMethods).count() == 0:
    db.add_all([payment_method1,payment_method2,payment_method3,payment_method4])

db.commit()
db.close()

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