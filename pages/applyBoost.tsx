import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the BoostResponse type
interface BoostResponse {
  success: boolean;
  message: string;
}

const ApplyBoost = () => {
  const [boostStatus, setBoostStatus] = useState<string>('');

  const applyBoost = async () => {
    try {
      // Make the API call to the applyBoost endpoint
      const response = await axios.get('/api/applyBoost'); // Replace with your API endpoint
      
      // Cast the response data to BoostResponse type
      const data: BoostResponse = response.data;
      
      // Use the 'message' property from the response
      setBoostStatus(data.message); // Now this is valid
    } catch (error) {
      console.error('Error fetching boost status', error);
    }
  };

  return (
    <div>
      <button onClick={applyBoost}>Apply Boost</button>
      <div>{boostStatus}</div>
    </div>
  );
};

export default ApplyBoost;
