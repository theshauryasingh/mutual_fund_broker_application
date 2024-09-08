import axios from 'axios';

const API_URL = "http://localhost:8000/mutual-funds"
const API_URL2 = "http://localhost:8000/mfapi-mutual-funds-details"
const API_URL3 = "http://localhost:8000/purchase"

export const getFunds = async (source = 'API_1') => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  let apiType = 'rapidapi';
  if (source === 'API_2') {
    apiType = 'mfapi';
  } else if (source === 'API_1') {
    apiType = 'rapidapi'
  } else {
    throw new Error('Invalid source specified');
  }

  try {
    const headers = { Authorization: `Bearer ${token}` } ;
    console.log(' .. getFunds .. n ');
    const response = await axios.get(API_URL, {
    params: { api: apiType },
    headers });
    console.log(' .. getFunds .. r ', response);
    return response.data; // Return the data from the response
  }
  catch (error) {
    console.log(' .. getFunds .. e ', error);
    throw error;  // Throw error if request fails
  }
};

export const getMfapiDetails = async(Scheme) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const headers = { Authorization: `Bearer ${token}` } ;
    const response = await axios.get(API_URL2, {
    params: { scheme: Scheme },
    headers });
    console.log(' ..  getMfapiDetails .. ', response.data );
    return response.data;
  }
  catch (error) {
    throw error;
  }
}

export const purchase = async (purchase) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  console.log(' ... ', purchase);
  try {
    const headers = { Authorization: `Bearer ${token}` } ;
    const response = await axios.post(API_URL3, purchase,{ headers });
    console.log(purchase, '... ', response.data)
    return response.data;
  }
  catch (error) {
    throw error;
  }
}
