import { useState, useEffect } from "react";
import axios from 'axios';
import { db } from "../lib/firebase";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import Countdown from "react-countdown";

export default function Home() {
  const [energy, setEnergy] = useState(400);
  const [shrockEarned, setShrockEarned] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState<string>("");
  const [tasks, setTasks] = useState<any[]>([]);

  const userId =
    typeof window !== "undefined" &&
    (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id
      ? (window as any).Telegram.WebApp.initDataUnsafe.user.id.toString()
      : "guestUser";

  const presaleDate = new Date("2025-05-20T00:00:00Z");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const tasksData: any[] = [];
        querySnapshot.forEach((doc) => {
          tasksData.push(doc.data());
        });
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleTap = () => {
    if (energy > 0) {
      const newEnergy = energy - 1;
      const newShrockEarned = shrockEarned + 5;

      setEnergy(newEnergy);
      setShrockEarned(newShrockEarned);

      saveUserData(userId, {
        energy: newEnergy,
        shrockEarned: newShrockEarned,
      });
    }
  };

  const handleWatchAd = () => {
    const newEnergy = Math.min(energy + 100, 500);
    setEnergy(newEnergy);

    saveUserData(userId, {
      energy: newEnergy,
      shrockEarned: shrockEarned,
    });
  };

  const handleDailyLogin = () => {
    const today = new Date().toISOString().split("T")[0];
    if (lastLoginDate !== today) {
      setLastLoginDate(today);
      const newShrockEarned = shrockEarned + 50;
      setShrockEarned(newShrockEarned);

      saveUserData(userId, {
        energy: energy,
        shrockEarned: newShrockEarned,
        lastLoginDate: today,
      });

      alert("You received your Daily Login Reward: 50 $SHROCK!");
    } else {
      alert("You already claimed today's reward!");
    }
  };

  const handleClaim = () => {
    alert("Wallet connection coming soon! Claim will be live after presale!");
  };

  const handleSocialTask = (task: any) => {
    window.open(task.url, "_blank");
    const newEnergy = Math.min(energy + task.reward, 500);
    setEnergy(newEnergy);

    saveUserData(userId, {
      energy: newEnergy,
      shrockEarned: shrockEarned,
    });

    alert(`+${task.reward} Energy added for completing "${task.title}"`);
  };

  const saveUserData = async (userId: string, data: any) => {
    try {
      await setDoc(doc(db, "users", userId), data);
      console.log("User data saved successfully!");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  return (
    <div style={{
      textAlign: "center",
      marginTop: "30px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f5f7fa",
      minHeight: "100vh",
      padding: "20px"
    }}>
      <h1 style={{ fontSize: "32px", color: "#ff5733" }}>
        ShibaRocket Mini App
      </h1>

      <div style={{ margin: "20px", fontSize: "20px", color: "#333" }}>
        <strong>Presale Countdown:</strong>
        <Countdown date={presaleDate} />
        <div style={{ fontSize: "16px", color: "#777", marginTop: "5px" }}>
          Get ready for the $SHROCK Presale!
        </div>
      </div>

      <h2 style={{ fontSize: "24px", color: "#2c3e50" }}>
        Energy: {energy}
      </h2>
      <h2 style={{ fontSize: "24px", color: "#2c3e50" }}>
        Earned: {shrockEarned} $SHROCK
      </h2>

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={handleTap}
          style={buttonStyle("#28a745")}
        >
          TAP
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleWatchAd}
          style={buttonStyle("#007bff")}
        >
          Watch Ad for +100 Energy
        </button>

        <button
          onClick={handleDailyLogin}
          style={buttonStyle("#ffc107", "#000")}
        >
          Daily Login Reward
        </button>

        <button
          onClick={handleClaim}
          style={buttonStyle("#6f42c1")}
        >
          Claim $SHROCK
        </button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3 style={{ marginBottom: "10px", color: "#2c3e50" }}>Complete Social Tasks:</h3>
        {tasks.map((task, index) => (
          <button
            key={index}
            onClick={() => handleSocialTask(task)}
            style={buttonStyle("#17a2b8")}
          >
            {task.title} (+{task.reward} Energy)
          </button>
        ))}
      </div>

      {userId !== "guestUser" && (
        <div style={{ marginTop: "40px" }}>
          <a
            href={`/adminDashboard?userId=${userId}`}
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#dc3545",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Admin Dashboard
          </a>
        </div>
      )}
    </div>
  );
}

// Custom button style
const buttonStyle = (backgroundColor: string, color = "#fff") => ({
  fontSize: "18px",
  padding: "10px 20px",
  margin: "10px",
  backgroundColor,
  color,
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
});
