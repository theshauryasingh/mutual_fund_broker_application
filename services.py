import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

RAPIDAPI_URL = os.getenv("RAPIDAPI_URL")
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

def fetch_mutual_fund_data():
    headers = {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'latest-mutual-fund-nav.p.rapidapi.com'
    }
    response = requests.get(RAPIDAPI_URL, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception("Error fetching data from RapidAPI")
