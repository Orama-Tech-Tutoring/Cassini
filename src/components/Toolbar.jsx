import React, { useState } from 'react';
import { useWhiteboard } from '../context/WhiteboardContext';
import {
    Pen,
    Eraser,
    MousePointer,
    Ruler,
    Circle as CircleIcon, // Alias for Protractor
    Type,
    Undo,
    Redo,
    Trash2,
    ChevronUp,
    ChevronDown,
    Square,
    Circle,
    Minus,
    ArrowRight
} from 'lucide-react';

const Toolbar = () => {
    const {
        activeTool,
        setActiveTool,
        toolProperties,
        updateToolProperty,
        undo,
        redo,
        clearCanvas,
        setShowTextModal
    } = useWhiteboard();

    const [isCollapsed, setIsCollapsed] = useState(false);

    const tools = [
        { id: 'pen', icon: Pen, label: 'Pen' },
        { id: 'eraser', icon: Eraser, label: 'Eraser' },
        { id: 'select', icon: MousePointer, label: 'Select' },
        { id: 'rectangle', icon: Square, label: 'Rectangle' },
        { id: 'circle', icon: Circle, label: 'Circle' },
        { id: 'line', icon: Minus, label: 'Line' },
        { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
        { id: 'ruler', icon: Ruler, label: 'Ruler' },
        { id: 'protractor', icon: CircleIcon, label: 'Protractor' },
        { id: 'text', icon: Type, label: 'Text', action: () => setShowTextModal(true) }
    ];

    const colors = [
        '#007AFF', '#34C759', '#FF2D55', '#FF9500', '#BF5AF2',
        '#FFFFFF', '#000000', '#8E8E93'
    ];

    const handleToolClick = (tool) => {
        if (tool.action) {
            tool.action();
        } else {
            setActiveTool(tool.id);
        }
    };

    return (
        <div style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
        }}>
            <div className="glass" style={{
                padding: '12px',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                transition: 'all 0.3s ease'
            }}>
                {/* Collapse Toggle */}
                <button
                    className="glass-button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Expand Toolbar" : "Collapse Toolbar"}
                    style={{
                        width: '32px',
                        height: '32px',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: isCollapsed ? 0 : '8px'
                    }}
                >
                    {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </button>

                {!isCollapsed && (
                    <>
                        {/* Tool Buttons */}
                        {tools.map(tool => {
                            const Icon = tool.icon;
                            return (
                                <button
                                    key={tool.id}
                                    className={`glass-button ${activeTool === tool.id ? 'active' : ''}`}
                                    onClick={() => handleToolClick(tool)}
                                    title={tool.label}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        padding: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Icon size={20} />
                                </button>
                            );
                        })}

                        {/* Divider */}
                        <div style={{
                            width: '1px',
                            height: '40px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            margin: '0 4px'
                        }} />

                        {/* Color Picker */}
                        <div style={{ display: 'flex', gap: '4px', padding: '0 8px', alignItems: 'center' }}>
                            {colors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => updateToolProperty('color', color)}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: color,
                                        border: toolProperties.color === color
                                            ? '2px solid white'
                                            : '2px solid rgba(255, 255, 255, 0.3)',
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast)',
                                        boxShadow: toolProperties.color === color
                                            ? '0 0 0 2px rgba(0, 122, 255, 0.5)'
                                            : 'none'
                                    }}
                                    title={color}
                                />
                            ))}
                            {/* Custom Color Picker */}
                            <input
                                type="color"
                                value={toolProperties.color}
                                onChange={(e) => updateToolProperty('color', e.target.value)}
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '4px',
                                    border: '2px solid rgba(255, 255, 255, 0.3)',
                                    cursor: 'pointer',
                                    background: 'transparent',
                                    padding: '2px'
                                }}
                                title="Custom Color"
                            />
                        </div>

                        {/* Divider */}
                        <div style={{
                            width: '1px',
                            height: '40px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            margin: '0 4px'
                        }} />

                        {/* Thickness Slider */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            padding: '0 8px'
                        }}>
                            <label style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>
                                Size: {toolProperties.thickness}px
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={toolProperties.thickness}
                                onChange={(e) => updateToolProperty('thickness', parseInt(e.target.value))}
                                style={{
                                    width: '100px',
                                    accentColor: 'var(--accent-blue)'
                                }}
                            />
                        </div>

                        {/* Opacity Slider */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            padding: '0 8px'
                        }}>
                            <label style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>
                                Opacity: {Math.round(toolProperties.opacity * 100)}%
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={toolProperties.opacity}
                                onChange={(e) => updateToolProperty('opacity', parseFloat(e.target.value))}
                                style={{
                                    width: '100px',
                                    accentColor: 'var(--accent-blue)'
                                }}
                            />
                        </div>

                        {/* Divider */}
                        <div style={{
                            width: '1px',
                            height: '40px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            margin: '0 4px'
                        }} />

                        {/* Action Buttons */}
                        <button
                            className="glass-button"
                            onClick={undo}
                            title="Undo"
                            style={{
                                width: '40px',
                                height: '40px',
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Undo size={20} />
                        </button>
                        <button
                            className="glass-button"
                            onClick={redo}
                            title="Redo"
                            style={{
                                width: '40px',
                                height: '40px',
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Redo size={20} />
                        </button>
                        <button
                            className="glass-button"
                            onClick={clearCanvas}
                            title="Clear All"
                            style={{
                                width: '40px',
                                height: '40px',
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Trash2 size={20} />
                        </button>
                    </>
                )}
            </div>
            {isCollapsed && (
                <div className="glass" style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)'
                }}>
                    Toolbar Collapsed
                </div>
            )}
        </div>
    );
};

export default Toolbar;
