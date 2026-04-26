from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal
from models import Expense
from schemas import ExpenceCreate
from database import engine,Base

app = FastAPI()

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
        expenses = db.query(Expense).all()
        return [
            {
                "id": e.expense_id,
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
        return {'message' : 'ok','id' : new_exp.expense_id}
    finally:
        db.close()