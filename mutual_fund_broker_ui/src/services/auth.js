import axios from 'axios';

export const login = async(username, password )=> {
  console.log("login method called ", username, password);
  try {
    const response = await axios.post('http://localhost:8000/login', 
      new URLSearchParams({
        username,
        password
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    );
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      console.log('returning True .. ')
      return true;
    }
    console.log('returning False .. ')
    return false;
  }
  catch(error){
    console.error('failed to login: ', error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
