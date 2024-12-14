import React, { useEffect, useState } from 'react';
import './TypeWriter.css';

const TypeWriter = () => {
  const [text, setText] = useState('');
  const fullText = `Our AI can help you with any task. From content creation to data analysis, we've got you covered. Try it now for free.`;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + fullText[index]);
        setIndex(index + 1);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <div className="typewriter-container">
      {/* Hardware buttons */}
      <div className="volume-buttons">
        <div className="volume-button"></div>
        <div className="volume-button"></div>
      </div>
      <div className="power-button"></div>
      <div className="action-button"></div>

      {/* Phone screen */}
      <div className="phone-screen">
        <div className="dynamic-island"></div>
        
        {/* Chat Interface */}
        <div className="chat-interface">
          <div className="chat-header">
            <div className="chat-title">Makhs-A\</div>
          </div>

          <div className="chat-messages">
            <div className="message user-message">
              How can AI help me with my work?
            </div>
            <div className="message ai-message">
              <div className="typing-text">
                {text}
                <span className="cursor-blink"></span>
              </div>
            </div>
          </div>

          <div className="chat-input">
            <div className="input-field">Type a message...</div>
            <div className="send-button"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeWriter; 