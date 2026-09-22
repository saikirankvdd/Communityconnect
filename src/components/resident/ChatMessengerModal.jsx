import React, { useState, useEffect, useRef } from 'react';

export const ChatMessengerModal = ({ isOpen, onClose, targetUser = null }) => {
  // Default to Priya Verma (Classifieds Seller) if targetUser not provided
  const activeUser = targetUser || {
    name: 'Priya Verma',
    unit: 'Flat C-502',
    role: 'Seller • Kids Bicycle (Red) - ₹2,800',
    avatarBg: 'bg-sky-600',
    avatarText: 'PV',
    initialMessage: "Hi Arjun! Yes, the red kids bicycle is available. It has training wheels and an adjustable helmet included. Would you like to inspect it?"
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'other',
      name: activeUser.name,
      text: activeUser.initialMessage,
      time: '10:45 AM'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (targetUser) {
      setMessages([
        {
          id: Date.now(),
          sender: 'other',
          name: targetUser.name,
          text: targetUser.initialMessage || `Hello Arjun! How can I assist you with ${targetUser.unit}?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [targetUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      name: 'Arjun Kumar',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputVal('');

    // Simulate auto reply from seller/cell
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "Sure Arjun! That works perfectly. I am home at Flat C-502 this evening after 5:30 PM. Feel free to come over and test ride it in the corridor!";
      if (text.toLowerCase().includes('price') || text.toLowerCase().includes('negotiable')) {
        replyText = "I can do ₹2,500 for a fellow neighbor if you can pick it up today!";
      } else if (text.toLowerCase().includes('time') || text.toLowerCase().includes('when') || text.toLowerCase().includes('today')) {
        replyText = "Today evening between 5:30 PM and 8:00 PM is great. You can ring the doorbell at C-502!";
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'other',
          name: activeUser.name,
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#283044]/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-[#eaedff] flex flex-col h-[560px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#eaedff] bg-gradient-to-r from-blue-50/70 to-emerald-50/70">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-10 h-10 rounded-full ${activeUser.avatarBg || 'bg-blue-600'} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                {activeUser.avatarText || 'PV'}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-[#131b2e]">{activeUser.name}</h2>
                <span className="text-xs text-gray-500 font-semibold">({activeUser.unit})</span>
              </div>
              <p className="text-[11px] text-[#006b2c] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{activeUser.role || 'Active Resident'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/60">
          <div className="text-center">
            <span className="px-3 py-1 rounded-full bg-gray-200/70 text-gray-600 text-[10px] font-semibold">
              Today • Direct Resident Messenger
            </span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs shadow-2xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#006b2c] text-white rounded-br-xs'
                    : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 italic px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-200"></span>
              <span className="text-[11px] ml-1">{activeUser.name} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-3 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          {[
            'Can I inspect it today around 5:30 PM?',
            'Is the price negotiable?',
            'Does it have training wheels included?',
            'Where can I pick it up?'
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 whitespace-nowrap cursor-pointer transition text-[11px]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-[#eaedff] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Message ${activeUser.name}...`}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006b2c]"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="w-10 h-10 rounded-xl bg-[#006b2c] hover:bg-[#00873a] disabled:bg-gray-300 text-white flex items-center justify-center transition cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
