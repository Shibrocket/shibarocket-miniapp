import { useState, useEffect } from "react";
import axios from "axios";

export default function ApplyBoostPage() {
  const [boostStatus, setBoostStatus] = useState<string>("");

  useEffect(() => {
    // Sample API request to fetch Boost status
    axios
      .get("/api/applyBoost") // Replace with your API endpoint
      .then((response) => {
        setBoostStatus(response.data.message); // Set the response message
      })
      .catch((error) => {
        console.error("Error fetching boost status", error);
      });
  }, []);

  return (
    <div>
      <h1>Boost Status</h1>
      <p>{boostStatus || "Loading..."}</p>
    </div>
  );
}
