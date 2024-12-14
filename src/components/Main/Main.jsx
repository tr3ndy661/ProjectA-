import React, { useContext, useRef, useState, useEffect } from "react";
import { Context } from "../../context/Context";
import "./Main.css";
import { assets } from "../../assets/assets";
import CustomCursor from "../CustomCursor/CustomCursor";

const thinkingMessages = [
  "AI is thinking hard...",
  "Processing your request...",
  "Analyzing information...",
  "Generating response...",
  "Contemplating the universe...",
  "Connecting the dots...",
  "Computing possibilities...",
  "Gathering insights..."
];

const Main = () => {
  const {
    input,
    setInput,
    loading,
    resultData,
    showResult,
    onSent,
    handleFileUpload,
    uploadedFile,
    stopGenerating,
    recentPrompt,
    currentSessionId,
  } = useContext(Context);

  // Create a ref for the file input
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // State to manage drag over
  const [isDragOver, setIsDragOver] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    // Check for browser support
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      console.error("Speech recognition is not supported in this browser");
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    // Configure recognition
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    // Set up event handlers
    recognitionRef.current.onstart = () => {
      console.log("Speech recognition started");
      setIsListening(true);
    };

    recognitionRef.current.onend = () => {
      console.log("Speech recognition ended");
      setIsListening(false);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      setInput(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Toggle listening
  const toggleListening = () => {
    try {
      if (isListening) {
        recognitionRef.current?.stop();
      } else {
        recognitionRef.current?.start();
      }
    } catch (error) {
      console.error("Error toggling speech recognition:", error);
    }
  };

  // Function to trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Drag and Drop Event Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInputRef.current.files = files;
      handleFileUpload({ target: fileInputRef.current });
    }
  };

  // Remove file function
  const removeFile = () => {
    fileInputRef.current.value = "";
    setUploadedFile(null);
  };

  // handling cards input

  const handleCardClick = (promptText) => {
    setInput(""); // Clear the input first
    setTimeout(() => {
      setInput(promptText);
      // Add animation class
      const inputElement = document.querySelector(".search-box input");
      inputElement.classList.add("animate-text");
      // Remove animation class after animation ends
      setTimeout(() => {
        inputElement.classList.remove("animate-text");
      }, 300);
    }, 50);
  };

  const ResultContent = ({ text, isNewResponse = false }) => {
    const [displayText, setDisplayText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const createMarkup = (htmlContent) => {
      return { __html: htmlContent };
    };

    useEffect(() => {
      if (text) {
        if (isNewResponse) {
          setIsTyping(true);
          let index = 0;
          setDisplayText("");

          const typeNextCharacter = () => {
            if (index < text.length) {
              setDisplayText((current) => {
                // Add character with random delay for more natural typing
                const nextChar = text.charAt(index);
                return current + nextChar;
              });
              index++;

              // Variable typing speed based on punctuation and content
              let delay = 30; // base delay
              const currentChar = text.charAt(index);
              
              // Slower after punctuation
              if (['.', '!', '?', '\n'].includes(text.charAt(index - 1))) {
                delay = 500;
              } 
              // Faster for spaces and common characters
              else if ([' ', 'e', 't', 'a', 'o', 'i'].includes(currentChar)) {
                delay = 20;
              }
              // Random variation for natural feel
              delay += Math.random() * 30;

              setTimeout(typeNextCharacter, delay);
            } else {
              setIsTyping(false);
            }
          };

          typeNextCharacter();
        } else {
          // Instantly show text for non-new responses
          setDisplayText(text);
          setIsTyping(false);
        }
      }
    }, [text, isNewResponse]);

    return (
      <div className="result-content">
        <p
          className={`typing-text ${isTyping ? "typing" : ""}`}
          dangerouslySetInnerHTML={createMarkup(displayText)}
        />
      </div>
    );
  };

  // Add this state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Add this state for managing the file
  const [localFile, setLocalFile] = useState(null);

  // Handle file removal
  const handleFileRemove = () => {
    setLocalFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  // Handle file upload
  const handleLocalFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLocalFile(file);
      handleFileUpload(event); // Call the context's handleFileUpload
    }
  };

  const [thinkingMessage, setThinkingMessage] = useState("");

  useEffect(() => {
    let messageInterval;
    if (loading) {
      // Set initial message
      setThinkingMessage(thinkingMessages[0]);
      
      // Change message every 3 seconds
      let index = 1;
      messageInterval = setInterval(() => {
        setThinkingMessage(thinkingMessages[index]);
        index = (index + 1) % thinkingMessages.length;
      }, 3000);
    }

    return () => {
      if (messageInterval) {
        clearInterval(messageInterval);
      }
    };
  }, [loading]);

  return (
    <>
      <CustomCursor />
      <div
        className={`main ${isSidebarOpen ? "sidebar-open" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleLocalFileUpload}
          accept=".jpg,.jpeg,.png,.gif,.pdf,.txt,.csv,.xlsx"
        />

        <div className="nav">
          <img src={assets.gemini_icon} alt="" />
          <p id="Makhs-AI">Makhs-A\</p>
          <img src={assets.user_icon} alt="" />
        </div>
        <div className="main-container">
          {/* Drag and Drop Overlay */}
          {isDragOver && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "24px",
              }}
            >
              Drop files here
            </div>
          )}

          {!showResult && (
            <>
              <div className="greet">
                <p>
                  <span>Hola Mamacita.</span>{" "}
                </p>
                <p>How can I assist you today?</p>
              </div>
              <div className="cards">
                <div
                  className="card"
                  onClick={() =>
                    handleCardClick("Suggest a new restaurant for me to try.")
                  }
                >
                  <p>Suggest a new restaurant for me to try.</p>
                  <img src={assets.compass_icon} alt="" />
                </div>
                <div
                  className="card"
                  onClick={() =>
                    handleCardClick("Brain storm ideas for a dinner party menu.")
                  }
                >
                  <p>Brain storm ideas for a dinner party menu.</p>
                  <img src={assets.bulb_icon} alt="" />
                </div>
                <div
                  className="card"
                  onClick={() =>
                    handleCardClick("Reccomend me a movie to watch.")
                  }
                >
                  <p>Reccomend me a movie to watch.</p>
                  <img src={assets.message_icon} alt="" />
                </div>
                <div
                  className="card"
                  onClick={() =>
                    handleCardClick(
                      "Help me optimize my code to improve readability."
                    )
                  }
                >
                  <p>Help me optimize my code to improve readability.</p>
                  <img src={assets.code_icon} alt="" />
                </div>
              </div>
            </>
          )}

          {showResult && (
            <div className="result">
              <div className="result-title">
                <img src={assets.user_icon} alt="" />
                <p>{recentPrompt}</p>
              </div>
              <div className="result-data">
                <img src={assets.gemini_icon} alt="" />
                {loading ? (
                  <div className="loading">
                    <div className="typing-indicator">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                    <span className="thinking-message">{thinkingMessage}</span>
                  </div>
                ) : (
                  <ResultContent text={resultData} isNewResponse={loading} />
                )}
              </div>
            </div>
          )}

          <div className="main-bottom">
            {/* File Preview Section */}
            {localFile && (
              <div className="file-preview">
                <span>{localFile.name}</span>
                <button
                  className="remove-file"
                  onClick={handleFileRemove}
                  aria-label="Remove file"
                >
                  ×
                </button>
              </div>
            )}

            <div className="search-box">
              <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type="text"
                placeholder="Enter your query here..."
                className={isListening ? "listening-input" : ""}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onSent(input);
                  }
                }}
              />
              <div className="input-buttons">
                {localFile && (
                  <div className="file-preview">
                    <span>{localFile.name}</span>
                    <button
                      className="remove-file"
                      onClick={handleFileRemove}
                      aria-label="Remove file"
                    >
                      ×
                    </button>
                  </div>
                )}
                <img
                  src={assets.gallery_icon}
                  alt="Upload"
                  onClick={triggerFileInput}
                  style={{ cursor: "pointer" }}
                />
                <div className="mic-container" onClick={toggleListening}>
                  <img
                    src={assets.mic_icon}
                    alt="Voice Input"
                    className={isListening ? "listening" : ""}
                  />
                  {isListening && (
                    <div className="listening-animation">
                      <div className="wave"></div>
                      <div className="wave"></div>
                      <div className="wave"></div>
                    </div>
                  )}
                </div>
                {loading ? (
                  <button 
                    className="stop-button" 
                    onClick={stopGenerating}
                  >
                    Stop
                  </button>
                ) : (
                  input && (
                    <img
                      onClick={() => input.trim() && onSent(input)}
                      src={assets.send_icon}
                      alt="Send"
                      style={{ cursor: "pointer" }}
                    />
                  )
                )}
              </div>
            </div>
            <p className="bottom-info">
              The AI may display inaccurate info including about people so
              double-check its responses
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
