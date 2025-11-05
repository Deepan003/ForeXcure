import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css'; // We will create this file

function Chatbot() {
  // State to hold all chat messages
  const [messages, setMessages] = useState([
    {
      text: "I am JoyDeb AI, a medical assistant for ForexCure. How are you feeling today?",
      sender: "ai"
    }
  ]);

  // State for the user's current input
  const [input, setInput] = useState("");
  // State to show a "typing..." indicator
  const [isLoading, setIsLoading] = useState(false);

  // Ref to the message container for auto-scrolling
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (!input.trim()) return; // Don't send empty messages

    const userMessage = { text: input, sender: "user" };

    // Add user's message to the chat
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput(""); // Clear the input box
    setIsLoading(true); // Show the "typing" indicator

    try {
      // Send the user's message AND the previous chat history to the backend
      const response = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: userMessage.text,
          history: messages // Send the entire message history for context
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Add the AI's response to the chat
      setMessages(prevMessages => [
        ...prevMessages,
        { text: data.text, sender: "ai" }
      ]);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      // Show an error message in the chat
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: "ai" }
      ]);
    } finally {
      setIsLoading(false); // Hide the "typing" indicator
    }
  };

  return (
    <div className="page-container">
      <div className="chat-container">
        <div className="chat-header">
          <h2>JoyDeb AI (ForexCure)</h2>
          <span>Symptom Checker</span>
        </div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {/* Show a "typing" bubble while waiting for the AI */}
          {isLoading && (
            <div className="message-bubble ai typing-indicator">
              <span></span><span></span><span></span>
            </div>
          )}
          {/* This empty div is the target for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your symptoms here..."
            autoFocus
          />
          <button type="submit" disabled={isLoading}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;