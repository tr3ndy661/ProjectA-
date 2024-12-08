import React, { useState, useContext } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import Modal from "../Modal/Modal";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const {
    onSent,
    newChat,
    getRecentChats,
    switchToSession
  } = useContext(Context);

  const loadChat = async (sessionId) => {
    switchToSession(sessionId);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className={`sidebar ${extended ? 'extended' : ''}`}>
      <div className="top">
        <img
          onClick={() => setExtended(prev => !prev)}
          src={assets.menu_icon}
          alt="menu"
          className={`menu ${extended ? 'rotate' : ''}`}
        />
        <div onClick={() => newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="" />
          <p className="text">New Chat</p>
        </div>
        <div className="recent">
          <p className="recent-title">Recent Chats</p>
          {getRecentChats().length > 0 ? (
            getRecentChats().map((chat) => (
              <div
                key={chat.id}
                onClick={() => loadChat(chat.id)}
                className="recent-entry"
              >
                <img src={assets.message_icon} alt="" />
                <p className="text">
                  {chat.title.length > 18 
                    ? chat.title.slice(0, 18) + '...' 
                    : chat.title}
                </p>
              </div>
            ))
          ) : (
            <p className="no-recent-chats text">No recent chats</p>
          )}
        </div>
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry" onClick={toggleModal}>
          <img src={assets.question_icon} alt="" />
          <p className="text">Help</p>
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          <p className="text">Activity</p>
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          <p className="text">Settings</p>
        </div>
      </div>
      <Modal isOpen={showModal} onClose={toggleModal} />
    </div>
  );
};

export default Sidebar;