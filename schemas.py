from pydantic import BaseModel
class ExpenceCreate(BaseModel):
    date : str
    itemId : int
    amount : int
    paymentMethodId : int
    place : str