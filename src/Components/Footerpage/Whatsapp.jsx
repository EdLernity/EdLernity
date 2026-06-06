import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
const Whatsapp = ({ onOpenChatBot }) => {
  const openWhatsAppChat = () => {
  
    onOpenChatBot(); 
  };

  return (
    <div
      id="whatsapp-chat-widget"
      className="fixed bottom-32 right-8 bg-green-500 text-white px-4 py-2 rounded-full flex items-center cursor-pointer z-[999]"
      onClick={openWhatsAppChat}
    >
      <div className="flex items-center">
        <FaWhatsapp className="h-6 w-8" />
        WhatsApp
      </div>
    </div>
  );
};

export default Whatsapp;
