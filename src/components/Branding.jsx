import React from 'react';
import { Settings } from 'lucide-react';
import { useWhiteboard } from '../context/WhiteboardContext';

const Branding = () => {
    const { setShowSettingsSidebar, settings } = useWhiteboard();
    const isLight = settings.iconTheme === 'light';

    return (
        <div style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            zIndex: 1000,
            fontFamily: 'var(--font-primary)',
            fontSize: '14px',
            color: isLight ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
            userSelect: 'none',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        }}>
            <img
                src="/logo.png"
                alt="Cassini"
                style={{
                    height: '20px',
                    width: 'auto',
                    objectFit: 'contain',
                    filter: isLight ? 'brightness(0) opacity(0.6)' : 'brightness(0) invert(1) opacity(0.6)'
                }}
            />
            <div style={{ width: '1px', height: '14px', background: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)' }} />
            <button
                onClick={() => setShowSettingsSidebar(true)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: isLight ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                    fontSize: '12px',
                    fontWeight: 500
                }}
                className={`branding-settings-btn ${isLight ? 'light-icons' : ''}`}
            >
                <Settings size={14} />
                <span>Settings</span>
            </button>
            <style>{`
                .branding-settings-btn:hover {
                    background: ${isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'} !important;
                    color: ${isLight ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.8)'} !important;
                }
            `}</style>
        </div>
    );
};

export default Branding;
