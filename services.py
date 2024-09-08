import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

RAPIDAPI_URL = os.getenv("RAPIDAPI_URL")
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
MFAPI_URL = os.getenv("MFAPI_URL")

def fetch_mutual_fund_data(url):
    try:
        print('..  fetch_mutual_fund_data service method called .. ', url )
        headers = {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': 'latest-mutual-fund-nav.p.rapidapi.com'
        }
        if url=="rapidapi":
            response = requests.get(RAPIDAPI_URL, headers=headers)
        else:
            response = requests.get(MFAPI_URL)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception("Error fetching data from RapidAPI")
    except Exception as e:
        return {"error": str(e)}

def fetch_mutual_fund_details_data(scheme):
    try:
        response = requests.get(f'{MFAPI_URL}/{scheme}/latest')
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception("Error fetching mututal fund details from mfapi")
    except Exception as e:
        return {"error": str(e)}
