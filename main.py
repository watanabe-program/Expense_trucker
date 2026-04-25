from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import SessionLocal
from models import Expense

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExpenceCreate(BaseModel):
    date : str
    itemId : int
    amount : int
    paymentMethodId : int
    place : str

#一覧を表示(Select)
@app.get("/expenses")
def get_expenses():
    db = SessionLocal()
    try:
        expenses = db.query(Expense).all()
        return [
            {
                "id": e.expence_id,
                "date" : e.date,
                "itemId" : e.item_id,
                "amount" :e.amount,
                "paymentMethodId" :e.payment_method_id,
                "place" :e.place,
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
            date=expense.date,
            item_id=expense.itemId,
            amount=expense.amount,
            payment_method_id=expense.paymentMethodId,
            place = expense.place
        )

        db.add(new_exp)
        db.commit()
        return {'message' : 'ok','id' : new_exp.expence_id}
    finally:
        db.close()

   