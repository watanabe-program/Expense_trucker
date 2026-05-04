from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal
from models import Expense
from schemas import ExpenceCreate
from database import engine,Base
from datetime import datetime

app = FastAPI()
today = datetime.now().strftime('%Y$m%d')

#世界中のどこからでもAPIを叩けるようにする設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

#一覧を表示(Select)
@app.get("/expenses")
def get_expenses():
    db = SessionLocal()
    try:
        expenses = db.query(Expense).filter(Expense.is_deleted == 0).all()
        return [
            {
                "id": e.expense_id,
                "paidAt" : e.paid_at,
                "itemId" : e.item_id,
                "amount" :e.amount,
                "paymentMethodId" :e.payment_method_id,
                "place" :e.place,
                "isDeleted" :e.is_deleted,
            }
            for e in expenses
        ]
    finally:
        db.close()

#登録(Insert)
@app.post("/expenses")
def create_expenses(expense:ExpenceCreate):
    db = SessionLocal()
    try:
        new_exp = Expense(
            paid_at=expense.paidAt,
            item_id=expense.itemId,
            amount=expense.amount,
            payment_method_id=expense.paymentMethodId,
            place = expense.place,
            user_id = expense.userId
        )

        db.add(new_exp)
        db.commit()
        return {'message' : 'ok','id' : new_exp.expense_id}
    finally:
        db.close()

#支出編集
@app.patch("/expenses/{expense_id}")
def update_expenses(expense_id:int ,expense:ExpenceCreate):
    db = SessionLocal()
    try:
        db_expense = db.query(Expense).filter(Expense.expense_id == expense_id).first()

        if not db_expense:
            return {"error": "not found"}
        
        db_expense.paid_at=expense.paidAt
        db_expense.item_id=expense.itemId
        db_expense.amount=expense.amount
        db_expense.payment_method_id=expense.paymentMethodId
        db_expense.place = expense.place
        db_expense.updated_at = today
        db.commit()
        return {'message' : 'updated'}
    finally:
        db.close()

#支出削除
@app.patch("/expenses/delete/{expense_id}")
def delete_expenses(expense_id:int ):
    db = SessionLocal()
    try:
        db_expense = db.query(Expense).filter(Expense.expense_id == expense_id).first()

        if not db_expense:
            return {"error": "not found"}
        
        db_expense.is_deleted = 1
        db.commit()
        return {'message' : 'updated'}
    finally:
        db.close()