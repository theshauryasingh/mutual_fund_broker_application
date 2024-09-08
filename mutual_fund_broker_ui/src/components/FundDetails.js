import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMfapiDetails, purchase } from '../services/mutualFundService';

function FundDetails() {
  // const { schemeCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const fund = location.state?.fund;

  const [extraDetails, setExtraDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseMessage, setPurchaseMessage] = useState('');

  const schemeCode = fund?.schemeCode;

  useEffect(() => {
    const fetchExtraDetails = async () => {
      if (!schemeCode) {
        setError('No scheme code provided.');
        setLoading(false);
        return;
      }
      
      try {
        const data = await getMfapiDetails(schemeCode);
        // const response = await axios.get(`/fund-details/${schemeCode}`);
        setExtraDetails(data);  // Assuming the API returns extra fund details
        setError('');
        console.log(' .. ', data);
      } catch (err) {
        console.error('Error fetching extra fund details:', err);
        setError('Failed to load additional fund details.');
      } finally {
        setLoading(false);
      }
    };
    
    if (schemeCode) {
      fetchExtraDetails();
    }
  }, [schemeCode]);

  const handlePurchase = async () => {
    try {
      const response = await purchase({'scheme_code': schemeCode, 'amount': extraDetails.data[0]?.nav})
      setPurchaseMessage(response.message);
    } catch (err) {
      console.error('Error purchasing mutual fund:', err);
      setPurchaseMessage('Failed to purchase the mutual fund.');
    }
  }

  if (!fund) {
    return <p>No fund data available.</p>;
  }

  if (loading) {
    return <p>Loading fund details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back to Dashboard</button>
      <h2>{fund?.schemeName}</h2>
      <p>Scheme Code: {schemeCode}</p>

      {extraDetails && (
        <div>
          <h3>Additional Information</h3>

          {/* Access meta information */}
          <p><strong>Fund House:</strong> {extraDetails.meta?.fund_house}</p>
          <p><strong>Scheme Type:</strong> {extraDetails.meta?.scheme_type}</p>
          <p><strong>Scheme Category:</strong> {extraDetails.meta?.scheme_category}</p>

          {/* Access data array (handling case if multiple entries) */}
          {extraDetails.data && extraDetails.data.length > 0 && (
            <div>
              <h4>Fund Data</h4>
              <p><strong>Date:</strong> {extraDetails.data[0]?.date}</p>
              <p><strong>NAV:</strong> {extraDetails.data[0]?.nav}</p>
            </div>
          )}

          {/* Status */}
          <p><strong>Status:</strong> {extraDetails.status}</p>
        </div>
      )}
      <button onClick={handlePurchase}>Purchase</button>
      {purchaseMessage && <p>{purchaseMessage}</p>}
    </div>
  );
}

export default FundDetails;
