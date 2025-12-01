import { useEffect, useMemo, useRef, useState } from 'react';

type Author = 'user' | 'bot';

type Message = {
  id: string;
  author: Author;
  text: string;
  timestamp: string;
};

const cannedReplies = [
  'That sounds interesting! How else can I help?',
  'I am on it — give me another question.',
  'Great! Let us keep the ideas flowing.',
  'Nice thought. Want to iterate a bit more?',
  'Understood. I will remember that for later.'
];

const typingDelayMs = 800;

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: crypto.randomUUID(),
      author: 'bot',
      text: 'Hi there! Ready to build something today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const lastUserMessage = useMemo(
    () => messages.filter((msg) => msg.author === 'user').at(-1)?.text ?? '',
    [messages]
  );

  useEffect(() => {
    if (!isTyping) return;

    const reply = cannedReplies[lastUserMessage.length % cannedReplies.length];

    const timeout = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          author: 'bot',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, typingDelayMs);

    return () => clearTimeout(timeout);
  }, [isTyping, lastUserMessage]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const outbound: Message = {
      id: crypto.randomUUID(),
      author: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, outbound]);
    setInput('');
    setIsTyping(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const togglePopup = () => setIsOpen((state) => !state);

  return (
    <>
      <button className="chat-toggle" aria-label="Toggle chat" onClick={togglePopup}>
        <span className="chat-toggle__icon">💬</span>
        <span className="chat-toggle__dot" />
      </button>

      <section className={`chat-popup ${isOpen ? 'chat-popup--open' : ''}`} aria-live="polite">
        <header className="chat-popup__header">
          <div>
            <p className="chat-popup__title">Product Coach</p>
            <p className="chat-popup__subtitle">Typically replies in seconds</p>
          </div>
          <button className="chat-popup__close" onClick={togglePopup} aria-label="Close chat">
            ×
          </button>
        </header>

        <div className="chat-popup__body" ref={scrollRef}>
          {messages.map((message) => (
            <article
              key={message.id}
              className={`chat-message chat-message--${message.author}`}
              aria-label={`${message.author} message`}
            >
              <p>{message.text}</p>
              <span>{message.timestamp}</span>
            </article>
          ))}
          {isTyping && (
            <article className="chat-message chat-message--bot chat-message--typing">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </article>
          )}
        </div>

        <div className="chat-popup__input">
          <input
            type="text"
            placeholder="Write a message..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSend} aria-label="Send message">
            Send
          </button>
        </div>
      </section>
    </>
  );
};

export default ChatPopup;

