import { X, Moon, Sun, User as UserIcon, LogOut } from 'lucide-react';


interface SettingsModalProps {
  onClose: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function SettingsModal({ onClose, isDarkMode, toggleDarkMode }: SettingsModalProps) {
  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} style={{ zIndex: 60 }}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Application Settings</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>
              Display Preferences
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isDarkMode ? <Moon size={20} className="text-accent" /> : <Sun size={20} className="text-warning" />}
                </div>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Dark Mode</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Adjust the app appearance</div>
                </div>
              </div>
              <button 
                onClick={toggleDarkMode}
                style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: 'var(--radius-full)', 
                  background: isDarkMode ? 'var(--accent-base)' : 'var(--bg-accent)', 
                  color: isDarkMode ? 'white' : 'var(--text-primary)', 
                  fontWeight: 500, 
                  fontSize: '0.875rem', 
                  transition: 'all 0.2s',
                  border: isDarkMode ? 'none' : '1px solid var(--border-light)'
                }}
              >
                {isDarkMode ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>
              Account Management
            </h3>
            
            <div style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <UserIcon size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.125rem', color: 'var(--text-primary)' }}>ITZHARSHIL</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>harshil@example.com</div>
                </div>
              </div>
              
              <button 
                className="nav-item" 
                style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--danger)', color: 'var(--danger)', background: 'rgba(220, 38, 38, 0.05)' }}
                onClick={() => {
                  alert('Account Switcher Logic triggered!');
                }}
              >
                <LogOut size={16} />
                <span>Switch / Change Account</span>
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
