import React, { useState, useEffect } from 'react';
import { FilePlus, FolderOpen, Clock, ChevronRight, User } from 'lucide-react';
import { loadWhiteboard, getRecentFiles } from '../utils/fileUtils';
import { useWhiteboard } from '../context/WhiteboardContext';

const WelcomeScreen = ({ onNewCanvas, onLoadFile }) => {
    const { settings, updateSettings } = useWhiteboard();
    const [recentFiles, setRecentFiles] = useState([]);
    const [isExiting, setIsExiting] = useState(false);
    const [tempName, setTempName] = useState(settings.userName || '');
    const [error, setError] = useState('');

    useEffect(() => {
        setRecentFiles(getRecentFiles());
    }, []);

    const handleNewCanvas = () => {
        if (!tempName.trim()) {
            setError('Please enter your name to continue');
            return;
        }
        updateSettings({ userName: tempName.trim() });
        setIsExiting(true);
        setTimeout(onNewCanvas, 300); // Wait for exit animation
    };

    const handleOpenFile = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const data = await loadWhiteboard(file);
                setIsExiting(true);
                setTimeout(() => onLoadFile(data, file.name), 300);
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleOpenRecent = (fileMeta) => {
        // In a real app with file system access API, we could re-open the handle.
        // For now, browser security prevents directly reading path. 
        // We'll just start a new canvas with that name as a placeholder or 
        // prompt the user that they need to open the file manually.
        // Or better: clicking 'Recent' could just show a "Open this file?" dialog 
        // if we had the blob stored (but localStorage limit is small).

        // Since we can't reliably load the actual file content from just a path string in browser,
        // we'll treat 'Recent' mostly as a history log or quick name lookup for now,
        // unless we implementing IndexedDB storage for full file content.
        // For minimalism, let's just trigger the open dialog but maybe we can't pre-select.

        // Refined approach: Just trigger the file picker for 'Open File' generally,
        // but maybe 'Recent' is just a visual reminder of what you worked on.
        // Let's implement it as a "Quick Open" button that triggers the file input.
        document.getElementById('welcome-file-input').click();
    };

    return (
        <div
            className={`welcome-screen ${isExiting ? 'fade-out' : ''}`}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontFamily: 'Inter, sans-serif',
                transition: 'opacity 0.3s ease'
            }}
        >
            <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '800px',
                height: '500px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                {/* Left Side: Branding & Actions */}
                <div style={{
                    flex: 1,
                    padding: '48px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderRight: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <div style={{ marginBottom: '40px' }}>
                        <img
                            src="/logo.png"
                            alt="Cassini Logo"
                            style={{
                                height: '48px',
                                marginBottom: '16px',
                                filter: 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.3))'
                            }}
                        />
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: 700,
                            letterSpacing: '-0.5px',
                            marginBottom: '8px',
                            background: 'linear-gradient(to right, #fff, #aaa)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Cassini
                        </h1>
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: '14px',
                            letterSpacing: '2px',
                            textTransform: 'uppercase'
                        }}>
                            by Orama
                        </p>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '16px',
                            padding: '20px',
                            border: error ? '1px solid rgba(255, 69, 58, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #007AFF 0%, #00C6FF 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <User size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Name</div>
                                <input
                                    type="text"
                                    placeholder="Who are you?"
                                    value={tempName}
                                    onChange={(e) => {
                                        setTempName(e.target.value);
                                        if (e.target.value.trim()) setError('');
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        fontSize: '16px',
                                        fontWeight: 500,
                                        padding: '2px 0',
                                        width: '100%',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                        {error && (
                            <div style={{ color: '#FF453A', fontSize: '12px', marginTop: '8px', paddingLeft: '4px' }}>
                                {error}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <button
                            className="welcome-btn"
                            onClick={handleNewCanvas}
                            style={buttonStyle}
                        >
                            <FilePlus size={20} />
                            <span>New Canvas</span>
                            <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                        </button>

                        <div style={{ position: 'relative' }}>
                            <input
                                id="welcome-file-input"
                                type="file"
                                accept=".json"
                                onChange={handleOpenFile}
                                style={{ display: 'none' }}
                            />
                            <button
                                className="welcome-btn"
                                onClick={() => document.getElementById('welcome-file-input').click()}
                                style={buttonStyle}
                            >
                                <FolderOpen size={20} />
                                <span>Open File</span>
                                <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Recent Files */}
                <div style={{
                    width: '320px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.4)',
                        marginBottom: '20px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Recent Files
                    </h3>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {recentFiles.length > 0 ? (
                            recentFiles.map(file => (
                                <div
                                    key={file.id}
                                    className="recent-item"
                                    onClick={() => handleOpenRecent(file)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        marginBottom: '8px',
                                        transition: 'background 0.2s ease'
                                    }}
                                >
                                    <Clock size={16} color="rgba(255, 255, 255, 0.4)" />
                                    <div style={{ overflow: 'hidden' }}>
                                        <div style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {file.name}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.3)' }}>
                                            {new Date(file.lastOpened).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{
                                color: 'rgba(255, 255, 255, 0.3)',
                                fontSize: '13px',
                                fontStyle: 'italic',
                                marginTop: '20px',
                                textAlign: 'center'
                            }}>
                                No recent files found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                .welcome-btn:hover {
                    background: rgba(255, 255, 255, 0.08) !important;
                    transform: translateX(4px);
                }
                .recent-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
                .fade-out {
                    opacity: 0;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left'
};

export default WelcomeScreen;
