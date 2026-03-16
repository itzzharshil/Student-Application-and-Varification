import { ShieldCheck, Calendar, Plane, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { loadDocuments } from '../utils/storage';

interface WelcomeScreenProps {
  onSuggest: (text: string) => void;
}

export function WelcomeScreen({ onSuggest }: WelcomeScreenProps) {
  const suggestions = [
    {
      title: 'Visa Deadlines',
      desc: 'Check strict US F-1 visa application timelines for Fall 2026',
      icon: <Calendar size={20} className="text-accent" />,
      query: 'What are the exact deadlines for US F-1 visa applications for Fall 2026 intake?'
    },
    {
      title: 'Admission Requirements',
      desc: 'Verify required documents for UK Russell Group universities',
      icon: <FileText size={20} className="text-warning" />,
      query: 'List the mandatory documents required for PG admission to UK Russell Group universities.'
    },
    {
      title: 'Post-Study Work Options',
      desc: 'Compare post-graduation stay policies in Canada vs Australia',
      icon: <Plane size={20} className="text-success" />,
      query: 'Compare the latest post-study work visa (PSW) policies between Canada and Australia as of 2026.'
    },
    {
      title: 'Financial Proof Validation',
      desc: 'Understand acceptable proof of funds for German Student Blocked Account',
      icon: <ShieldCheck size={20} className="text-danger" />,
      query: 'What are the exact requirements and minimum amount for a German Student Visa Blocked Account in 2026?'
    }
  ];

  const [progressState, setProgressState] = useState(0);

  const updateProgress = async () => {
    try {
      const files = await loadDocuments();
      const hasFiles = Object.keys(files).length > 0;
      const isVerified = localStorage.getItem('docs_verified') === 'true';

      if (isVerified) {
        setProgressState(2);
      } else if (hasFiles) {
        setProgressState(1);
      } else {
        setProgressState(0);
      }
    } catch (e) {
      console.error('Failed to load storage state', e);
    }
  };

  useEffect(() => {
    updateProgress();
    window.addEventListener('docs_updated', updateProgress);
    return () => window.removeEventListener('docs_updated', updateProgress);
  }, []);

  return (
    <div className="welcome-container animate-fade-in" style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', width: '100%', maxWidth: '1400px', alignItems: 'center' }}>
        
        {/* Left Column: Vision & Identity */}
        <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-full)', width: 'fit-content', marginBottom: '2.5rem', boxShadow: 'var(--shadow-subtle)' }}>
            <span style={{ position: 'relative', display: 'flex', height: 8, width: 8 }}>
              <span className="animate-ping" style={{ position: 'absolute', height: '100%', width: '100%', borderRadius: '50%', background: 'var(--success)', opacity: 0.8 }}></span>
              <span style={{ position: 'relative', borderRadius: '50%', height: 8, width: 8, background: 'var(--success)' }}></span>
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Encrypted Network Online</span>
          </div>
          <h1 
            className="welcome-title" 
            style={{ 
              textTransform: 'uppercase', 
              fontSize: '4.5rem', 
              lineHeight: 1, 
              textAlign: 'left', 
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--text-primary) 0%, rgba(99, 102, 241, 0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1.5rem',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '-0.02em',
              textShadow: 'var(--shadow-subtle)'
            }}
          >
            STUDENT<br />APPLICATION<br />& VERIFICATION
          </h1>
          <p 
            className="welcome-subtitle" 
            style={{ 
              fontSize: '1.125rem', 
              color: 'var(--text-secondary)', 
              textAlign: 'left',
              fontWeight: 500,
              fontFamily: "monospace",
              lineHeight: 1.6,
              borderLeft: '4px solid var(--accent-base)',
              paddingLeft: '1.5rem',
              maxWidth: '500px'
            }}
          >
            A secure digital hub designed to track real-time study abroad progress and authenticate complex documents globally.
          </p>
        </div>

        {/* Right Column: Dashboard Layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '2.5rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 6, height: 6, background: 'var(--accent-base)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-base)' }}></div> Authentication Pipeline
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 1rem' }}>
              <div style={{ position: 'absolute', top: '24px', left: '10%', width: '80%', height: '2px', background: 'rgba(99, 102, 241, 0.15)', zIndex: 0 }}></div>
              <div style={{ position: 'absolute', top: '24px', left: '10%', width: progressState === 2 ? '80%' : progressState === 1 ? '40%' : '0%', height: '2px', background: 'var(--accent-gradient)', transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 1, boxShadow: '0 0 15px var(--accent-glow)' }}></div>
              
              {[
                { step: 'Payload Upload', status: progressState > 0 ? 'completed' : 'current' },
                { step: 'Hash Verification', status: progressState > 1 ? 'completed' : progressState === 1 ? 'current' : 'pending' },
                { step: 'Final Clearance', status: progressState > 1 ? 'current' : 'pending' }
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', zIndex: 2 }}>
                  <div style={{ 
                    width: 50, height: 50, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: s.status === 'completed' ? 'var(--accent-gradient)' : s.status === 'current' ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                    color: s.status === 'pending' ? 'var(--text-tertiary)' : s.status === 'completed' ? 'white' : 'var(--accent-base)',
                    border: s.status === 'current' ? '2px solid var(--accent-base)' : `1px solid ${s.status === 'completed' ? 'transparent' : 'var(--border-light)'}`,
                    boxShadow: s.status === 'current' ? 'var(--shadow-glow)' : s.status === 'completed' ? '0 10px 20px var(--accent-glow)' : 'none',
                    transform: s.status === 'current' ? 'scale(1.15) translateY(-5px)' : s.status === 'completed' ? 'scale(1.05)' : 'scale(1)'
                  }}>
                    {s.status === 'completed' ? <ShieldCheck size={24} /> : i + 1}
                  </div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: s.status === 'current' ? 800 : 600, color: s.status === 'pending' ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>
                    {s.step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {suggestions.slice(0, 2).map((suggestion, index) => (
              <div 
                key={index}
                className="glass-panel"
                style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                onClick={() => onSuggest(suggestion.query)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'; e.currentTarget.style.boxShadow = 'var(--shadow-elevated)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-subtle)'; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--bg-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  {suggestion.icon}
                </div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{suggestion.title}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{suggestion.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
