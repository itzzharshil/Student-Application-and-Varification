
import { MessageSquare, Settings, HelpCircle, GraduationCap, ShieldCheck, Bot, Headphones } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onOpenVerifier: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({ sessions, activeSessionId, onSelectSession, onNewSession, onOpenVerifier, onOpenSettings }: SidebarProps) {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-icon">
          <GraduationCap size={24} />
        </div>
        <div className="logo-text">GlobalAdmit AI</div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
        <button 
          className="nav-item glass-panel" 
          style={{ justifyContent: 'center', background: 'var(--accent-gradient)', color: 'white', border: 'none' }}
          onClick={onNewSession}
        >
          <Bot size={18} />
          <span style={{ fontSize: '0.85rem' }}>Chat with AI Chatbot</span>
        </button>
        <button 
          className="nav-item glass-panel" 
          style={{ justifyContent: 'center', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}
          onClick={() => {
            onNewSession();
            toast.success('Routing to the next available Human Agent...', { duration: 4000 });
          }}
        >
          <Headphones size={18} />
          <span style={{ fontSize: '0.85rem' }}>Talk to Human Agent</span>
        </button>
      </div>

      <style>
        {`
          @keyframes border-pulse {
            0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
            100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
          }
          .scanner-btn {
            animation: border-pulse 2.5s infinite;
            border: 1px solid rgba(99, 102, 241, 0.3) !important;
            transition: all 0.3s ease !important;
          }
          .scanner-btn:hover {
            transform: translateY(-2px);
            background: rgba(99, 102, 241, 0.2) !important;
          }
        `}
      </style>
      <button 
        className="nav-item glass-panel scanner-btn" 
        style={{ marginTop: '0.5rem', justifyContent: 'center', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-base)' }}
        onClick={onOpenVerifier}
      >
        <ShieldCheck size={18} />
        <span style={{ fontWeight: 600 }}>Document Scanner</span>
      </button>

      <div className="nav-section" style={{ marginTop: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          Recent Consultations
        </p>
        
        <div className="scroll-container" style={{ flexGrow: 1, maxHeight: 'calc(100vh - 300px)', paddingRight: '4px' }}>
          {sessions.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>No recent sessions.</p>
          ) : (
            sessions.map(session => (
              <button 
                key={session.id}
                className={`nav-item ${session.id === activeSessionId ? 'active' : ''}`}
                onClick={() => onSelectSession(session.id)}
                style={{ width: '100%', textAlign: 'left', marginBottom: '4px' }}
              >
                <MessageSquare size={18} style={{ flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.875rem' }}>
                  {session.title}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <div style={{ padding: '1rem 0', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button className="nav-item" style={{ width: '100%' }} onClick={onOpenSettings}>
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <button className="nav-item" style={{ width: '100%' }}>
          <HelpCircle size={18} />
          <span>Help & Compliance</span>
        </button>
      </div>
    </aside>
  );
}
