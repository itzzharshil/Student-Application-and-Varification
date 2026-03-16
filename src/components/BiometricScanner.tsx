import { useState, useEffect } from 'react';
import { Fingerprint, Lock, ShieldCheck } from 'lucide-react';
import './BiometricScanner.css';

interface BiometricScannerProps {
  onUnlock: () => void;
  onClose: () => void;
}

export function BiometricScanner({ onUnlock, onClose }: BiometricScannerProps) {
  const [scanning, setScanning] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setTimeout(onUnlock, 1500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onUnlock]);

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="biometric-modal animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="biometric-header">
          <h2>SECURE AUTHENTICATION</h2>
          <p>Biometric Verification Required for Access</p>
        </div>
        
        <div className="scanner-container">
          <div className={`fingerprint-wrapper ${scanning ? 'scanning' : 'success'}`}>
            <Fingerprint size={100} className="fingerprint-icon" strokeWidth={1} />
            {scanning && <div className="scan-line" style={{ top: `${progress}%` }}></div>}
            {!scanning && (
              <div className="success-overlay animate-zoom-in">
                <ShieldCheck size={48} color="var(--success)" />
              </div>
            )}
            
            {/* Concentric circles from the image constraint */}
            <div className="concentric-circle circle-1"></div>
            <div className="concentric-circle circle-2"></div>
            <div className="concentric-circle circle-3"></div>
          </div>
          
          <div className="status-text">
            {scanning ? `Authenticating User... ${progress}%` : 'Identity Verified'}
          </div>
        </div>

        <div className="biometric-footer">
          <Lock size={14} />
          <span>Encrypted Gateway</span>
        </div>
      </div>
    </div>
  );
}
