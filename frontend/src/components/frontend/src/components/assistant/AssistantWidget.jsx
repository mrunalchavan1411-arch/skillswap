
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AssistantWidget.css';

const API_URL = import.meta.env.VITE_API_URL;

const suggestions = [
  'How do I find other students?',
  'How do skill matches work?',
  'How do I update my profile?',
];

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function sendMessage(text = message) {
    const question = text.trim();
    if (!question || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Assistant is temporarily unavailable.');
      }

      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: data.reply },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Sorry, I could not connect right now. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleNavigation() {
    const lastReply = [...messages].reverse().find(m => m.role === 'assistant');
    const match = lastReply?.text.match(/\/(dashboard|explore|matches|chat|schedule|profile|login|signup)\b/i);
    if (match) {
      navigate(`/${match[1].toLowerCase()}`);
      setOpen(false);
    }
  }

  return (
    <>
      <button
        className="assistant-launcher"
        onClick={() => setOpen(value => !value)}
        aria-label="Open SkillSwap AI Help"
      >
        {open ? '×' : '✦'} {!open && 'AI Help'}
      </button>

      {open && (
        <section className="assistant-panel" aria-label="SkillSwap AI assistant">
          <header className="assistant-header">
            <div>
              <strong>SkillSwap AI Help</strong>
              <div className="assistant-subtitle">Ask me how to use SkillSwap</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant">×</button>
          </header>

          <div className="assistant-messages" aria-live="polite">
            {messages.length === 0 && (
              <div className="assistant-welcome">
                Hi! 👋 I can help you explore SkillSwap.
                <div className="assistant-suggestions">
                  {suggestions.map(item => (
                    <button key={item} onClick={() => sendMessage(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((item, index) => (
              <div key={index} className={`assistant-message ${item.role}`}>
                {item.text}
                {item.role === 'assistant' && (
                  <button className="assistant-nav" onClick={handleNavigation}>
                    Open suggested page
                  </button>
                )}
              </div>
            ))}

            {loading && <div className="assistant-message assistant">Thinking…</div>}
          </div>

          <form
            className="assistant-form"
            onSubmit={event => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              value={message}
              onChange={event => setMessage(event.target.value)}
              placeholder="Ask a question..."
              maxLength={1000}
              aria-label="Message the assistant"
            />
            <button type="submit" disabled={loading || !message.trim()}>
              Send
            </button>
          </form>
        </section>
      )}
    </>
  );
}
