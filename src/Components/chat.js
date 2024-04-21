// Chatbot.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './chat.css'; // Import CSS file for styling

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const messagesRef = useRef(null);
  const prevScrollHeight = useRef(0);

  useEffect(() => {
    messagesRef.current.scrollTop = prevScrollHeight.current;
  }, [messages]);

  const sendMessage = async () => {
    if (inputValue.trim() !== '') {
      try {
        // Send user's message to backend and get bot's response
        const response = await axios.post('http://127.0.0.1:5000/api/chatbot', { message: inputValue });
  
        // Update messages state to append user's input message at the top
        setMessages(prevState => [{ text: inputValue, sender: 'user' }, ...prevState]);
  
        // Update messages state to append bot's response below user's input message
        setMessages(prevState => [{ text: response.data.response, sender: 'bot' }, ...prevState]);
  
        // Clear input value
        setInputValue('');
      } catch (error) {
        console.error('Error sending message to chatbot:', error);
      }
    }
  };
  

  return (
    <div className="chatbot-container">
      <div className="messages" ref={messagesRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          className="input-box"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button className="send-button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
