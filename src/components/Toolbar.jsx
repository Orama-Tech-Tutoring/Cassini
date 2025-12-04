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
    ArrowRight,
    Download,
    Upload,
    Grid,
    ArrowLeftRight
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
        setShowTextModal,
        exportCanvasPNG,
        importImage,
        setShowBackgroundModal
    } = useWhiteboard();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [toolbarOrientation, setToolbarOrientation] = useState('horizontal'); // 'horizontal' or 'vertical'

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
            ...(toolbarOrientation === 'horizontal' ? {
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)'
            } : {
                top: '50%',
                left: 20,
                transform: 'translateY(-50%)'
            }),
            zIndex: 1000,
            display: 'flex',
            flexDirection: toolbarOrientation === 'horizontal' ? 'column' : 'row',
            alignItems: 'center',
            gap: '8px'
        }}>
            <div className="glass" style={{
                padding: toolbarOrientation === 'horizontal' ? '6px' : '4px',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: toolbarOrientation === 'horizontal' ? 'row' : 'column',
                gap: toolbarOrientation === 'horizontal' ? '4px' : '2px',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                maxHeight: toolbarOrientation === 'vertical' ? '90vh' : 'none',
                overflowY: toolbarOrientation === 'vertical' ? 'auto' : 'visible'
            }}>
                {/* Collapse Toggle */}
                <button
                    className="glass-button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Expand Toolbar" : "Collapse Toolbar"}
                    style={{
                        width: toolbarOrientation === 'horizontal' ? '28px' : '24px',
                        height: toolbarOrientation === 'horizontal' ? '28px' : '24px',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: isCollapsed ? 0 : (toolbarOrientation === 'horizontal' ? '5px' : '0')
                    }}
                >
                    {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </button>

                {/* Orientation Toggle */}
                {!isCollapsed && (
                    <button
                        className="glass-button"
                        onClick={() => setToolbarOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal')}
                        title={`Switch to ${toolbarOrientation === 'horizontal' ? 'Vertical' : 'Horizontal'}`}
                        style={{
                            width: toolbarOrientation === 'horizontal' ? '28px' : '24px',
                            height: toolbarOrientation === 'horizontal' ? '28px' : '24px',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: toolbarOrientation === 'horizontal' ? '5px' : '0'
                        }}
                    >
                        <ArrowLeftRight size={16} />
                    </button>
                )}

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
                                        width: toolbarOrientation === 'horizontal' ? '40px' : '28px',
                                        height: toolbarOrientation === 'horizontal' ? '40px' : '28px',
                                        padding: toolbarOrientation === 'horizontal' ? '8px' : '5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Icon size={toolbarOrientation === 'horizontal' ? 20 : 14} />
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

                        {/* Fill Color Picker (compact, only for shapes) */}
                        {['rectangle', 'circle'].includes(activeTool) && (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 4px', minWidth: '90px' }}>
                                    <label style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.7)' }}>
                                        Fill: {Math.round(toolProperties.fillOpacity * 100)}%
                                    </label>
                                    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                        {colors.slice(0, 3).map(color => (
                                            <button
                                                key={color}
                                                onClick={() => updateToolProperty('fillColor', color)}
                                                style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    borderRadius: '50%',
                                                    background: color,
                                                    border: toolProperties.fillColor === color
                                                        ? '2px solid white'
                                                        : '1px solid rgba(255, 255, 255, 0.3)',
                                                    cursor: 'pointer',
                                                    transition: 'all var(--transition-fast)'
                                                }}
                                                title={color}
                                            />
                                        ))}
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={toolProperties.fillOpacity}
                                            onChange={(e) => updateToolProperty('fillOpacity', parseFloat(e.target.value))}
                                            style={{
                                                width: '55px',
                                                cursor: 'pointer'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div style={{
                                    width: '1px',
                                    height: '40px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    margin: '0 4px'
                                }} />
                            </>
                        )}

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

                        {/* Divider */}
                        <div style={{
                            width: '1px',
                            height: '40px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            margin: '0 4px'
                        }} />

                        {/* Export/Import Buttons */}
                        <button
                            className="glass-button"
                            onClick={exportCanvasPNG}
                            title="Export as PNG (Ctrl+E)"
                            style={{
                                width: '40px',
                                height: '40px',
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Download size={20} />
                        </button>
                        <button
                            className="glass-button"
                            onClick={importImage}
                            title="Import Image (Ctrl+I)"
                            style={{
                                width: '40px',
                                height: '40px',
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Upload size={20} />
                        </button>
                        <button
                            className="glass-button"
                            onClick={() => setShowBackgroundModal(true)}
                            title="Background & Grid"
                            style={{
                                width: '40px',
                                height: '40px',
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Grid size={20} />
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
