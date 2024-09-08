import React, {useState} from 'react';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';

function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isLoggedIn = await login(username, password);
    
    if (isLoggedIn) {
      console.log(' Login component ... success ', isLoggedIn)
      navigate('/dashboard');
    } else {
      console.log(' Login component ... error ' , isLoggedIn);
      setError('Invalid login credentials');  // Show error if login failed
    }
  };
  
  // console.log(" control reached Login component ");
  return (
    <div>
      <h1>Login Page</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )}

export default Login ; 
