import React, { useState } from 'react';
import { X, User, Sun, Moon, Grid, Layout, Square, Type, Keyboard } from 'lucide-react';
import { useWhiteboard } from '../context/WhiteboardContext';

const SettingsSidebar = () => {
    const {
        showSettingsSidebar,
        setShowSettingsSidebar,
        settings,
        updateSettings,
        background,
        updateBackground
    } = useWhiteboard();

    if (!showSettingsSidebar) return null;

    const grids = [
        { id: 'none', label: 'None', icon: <Square size={16} /> },
        { id: 'dots', label: 'Dots', icon: <Type size={16} /> },
        { id: 'lines', label: 'Lines', icon: <Layout size={16} /> },
        { id: 'squares', label: 'Squares', icon: <Grid size={16} /> }
    ];

    return (
        <div className="settings-sidebar-overlay" style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'flex-end',
            transition: 'all 0.3s ease'
        }} onClick={() => setShowSettingsSidebar(false)}>
            <div className="settings-sidebar" style={{
                width: '320px',
                height: '100%',
                background: 'rgba(20, 20, 20, 0.85)',
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                color: 'white',
                fontFamily: 'Inter, sans-serif'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Settings</h2>
                    <button
                        onClick={() => setShowSettingsSidebar(false)}
                        style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer', padding: '4px' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* User Profile */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #007AFF 0%, #00C6FF 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <User size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '2px' }}>Signed in as</div>
                        <input
                            type="text"
                            value={settings.userName}
                            onChange={(e) => updateSettings({ userName: e.target.value })}
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

                {/* Settings Sections */}
                <div style={{ flex: 1, overflowY: 'auto' }}>

                    {/* Icon Theme */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={sectionTitleStyle}>Icon Theme</h3>
                        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '12px' }}>
                            <button
                                onClick={() => updateSettings({ iconTheme: 'liquid' })}
                                style={{ ...toggleButtonStyle, background: settings.iconTheme === 'liquid' ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}
                            >
                                <Moon size={16} />
                                <span>Liquid Glass</span>
                            </button>
                            <button
                                onClick={() => updateSettings({ iconTheme: 'light' })}
                                style={{ ...toggleButtonStyle, background: settings.iconTheme === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}
                            >
                                <Sun size={16} />
                                <span>Light Mode</span>
                            </button>
                        </div>
                    </div>

                    {/* Grid Type */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={sectionTitleStyle}>Grid Type</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                            {grids.map(grid => (
                                <button
                                    key={grid.id}
                                    onClick={() => updateBackground({ gridType: grid.id })}
                                    style={{
                                        ...gridButtonStyle,
                                        background: background.gridType === grid.id ? 'rgba(0, 122, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        border: background.gridType === grid.id ? '1px solid #007AFF' : '1px solid transparent'
                                    }}
                                >
                                    {grid.icon}
                                    <span>{grid.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid Opacity */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={sectionTitleStyle}>Grid Density</h3>
                        <input
                            type="range"
                            min="20"
                            max="100"
                            step="10"
                            value={background.gridSize}
                            onChange={(e) => updateBackground({ gridSize: parseInt(e.target.value) })}
                            style={{
                                width: '100%',
                                cursor: 'pointer',
                                accentColor: '#007AFF'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)' }}>
                            <span>Compact</span>
                            <span>Sparse</span>
                        </div>
                    </div>

                    {/* Keyboard Shortcuts */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <Keyboard size={16} color="rgba(255, 255, 255, 0.4)" />
                            <h3 style={{ ...sectionTitleStyle, marginBottom: 0 }}>Keyboard Shortcuts</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <ShortcutItem label="Command Palette" keys={['Cmd', 'K']} />
                            <ShortcutItem label="Save Canvas" keys={['Ctrl', 'S']} />
                            <ShortcutItem label="Open File" keys={['Ctrl', 'O']} />
                            <ShortcutItem label="Export PNG" keys={['Ctrl', 'E']} />
                            <div style={{ height: '8px' }} />
                            <ShortcutItem label="Pen Tool" keys={['P']} />
                            <ShortcutItem label="Eraser Tool" keys={['E']} />
                            <ShortcutItem label="Select Tool" keys={['V']} />
                            <ShortcutItem label="Rectangle Tool" keys={['R']} />
                            <ShortcutItem label="Circle Tool" keys={['C']} />
                            <ShortcutItem label="Line Tool" keys={['L']} />
                            <ShortcutItem label="Arrow Tool" keys={['A']} />
                            <div style={{ height: '8px' }} />
                            <ShortcutItem label="Undo" keys={['Ctrl', 'Z']} />
                            <ShortcutItem label="Redo" keys={['Ctrl', 'Y']} />
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center' }}>
                        Cassini v1.5.3
                    </div>
                </div>

            </div>
        </div>
    );
};

const ShortcutItem = ({ label, keys }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>{label}</span>
        <div style={{ display: 'flex', gap: '4px' }}>
            {keys.map((key, i) => (
                <kbd key={i} style={{
                    padding: '2px 6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    minWidth: '20px',
                    textAlign: 'center'
                }}>{key}</kbd>
            ))}
        </div>
    </div>
);

const sectionTitleStyle = {
    fontSize: '13px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px'
};

const toggleButtonStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const gridButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left'
};

export default SettingsSidebar;
