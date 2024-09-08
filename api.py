from fastapi import FastAPI, Depends, HTTPException, status, Query
from pydantic import BaseModel
from auth import create_access_token, verify_token
from services import fetch_mutual_fund_data, fetch_mutual_fund_details_data
from dotenv import load_dotenv
import os
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

# Allow CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

DUMMY_USER_USERNAME = os.getenv("DUMMY_USERNAME")
DUMMY_USER_PASSWORD = os.getenv("DUMMY_PASSWORD")

class PurchaseRequest(BaseModel):
    scheme_code: float
    amount: str

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
async def get_mutual_funds(api: str = Query(..., enum=["rapidapi", "mfapi"]), user = Depends(verify_token)):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    if api is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="API type must be specified")
    mutual_funds = fetch_mutual_fund_data(api)
    return mutual_funds
    # raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid API type")

@app.get("/mfapi-mutual-funds-details")
async def get_mutual_fund_details(scheme: str = Query(..., ), user = Depends(verify_token)):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    if scheme is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="mf scheme must be specified")
    mutual_funds_details = fetch_mutual_fund_details_data(scheme)
    return mutual_funds_details

@app.post("/purchase")
async def purchase_fund(purchase: PurchaseRequest, user = Depends(verify_token)):
    print('... request received ...')
    if not user:
        print('.. error ..')
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    print('.. evevrything cleared ..')
    return {"message": f"Purchased with amount {purchase.amount} successfully"}
