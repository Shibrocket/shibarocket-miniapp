import { useState } from 'react';
import axios from 'axios';

export default function ApplyBoost() {
    const [boostStatus, setBoostStatus] = useState<string>('');  // Store the boost status message
    const [loading, setLoading] = useState<boolean>(false);  // Track loading state

    const handleBoost = async () => {
        setLoading(true);  // Set loading state to true when the boost is applied

        try {
            // Make an API request to apply the boost
            const response = await axios.get('/api/applyBoost'); // Replace with your API endpoint

            // Define the expected structure of the response
            interface BoostResponse {
                success: boolean;
                message: string;
            }

            // Type assertion to tell TypeScript that response.data has the BoostResponse type
            const data: BoostResponse = response.data;

            // Set the boost status message
            setBoostStatus(data.message);  // Use the 'message' property from the response
        } catch (error: unknown) {
            console.error('Error fetching boost status', error);  // Log any error
            setBoostStatus('An error occurred while fetching the boost status.');  // Set a fallback message
        } finally {
            setLoading(false);  // Set loading state to false after the request is complete
        }
    };

    return (
        <div>
            <button onClick={handleBoost} disabled={loading}>
                {loading ? 'Loading...' : 'Apply Boost'}
            </button>

            {/* Display the boost status message */}
            {boostStatus && <p>{boostStatus}</p>}
        </div>
    );
}
