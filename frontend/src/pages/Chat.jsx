// pages/Chat.jsx
// Real-time chat page - Socket.io se messages bhejna aur receive karna

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Send,
  MessageCircle,
  Paperclip,
  Smile
} from 'lucide-react';
import Layout from '../components/Layout';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import {
  getChatHistory,
  getConversations,
  uploadChatFile
} from '../services/api';

import socket from '../services/socket';
import EmojiPicker from "emoji-picker-react";

export default function Chat() {
  const { user } = useAuth();
  const location = useLocation();
   const fileInputRef = useRef(null); 
  

  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(
    location.state ? { id: location.state.partnerId, name: location.state.partnerName } : null
  );
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Conversation list load karna
  useEffect(() => {
    async function loadConvos() {
      try {
        const res = await getConversations();
        setConversations(res.data.conversations);
      } catch (err) {
        console.error('Conversations load error:', err);
      }
    }
    loadConvos();
  }, []);

  // Active partner change hone par history load karna
  useEffect(() => {
    if (!activePartner) return;
    async function loadHistory() {
      try {
        const res = await getChatHistory(activePartner.id);
        setMessages(res.data.messages);
      } catch (err) {
        console.error('Chat history load error:', err);
      }
    }
    loadHistory();
  }, [activePartner]);

  // Socket listeners - naya message aane par
  useEffect(() => {
    const handleReceive = (msg) => {
      if (activePartner && (msg.senderId === activePartner.id || msg.receiverId === activePartner.id)) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    const handleSent = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    const handleTyping = (data) => {
  if (data.senderId === activePartner?.id) {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  }
};

    socket.on('receive_message', handleReceive);
    socket.on('message_sent', handleSent);
    socket.on("typing", handleTyping);

    return () => {
      socket.off('receive_message', handleReceive);
      socket.off('message_sent', handleSent);
      socket.off("typing", handleTyping);
    };
  }, [activePartner]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
  e.preventDefault();

  if (!activePartner) return;

  let uploadedFile = null;

  try {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await uploadChatFile(formData);

      uploadedFile = res.data.file;
    }

    socket.on("typing", (data) => {
  const receiverSocketId = onlineUsers.get(data.receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("typing", data);
  }
});

    socket.emit("send_message", {
      senderId: user.id,
      senderName: user.name,
      receiverId: activePartner.id,
      message: input.trim(),
      attachment: uploadedFile,
    });

    setInput("");
    setSelectedFile(null);

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
  }
};



  // Sidebar list me agar activePartner already conversation list me nahi hai, to use bhi dikhao
  const allConvos = activePartner && !conversations.find(c => c.partnerId === activePartner.id)
    ? [{ partnerId: activePartner.id, partnerName: activePartner.name, lastMessage: 'Start the conversation' }, ...conversations]
    : conversations;

  return (
    <Layout>
      <header className="mb-6">
        <p className="text-xs font-mono text-flip-muted mb-1">MESSAGES</p>
        <h1 className="font-display text-3xl font-semibold text-flip">Chat</h1>
      </header>

      <div className="glass-card rounded-card flex h-[68vh] overflow-hidden">
        {/* Conversation list */}
        <div className="w-64 border-r border-line dark:border-dline overflow-y-auto">
          {allConvos.length === 0 ? (
            <p className="text-sm text-flip-muted p-5">No conversations yet. Message someone from your matches.</p>
          ) : (
            allConvos.map((c) => (
              <button
                 key={c.partnerId}
  onClick={() => setActivePartner({ id: c.partnerId, name: c.partnerName })}
  className={`w-full text-left px-4 py-4 transition-all duration-300 flex items-center gap-3 border-b border-white/5 hover:bg-cyan-500/10 ${
    activePartner?.id === c.partnerId
      ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-l-4 border-cyan-400'
      : ''
  }`}
              >
                <div className="relative">

  <Avatar user={{ name: c.partnerName }} size="sm" />

  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>

</div>
                <div className="min-w-0">
                 <div className="flex items-center justify-between">

  <p className="font-semibold text-flip truncate">
    {c.partnerName}
  </p>

  <span className="text-[10px] text-flip-muted">
    Now
  </span>

</div>

<p className="text-xs text-flip-muted truncate mt-1">
  {c.lastMessage}
</p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col">
          {!activePartner ? (
            <div className="flex-1 flex items-center justify-center flex-col text-flip-muted">
              <MessageCircle size={32} className="mb-2" />
              <p className="text-sm">Select a conversation to start chatting.</p>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-line dark:border-dline bg-white/40 dark:bg-white/5 flex items-center justify-between">

  <div className="flex items-center gap-3">

    <Avatar user={{ name: activePartner.name }} size="sm" />

    <div>

      <h2 className="font-semibold text-flip">
        {activePartner.name}
      </h2>

      {isTyping ? (
  <p className="text-xs text-cyan-400 animate-pulse">
    Typing...
  </p>
) : (
  <p className="text-xs text-green-500">
    ● Online
  </p>
)}

    </div>

  </div>

  <div className="text-xs text-flip-muted">
    Skill Exchange Chat
  </div>

</div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {messages.length === 0 && (
                  <p className="text-xs text-flip-muted text-center mt-6">No messages yet. Say hi 👋</p>
                )}
                {messages.map((m) => (
                  <div
  className={`max-w-[75%] px-5 py-3 rounded-3xl shadow-lg transition-all duration-300 ${
    m.senderId === user.id
      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-br-md'
      : 'bg-white/70 dark:bg-white/10 backdrop-blur-md text-flip border border-white/10 rounded-bl-md'
  }`}
>

  <>
  {m.message && (
    <p className="text-sm leading-6 break-words mb-2">
      {m.message}
    </p>
  )}

  {m.attachment && (
    <div className="mt-2">
      {m.attachment.type?.startsWith("image/") ? (
        <img
          src={`http://localhost:5000${m.attachment.url}`}
          alt={m.attachment.name}
          className="rounded-xl max-w-[220px] cursor-pointer"
        />
      ) : (
        <a
          href={`http://localhost:5000${m.attachment.url}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20"
        >
          📄 {m.attachment.name}
        </a>
      )}
    </div>
  )}
</>

</div>
                ))}
                <div ref={bottomRef} />
              </div>

{selectedFile && (
  <div className="px-5 py-3 border-t border-white/10 bg-white/5 flex items-center justify-between">

    <div>
      <p className="text-sm font-medium text-cyan-300">
        📎 {selectedFile.name}
      </p>

      <p className="text-xs text-flip-muted">
        {(selectedFile.size / 1024).toFixed(1)} KB
      </p>
    </div>

    <button
      type="button"
      onClick={() => setSelectedFile(null)}
      className="text-red-400 hover:text-red-300 text-xl"
    >
      ✕
    </button>

  </div>
)}


              <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-line dark:border-dline">
               <button
  type="button"
  onClick={() => fileInputRef.current?.click()}
  className="w-11 h-11 rounded-full flex items-center justify-center text-flip-muted hover:bg-white/10 transition-all"
>
  <Paperclip size={18} />
</button>

<input
  ref={fileInputRef}
  type="file"
  className="hidden"
  accept="image/*,.pdf,.doc,.docx"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }}
/>
{selectedFile && selectedFile.type.startsWith("image/") && (
  <div className="px-5 pb-3">
    <img
      src={URL.createObjectURL(selectedFile)}
      alt="preview"
      className="w-40 h-40 rounded-2xl object-cover border border-white/10"
    />
  </div>
)}

<input
  type="text"
  value={input}
  onChange={(e) => {
  setInput(e.target.value);

  socket.emit("typing", {
    senderId: user.id,
    receiverId: activePartner.id,
    senderName: user.name,
  });
}}
  placeholder="Write a message..."
  className="flex-1 px-5 py-3 rounded-full bg-white/70 dark:bg-white/10 border border-white/10 text-flip placeholder:text-flip-muted focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
/>

<button
  type="button"
  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
  className="w-11 h-11 rounded-full flex items-center justify-center text-flip-muted hover:bg-white/10 transition-all"
>
  <Smile size={18} />
</button>
{showEmojiPicker && (
  <EmojiPicker
    onEmojiClick={(emojiData) => {
      setInput((prev) => prev + emojiData.emoji);
    }}
  />
)}
<button
  type="submit"
  className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-300"
  aria-label="Send message"
>
  <Send size={18} />
</button>              </form>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
