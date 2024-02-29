import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
const ChatBot = ({ onClose }) => {

  return (
    <div className="chat-bot-container bg-gray-200   rounded-2xl fixed bottom-48 right-8">
      <div className="chat-header flex" style={{
        height: '100px',
        maxHeight: '100px',
        minHeight: '100px',
        width: "350px",
        backgroundColor: '#0a5f54',
        color: 'white',
        borderRadius: '6px 6px 0px 0px',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
      }}>
        <div className="header-left  flex items-center">
          <FaWhatsapp className="whatsapp-icon w-8 h-6" />
          <div className="ml-2">
            <h1 className='font-bold text-2xl'>Edlernity</h1>
            <p className='text-nowrap'>Typically replies within 2 mins</p>
          </div>
        </div>
        <button className="close-button" onClick={onClose}>
          &#10006;
        </button>
      </div>
      <div className="chat-messages mt-12 px-6    ">
        <div className="bot-message text-sm bg-white p-2 rounded-2xl w-48 text-black">
          <h2 className='text-gray-800 text-lg'>Edlernity</h2>
          <h4>Hi there! </h4>
          <p >How can I help you?</p>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center text-center mt-12 '>
        <NavLink to="https://api.whatsapp.com/send?phone=8073306479">
          <button className="start-chat-button flex p-2 px-12 bg-[#4dc247] mb-12 rounded-3xl" onClick={onClose}>
            <FaWhatsapp className="whatsapp-icon w-8 h-6 mr-2" />
            Start Chat
          </button>
        </NavLink>
      </div>


    </div>
  );
};

export default ChatBot;
