from pydantic import BaseModel
class ExpenceCreate(BaseModel):
    paidAt : str
    place : str
    amount : int
    itemId : int
    paymentMethodId : int
    userId : int
    note : str
    isDeleted : int = 0

class LoginData(BaseModel):
    userId : int
    password : str

