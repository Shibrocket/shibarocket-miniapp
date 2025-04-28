import { useEffect, useState } from "react";
import axios from "axios";

const ApplyBoost = () => {
  const [boostStatus, setBoostStatus] = useState<string>("Loading...");

  useEffect(() => {
    const fetchBoostStatus = async () => {
      try {
        const response = await axios.get("/api/applyBoost");
        
        if (response.data && typeof response.data.message === "string") {
          setBoostStatus(response.data.message); // Safely set the message
        } else {
          setBoostStatus("Boost status not available");
        }
      } catch (error) {
        console.error("Error fetching boost status", error);
        setBoostStatus("Failed to load boost status");
      }
    };

    fetchBoostStatus();
  }, []);

  return (
    <div>
      <h1>Apply Boost</h1>
      <p>{boostStatus}</p>
    </div>
  );
};

export default ApplyBoost;
