from pydantic import BaseModel
class ExpenceCreate(BaseModel):
    paidAt : str
    place : str
    amount : int
    itemId : int
    paymentMethodId : int
    userId : int
    isDeleted : int = 0

