import React, {useState, useEffect} from 'react';
import { isAuthenticated } from '../services/auth';
import { getFunds } from '../services/mutualFundService';
import { useNavigate } from 'react-router-dom';
// import FundDetails from './FundDetails';

function Dashboard(){
  const [funds, setFunds] = useState([]);
  const [error, setError] = useState('');
  const [apiSource, setApiSource] = useState('API_2');
  const [loading, setLoading] = useState(true);
  // const [selectedFund, setSelectedFund] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }
    
    const fetchFunds = async () => {
      try {
        setLoading(true);
        const data = await getFunds(apiSource);
        if (Array.isArray(data)) {
          setFunds(data);
          setError('');
        } else {
          throw new Error('Unexpected data format .. ', typeof data);
        }
      } catch (error) {
        console.error('Error fetching mutual funds:', error);
        setError('Failed to fetch mutual funds. Please try again.');
        // navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchFunds();
  }, [apiSource]);
  
  /*
  const handleApiSourceChange = (event) => {
    setApiSource(event.target.value);  // Update API source when user changes selection
  };*/

  const handleFundSelect = (fund) => {
    navigate(`/fund-details/${fund.schemeCode}`, { state: { fund } });
  };

  return (
    <div className="dashboard-container">
      <div className="top-section">
        <select
          className="api-source-dropdown"
          value={apiSource}
          onChange={(e) => setApiSource(e.target.value)}
        >
          <option value="API_1">rapidapi</option>
          <option value="API_2">mfapi</option>
        </select>
      </div>
      {/*<div className="error-message">
        {error && <p> .. {error}</p>}
      </div>*/}
      <div className="funds-list">
            <h1>Dashboard</h1>

            {loading ? (
              <p>Data is being loaded...</p>
            ) : error ? (
              <p>{error}</p>
            ) : funds.length > 0 ? (
              <ul>
                {funds.map((fund, index) => (
                  <li key={index} onClick={() => handleFundSelect(fund)} style={{ cursor: 'pointer' }}>
                    {fund.schemeName}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No funds available</p>
            )}
      </div>
    </div>
  );
}

export default Dashboard;
