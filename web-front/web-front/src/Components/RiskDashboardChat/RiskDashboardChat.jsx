import React, { useState, useEffect } from "react";
import './RiskDashboardChat.css';

const RiskDashboardChat = ({ patient }) => {
  const [userMessage, setUserMessage] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    if (!patient || !patient.uid) {
      console.warn("Patient is undefined or missing UID:", patient);
      setMemories([]);
      return;
    }

    console.log("Fetching memories for patient UID:", patient.uid);

    fetch(`http://localhost:8000/memories/${patient.uid}`)
      .then((response) => response.json())
      .then((data) => setMemories(data.memories || []))
      .catch((error) => console.error("Error fetching memories:", error));
  }, [patient]);

  const sendMessage = async () => {

    if (!userMessage.trim()) return;
    if (!patient?.uid) {
        console.warn("Cannot send message: Patient UID is missing:");
      alert("Cannot send message: Patient UID is missing!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patient.uid,
          doctor_message: userMessage,
        }),
      });

      const data = await response.json();
      setAssistantResponse(data.assistant_response || "");
      setUserMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="chat-section">
      <h3>AI Assistant</h3>

      <div className="chat-memories">
        {memories.length > 0 ? (
          <>
            <strong>Patient Memories:</strong>
            <ul>
              {memories.map((m, index) => (
                <li key={m.id || index}>{m.memory}</li> 
              ))}
            </ul>
          </>
        ) : (
          <p>No memories stored yet.</p>
        )}
      </div>

      <div className="chat-box">
        {assistantResponse && (
          <p>
            <strong>Assistant:</strong> {assistantResponse}
          </p>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Ask about the patient..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default RiskDashboardChat;
