import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { DocumentVerifier } from './components/DocumentVerifier';
import { BiometricScanner } from './components/BiometricScanner';
import { SettingsModal } from './components/SettingsModal';
import { Bell } from 'lucide-react';
import type { ChatSession, Message } from './types';
import { generateAIResponse } from './utils/ai';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [missingDocsCount, setMissingDocsCount] = useState(0);

  useEffect(() => {
    const handleDocsUpdated = () => {
      const storedData = localStorage.getItem('docs_missing');
      if (storedData) {
        setMissingDocsCount(JSON.parse(storedData).length);
      } else {
        setMissingDocsCount(0);
      }
    };
    window.addEventListener('docs_updated', handleDocsUpdated);
    return () => window.removeEventListener('docs_updated', handleDocsUpdated);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'New Consultation',
      date: new Date(),
      messages: []
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const handleSendMessage = async (content: string) => {
    let currentSessionId = activeSessionId;
    let currentSessions = [...sessions];

    if (!currentSessionId) {
      const newSession: ChatSession = {
        id: generateId(),
        title: content.substring(0, 30) + '...',
        date: new Date(),
        messages: []
      };
      currentSessions = [newSession, ...currentSessions];
      currentSessionId = newSession.id;
      setActiveSessionId(newSession.id);
    } else if (activeSession?.messages.length === 0) {
      // Update title based on first message
      currentSessions = currentSessions.map(s => 
        s.id === currentSessionId 
          ? { ...s, title: content.substring(0, 30) + '...' } 
          : s
      );
    }

    const newMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    // Add user message
    currentSessions = currentSessions.map(s => 
      s.id === currentSessionId 
        ? { ...s, messages: [...s.messages, newMessage] } 
        : s
    );
    setSessions(currentSessions);
    
    // Trigger AI response
    setIsTyping(true);
    
    try {
      const aiResponse = await generateAIResponse(content);
      
      setSessions(prevSessions => 
        prevSessions.map(s => 
          s.id === currentSessionId 
            ? { ...s, messages: [...s.messages, aiResponse] } 
            : s
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container">
      <Toaster position="top-right" />
      {isBiometricOpen && (
        <BiometricScanner 
          onClose={() => setIsBiometricOpen(false)} 
          onUnlock={() => { setIsBiometricOpen(false); setIsVerifierOpen(true); }} 
        />
      )}
      {isVerifierOpen && <DocumentVerifier onClose={() => setIsVerifierOpen(false)} />}
      
      {/* Persistent Notification Center */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 40, display: 'flex', gap: '1rem' }}>
        <button className="icon-btn glass-panel" style={{ position: 'relative', width: 44, height: 44 }} onClick={() => { if(missingDocsCount>0) setIsVerifierOpen(true); }}>
          <Bell size={20} color="var(--text-secondary)" />
          {missingDocsCount > 0 && (
            <div style={{ position: 'absolute', top: -5, right: -5, background: 'var(--danger)', color: 'white', fontSize: '0.65rem', fontWeight: 800, width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}>
              {missingDocsCount}
            </div>
          )}
        </button>
      </div>
      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => setIsSettingsOpen(false)} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        />
      )}
      <Sidebar 
        sessions={sessions} 
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={handleNewSession}
        onOpenVerifier={() => setIsBiometricOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      {activeSession ? (
        <ChatArea 
          key={activeSession.id}
          messages={activeSession.messages}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <ChatArea 
          messages={[]}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}

export default App;
