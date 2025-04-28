import { useState } from "react";
import axios from 'axios';
import { db } from "../utils/firebase"; // or ../lib/firebase based on your structure
import { collection, addDoc } from "firebase/firestore";

export default function AdminPage() {
  const [secretCode, setSecretCode] = useState("Emumena98");
  const [enteredCode, setEnteredCode] = useState("");
  const [taskText, setTaskText] = useState("");
  const [taskType, setTaskType] = useState("twitter"); // twitter / instagram / telegram
  const [message, setMessage] = useState("");

  const handleAddTask = async () => {
    if (enteredCode !== secretCode) {
      setMessage("Access Denied: Invalid Admin Code");
      return;
    }
    try {
      await addDoc(collection(db, "tasks"), {
        type: taskType,
        text: taskText,
        createdAt: new Date(),
      });
      setMessage("Task added successfully!");
      setTaskText("");
    } catch (err) {
      console.error(err);
      setMessage("Error adding task.");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>ShibaRocket Admin Panel</h1>
      <input
        type="password"
        placeholder="Enter Admin Secret Code"
        value={enteredCode}
        onChange={(e) => setEnteredCode(e.target.value)}
        style={{ marginBottom: 20, padding: 10, width: 300 }}
      />
      <br />
      <select value={taskType} onChange={(e) => setTaskType(e.target.value)} style={{ marginBottom: 20, padding: 10 }}>
        <option value="twitter">Twitter Task</option>
        <option value="instagram">Instagram Task</option>
        <option value="telegram">Telegram Task</option>
      </select>
      <br />
      <input
        type="text"
        placeholder="Enter Task Link or Description"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        style={{ marginBottom: 20, padding: 10, width: 500 }}
      />
      <br />
      <button onClick={handleAddTask} style={{ padding: 10 }}>
        Add New Task
      </button>
      <p style={{ marginTop: 20 }}>{message}</p>
    </div>
  );
}
