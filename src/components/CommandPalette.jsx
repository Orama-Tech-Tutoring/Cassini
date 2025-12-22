import React, { useState, useEffect, useRef } from 'react';
import { Search, Grid, Download, Trash2, Settings, FilePlus, Pen, Eraser, MousePointer, Square, Circle, Minus, ArrowRight, Type } from 'lucide-react';
import { useWhiteboard } from '../context/WhiteboardContext';

const CommandPalette = () => {
    const {
        setActiveTool,
        setShowTextModal,
        setShowSettingsSidebar,
        setShowWelcome,
        clearCanvas,
        exportCanvasPNG,
        updateBackground
    } = useWhiteboard();

    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    const actions = [
        { id: 'grid_dots', label: 'Set Grid to Dots', icon: <Grid size={18} />, category: 'Canvas', perform: () => updateBackground({ gridType: 'dots' }) },
        { id: 'grid_lines', label: 'Set Grid to Lines', icon: <Grid size={18} />, category: 'Canvas', perform: () => updateBackground({ gridType: 'lines' }) },
        { id: 'grid_squares', label: 'Set Grid to Squares', icon: <Grid size={18} />, category: 'Canvas', perform: () => updateBackground({ gridType: 'squares' }) },
        { id: 'grid_none', label: 'Remove Grid', icon: <Grid size={18} />, category: 'Canvas', perform: () => updateBackground({ gridType: 'none' }) },
        { id: 'export_png', label: 'Export as PNG', icon: <Download size={18} />, category: 'File', perform: exportCanvasPNG },
        { id: 'clear_canvas', label: 'Clear Canvas', icon: <Trash2 size={18} />, category: 'Danger', perform: clearCanvas },
        { id: 'new_canvas', label: 'Go to Welcome Screen', icon: <FilePlus size={18} />, category: 'Navigation', perform: () => setShowWelcome(true) },
        { id: 'open_settings', label: 'Open Settings', icon: <Settings size={18} />, category: 'Navigation', perform: () => setShowSettingsSidebar(true) },

        { id: 'tool_pen', label: 'Switch to Pen', icon: <Pen size={18} />, category: 'Tools', perform: () => setActiveTool('pen') },
        { id: 'tool_eraser', label: 'Switch to Eraser', icon: <Eraser size={18} />, category: 'Tools', perform: () => setActiveTool('eraser') },
        { id: 'tool_select', label: 'Switch to Selection', icon: <MousePointer size={18} />, category: 'Tools', perform: () => setActiveTool('select') },
        { id: 'tool_rectangle', label: 'Draw Rectangle', icon: <Square size={18} />, category: 'Tools', perform: () => setActiveTool('rectangle') },
        { id: 'tool_circle', label: 'Draw Circle', icon: <Circle size={18} />, category: 'Tools', perform: () => setActiveTool('circle') },
        { id: 'tool_line', label: 'Draw Line', icon: <Minus size={18} />, category: 'Tools', perform: () => setActiveTool('line') },
        { id: 'tool_arrow', label: 'Draw Arrow', icon: <ArrowRight size={18} />, category: 'Tools', perform: () => setActiveTool('arrow') },
        { id: 'tool_text', label: 'Add Text', icon: <Type size={18} />, category: 'Tools', perform: () => setShowTextModal(true) },
    ];

    const filteredActions = actions.filter(action =>
        action.label.toLowerCase().includes(query.toLowerCase()) ||
        action.category.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
                setQuery('');
                setSelectedIndex(0);
            } else if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredActions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredActions[selectedIndex]) {
                handleExecute(filteredActions[selectedIndex]);
            }
        }
    };

    const handleExecute = (action) => {
        action.perform();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="command-palette-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            zIndex: 20000,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '15vh'
        }} onClick={() => setIsOpen(false)}>

            <div className="command-palette" style={{
                width: '100%',
                maxWidth: '600px',
                background: 'rgba(25, 25, 25, 0.9)',
                backdropFilter: 'blur(40px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden',
                color: 'white',
                fontFamily: 'Inter, sans-serif'
            }} onClick={e => e.stopPropagation()}>

                {/* Search Bar */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Search size={20} style={{ color: 'rgba(255, 255, 255, 0.4)', marginRight: '16px' }} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for commands..."
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                        onKeyDown={handleKeyDown}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '16px',
                            width: '100%',
                            outline: 'none'
                        }}
                    />
                    <div style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>ESC</div>
                </div>

                {/* Results */}
                <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '8px' }}>
                    {filteredActions.length > 0 ? (
                        filteredActions.map((action, index) => (
                            <div
                                key={action.id}
                                onClick={() => handleExecute(action)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 12px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    background: index === selectedIndex ? 'rgba(0, 122, 255, 0.2)' : 'transparent',
                                    transition: 'all 0.1s ease',
                                    border: index === selectedIndex ? '1px solid rgba(0, 122, 255, 0.3)' : '1px solid transparent'
                                }}
                            >
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: index === selectedIndex ? '#007AFF' : 'rgba(255, 255, 255, 0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '12px',
                                    color: index === selectedIndex ? 'white' : 'rgba(255, 255, 255, 0.6)'
                                }}>
                                    {action.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 500, color: index === selectedIndex ? 'white' : 'rgba(255, 255, 255, 0.9)' }}>
                                        {action.label}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)' }}>
                                        {action.category}
                                    </div>
                                </div>
                                {index === selectedIndex && (
                                    <div style={{ fontSize: '10px', color: '#007AFF', fontWeight: 600 }}>ENTER</div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.3)', fontSize: '14px' }}>
                            No commands found for "{query}"
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', gap: '16px', fontSize: '11px', color: 'rgba(255, 255, 255, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={kbKeyStyle}>↑↓</span> to navigate
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={kbKeyStyle}>↵</span> to select
                    </div>
                </div>
            </div>
        </div>
    );
};

const kbKeyStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    padding: '0 4px',
    minWidth: '20px',
    height: '20px',
    marginRight: '2px'
};

export default CommandPalette;
