from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from auth import create_access_token, verify_token
from services import fetch_mutual_fund_data
from dotenv import load_dotenv
import os
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

load_dotenv()

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

DUMMY_USER_USERNAME = os.getenv("DUMMY_USERNAME")
DUMMY_USER_PASSWORD = os.getenv("DUMMY_PASSWORD")

class PurchaseRequest(BaseModel):
    scheme_code: str
    minimum_purchase_amount: float

class LoginRequest(BaseModel):
    email: str
    password: str

class MutualFundScheme(BaseModel):
    scheme_name: str
    scheme_id: str

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    print('..... req received at login ', DUMMY_USER_USERNAME, DUMMY_USER_PASSWORD)
    if form_data.username != DUMMY_USER_USERNAME or form_data.password != DUMMY_USER_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/mutual-funds")
async def get_mutual_funds(user = Depends(verify_token)):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    mutual_funds = fetch_mutual_fund_data()
    return mutual_funds

@app.post("/purchase")
async def purchase_fund(purchase: PurchaseRequest, user = Depends(verify_token)):
    print('... request received ...')
    if not user:
        print('.. error ..')
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    print('.. evevrything cleared ..')
    return {"message": f"Purchased {purchase.scheme_code} with amount {purchase.minimum_purchase_amount} successfully"}
