import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import "./Modal.css";

export default function Modal({ isOpen, onClose }) {
  const [displayText, setDisplayText] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  
  const fullText = `Welcome! Here's what you can do:

1. Start a new chat by clicking the + icon
2. Access your chat recents from the sidebar
3. Use natural language to communicate with the AI
4. Stop generation at any time using the stop button

Recent Updates:

Bug Fixes:
• Improved stop generation button functionality
• Fixed the issue where the chat history was not being displayed
• Improved the overall stability of the application


New Features:
• Enhanced chat interactivity with message history
• New functionality added, now you can talk to type instead of typing 
## this feature may work on some browsers ##
• Complete redesign of the UI for a more intuitive user experience
`;

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      document.body.classList.add('active-modal');
      setDisplayText('');
      let index = 0;
      
      const typeWriter = setInterval(() => {
        if (index < fullText.length) {
          setDisplayText(prev => prev + fullText.charAt(index));
          index++;
        } else {
          clearInterval(typeWriter);
        }
      }, 10);

      return () => clearInterval(typeWriter);
    } else {
      document.body.classList.remove('active-modal');
      setDisplayText('');
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 500);
  };

  // Render modal in portal
  return ReactDOM.createPortal(
    <>
      {isOpen && (
        <div className="modal">
          <div 
            onClick={handleClose} 
            className={`overlay ${isClosing ? 'reverse-fade' : ''}`}
          />
          <div className={`modal-content ${isClosing ? 'reverse-slide' : ''}`}>
            <h2>Help</h2>
            <div className="typing-text">
              <pre>{displayText}</pre>
            </div>
            <button className="close-modal" onClick={handleClose}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}