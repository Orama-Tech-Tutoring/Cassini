import React, { useState } from 'react';
import { useWhiteboard } from '../context/WhiteboardContext';
import { X, Grid } from 'lucide-react';

const BackgroundModal = () => {
    const { background, updateBackground, showBackgroundModal, setShowBackgroundModal } = useWhiteboard();
    const [localSettings, setLocalSettings] = useState(background);

    if (!showBackgroundModal) return null;

    const handleApply = () => {
        updateBackground(localSettings);
        setShowBackgroundModal(false);
    };

    const handleCancel = () => {
        setLocalSettings(background);
        setShowBackgroundModal(false);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(4px)'
        }} onClick={handleCancel}>
            <div className="glass" style={{
                padding: '24px',
                borderRadius: 'var(--radius-xl)',
                width: '400px',
                maxWidth: '90vw'
            }} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Grid size={20} />
                        Background Settings
                    </h2>
                    <button
                        className="glass-button"
                        onClick={handleCancel}
                        style={{
                            width: '32px',
                            height: '32px',
                            padding: '6px'
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Grid Type */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 500,
                        marginBottom: '8px',
                        color: 'rgba(255, 255, 255, 0.8)'
                    }}>
                        Grid Type
                    </label>
                    <select
                        value={localSettings.gridType}
                        onChange={(e) => setLocalSettings({ ...localSettings, gridType: e.target.value })}
                        className="glass-button"
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="none">None</option>
                        <option value="dots">Dots</option>
                        <option value="lines">Lines</option>
                        <option value="squares">Squares</option>
                    </select>
                </div>

                {/* Grid Size */}
                {localSettings.gridType !== 'none' && (
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '12px',
                            fontWeight: 500,
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.8)'
                        }}>
                            Grid Size: {localSettings.gridSize}px
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={localSettings.gridSize}
                            onChange={(e) => setLocalSettings({ ...localSettings, gridSize: parseInt(e.target.value) })}
                            style={{
                                width: '100%',
                                cursor: 'pointer',
                                accentColor: 'var(--accent-blue)'
                            }}
                        />
                    </div>
                )}

                {/* Canvas Background Color */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 500,
                        marginBottom: '8px',
                        color: 'rgba(255, 255, 255, 0.8)'
                    }}>
                        Canvas Background
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {['#ffffff', '#f0f0f0', '#e0e0e0', '#1a1a1a', '#2d2d2d'].map(color => (
                            <button
                                key={color}
                                onClick={() => setLocalSettings({ ...localSettings, backgroundColor: color })}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: color,
                                    border: localSettings.backgroundColor === color
                                        ? '3px solid var(--accent-blue)'
                                        : '2px solid rgba(255, 255, 255, 0.2)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            />
                        ))}
                        <input
                            type="color"
                            value={localSettings.backgroundColor}
                            onChange={(e) => setLocalSettings({ ...localSettings, backgroundColor: e.target.value })}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                        className="glass-button"
                        onClick={handleCancel}
                        style={{
                            padding: '10px 20px',
                            fontSize: '14px'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className="glass-button active"
                        onClick={handleApply}
                        style={{
                            padding: '10px 20px',
                            fontSize: '14px'
                        }}
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BackgroundModal;
