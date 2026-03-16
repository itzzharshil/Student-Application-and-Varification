import { useState, useRef, useEffect } from 'react';
import { Send, Link as LinkIcon, User, Bot } from 'lucide-react';
import type { Message } from '../types';
import { WelcomeScreen } from './WelcomeScreen';
import ReactMarkdown from 'react-markdown';

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (content: string) => void;
}

export function ChatArea({ messages, isTyping, onSendMessage }: ChatAreaProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <main className="main-chat">
      <header className="chat-header">
        <div className="chat-header-title">
          <h2 className="chat-title">Admissions & Visa Consultant</h2>
          <div className="chat-subtitle">
            <span className="status-indicator"></span>
            System Online
          </div>
        </div>
      </header>

      {messages.length === 0 ? (
        <WelcomeScreen onSuggest={(text) => onSendMessage(text)} />
      ) : (
        <div className="message-list scroll-container">
          {messages.map((message) => (
            <div key={message.id} className={`message-wrapper ${message.role} animate-slide-up`}>
              <div className={`avatar ${message.role}`}>
                {message.role === 'ai' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: '0.25rem', marginRight: '0.25rem' }}>
                  {message.role === 'ai' ? 'GlobalAdmit Engine' : 'Applicant'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="message-bubble">
                  {message.role === 'ai' ? (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  ) : (
                    message.content
                  )}
                  
                  {message.references && message.references.length > 0 && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>VALIDATED SOURCES</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {message.references.map((ref, idx) => (
                          <a 
                            key={idx} 
                            href={ref.url || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="reference-badge"
                            style={{ textDecoration: 'none' }}
                          >
                            <LinkIcon size={12} />
                            {ref.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message-wrapper ai animate-fade-in">
              <div className="avatar ai">
                <Bot size={20} />
              </div>
              <div className="message-bubble">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-wrapper">
          <textarea
            className="chat-input scroll-container"
            placeholder={messages.length === 0 ? "Ask about visa deadlines, admission requirements, or complex protocols..." : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className="send-btn" 
            disabled={!input.trim() || isTyping}
            style={{ marginBottom: '8px' }}
          >
            <Send size={18} />
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
          Powered by GlobalAdmit Protocol. 100% Guaranteed Accuracy in Admission & Visa Processes based on official government documentation.
        </div>
      </div>
    </main>
  );
}
