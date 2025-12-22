import React, { useState, useEffect } from 'react';
import { useWhiteboard } from '../context/WhiteboardContext';
import {
    Pen,
    Eraser,
    MousePointer,
    Ruler,
    Circle as CircleIcon,
    Type,
    Undo,
    Redo,
    Trash2,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Square,
    Circle,
    Minus,
    ArrowRight,
    Download,
    Upload,
    Grid,
    Palette,
    Settings2,
    Shapes,
    FileText,
    Save,
    FolderOpen,
    FilePlus
} from 'lucide-react';
import { saveWhiteboard, loadWhiteboard } from '../utils/fileUtils';

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
        setShowBackgroundModal,
        elements,
        background,
        viewport,
        setElements,
        updateBackground,
        setViewport,
        settings
    } = useWhiteboard();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [toolbarOrientation, setToolbarOrientation] = useState('horizontal');

    // Collapsible section states
    const [showDrawingTools, setShowDrawingTools] = useState(true);
    const [showShapeTools, setShowShapeTools] = useState(false);
    const [showColorPanel, setShowColorPanel] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showFileTools, setShowFileTools] = useState(false);

    // Responsive sizing
    const [uiScale, setUiScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            const width = window.innerWidth;
            if (width < 640) setUiScale(0.75);
            else if (width < 1024) setUiScale(0.9);
            else setUiScale(1);
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    const baseSize = 40 * uiScale;
    const iconSize = 20 * uiScale;
    const smallIconSize = 16 * uiScale;

    const drawingTools = [
        { id: 'pen', icon: Pen, label: 'Pen' },
        { id: 'eraser', icon: Eraser, label: 'Eraser' },
        { id: 'select', icon: MousePointer, label: 'Select' },
    ];

    const shapeTools = [
        { id: 'rectangle', icon: Square, label: 'Rectangle' },
        { id: 'circle', icon: Circle, label: 'Circle' },
        { id: 'line', icon: Minus, label: 'Line' },
        { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
        { id: 'text', icon: Type, label: 'Text', action: () => setShowTextModal(true) },
    ];

    const measureTools = [
        { id: 'ruler', icon: Ruler, label: 'Ruler' },
        { id: 'protractor', icon: CircleIcon, label: 'Protractor' },
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

    const ToolButton = ({ tool, size = baseSize }) => {
        const Icon = tool.icon;
        const isLight = settings.iconTheme === 'light';
        return (
            <button
                className={`glass-button ${activeTool === tool.id ? 'active' : ''} ${isLight ? 'light-icons' : ''}`}
                onClick={() => handleToolClick(tool)}
                title={tool.label}
                style={{
                    width: size,
                    height: size,
                    padding: size * 0.2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Icon size={iconSize} />
            </button>
        );
    };

    const SectionHeader = ({ label, isOpen, onToggle, icon: Icon }) => (
        <button
            className={`glass-button ${settings.iconTheme === 'light' ? 'light-icons' : ''}`}
            onClick={onToggle}
            title={`${isOpen ? 'Collapse' : 'Expand'} ${label}`}
            style={{
                width: baseSize,
                height: baseSize * 0.7,
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                fontSize: 10 * uiScale,
                background: isOpen ? 'rgba(0, 122, 255, 0.2)' : 'transparent'
            }}
        >
            <Icon size={smallIconSize} />
            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
    );

    const Divider = () => {
        const isLight = settings.iconTheme === 'light';
        return (
            <div style={{
                width: toolbarOrientation === 'horizontal' ? '1px' : '80%',
                height: toolbarOrientation === 'horizontal' ? baseSize * 0.8 : '1px',
                background: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.15)',
                margin: toolbarOrientation === 'horizontal' ? '0 4px' : '4px 0'
            }} />
        );
    };

    if (isCollapsed) {
        return (
            <div style={{
                position: 'absolute',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000
            }}>
                <button
                    className={`glass-button ${settings.iconTheme === 'light' ? 'light-icons' : ''}`}
                    onClick={() => setIsCollapsed(false)}
                    title="Expand Toolbar"
                    style={{
                        width: baseSize * 1.5,
                        height: baseSize,
                        padding: '8px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        color: settings.iconTheme === 'light' ? 'rgba(0, 0, 0, 0.85)' : 'white'
                    }}
                >
                    <ChevronDown size={iconSize} />
                    <span style={{ fontSize: 12 * uiScale }}>Tools</span>
                </button>
            </div>
        );
    }

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
            zIndex: 1000
        }}>
            <div className={`glass ${settings.iconTheme === 'light' ? 'light-glass' : ''}`} style={{
                padding: 8 * uiScale,
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: toolbarOrientation === 'horizontal' ? 'row' : 'column',
                gap: 4 * uiScale,
                alignItems: 'center',
                transition: 'all 0.3s ease',
                maxWidth: toolbarOrientation === 'horizontal' ? '95vw' : 'none',
                maxHeight: toolbarOrientation === 'vertical' ? '90vh' : 'none',
                overflowX: toolbarOrientation === 'horizontal' ? 'auto' : 'visible',
                overflowY: toolbarOrientation === 'vertical' ? 'auto' : 'visible'
            }}>
                {/* Collapse/Orientation Controls */}
                <div style={{ display: 'flex', gap: 2 }}>
                    <button
                        className={`glass-button ${settings.iconTheme === 'light' ? 'light-icons' : ''}`}
                        onClick={() => setIsCollapsed(true)}
                        title="Collapse Toolbar"
                        style={{ width: baseSize * 0.7, height: baseSize * 0.7, padding: 4 }}
                    >
                        <ChevronUp size={smallIconSize} />
                    </button>
                    <button
                        className={`glass-button ${settings.iconTheme === 'light' ? 'light-icons' : ''}`}
                        onClick={() => setToolbarOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal')}
                        title="Toggle Orientation"
                        style={{ width: baseSize * 0.7, height: baseSize * 0.7, padding: 4 }}
                    >
                        {toolbarOrientation === 'horizontal' ? <ChevronLeft size={smallIconSize} /> : <ChevronRight size={smallIconSize} />}
                    </button>
                </div>

                <Divider />

                <Divider />

                {/* File Tools Section */}
                <div style={{ display: 'flex', flexDirection: toolbarOrientation === 'horizontal' ? 'row' : 'column', gap: 4, alignItems: 'center' }}>
                    <SectionHeader label="File" isOpen={showFileTools} onToggle={() => setShowFileTools(!showFileTools)} icon={FileText} />
                    {showFileTools && (
                        <>
                            <ToolButton
                                tool={{
                                    id: 'new',
                                    icon: FilePlus,
                                    label: 'New Canvas',
                                    action: () => {
                                        if (window.confirm('Are you sure you want to create a new canvas? Unsaved changes will be lost.')) {
                                            clearCanvas();
                                        }
                                    }
                                }}
                            />
                            <ToolButton
                                tool={{
                                    id: 'save',
                                    icon: Save,
                                    label: 'Save (Ctrl+S)',
                                    action: () => {
                                        const data = {
                                            version: '1.5.3',
                                            name: 'My Whiteboard',
                                            author: settings.userName,
                                            timestamp: new Date().toISOString(),
                                            elements,
                                            background,
                                            viewport
                                        };
                                        saveWhiteboard(data, `cassini-${settings.userName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`);
                                    }
                                }}
                            />
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="toolbar-file-input"
                                    type="file"
                                    accept=".json"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            try {
                                                const data = await loadWhiteboard(file);
                                                if (data.elements) setElements(data.elements);
                                                if (data.background) updateBackground(data.background);
                                                if (data.viewport) setViewport(data.viewport);
                                                if (data.author) updateSettings({ userName: data.author });
                                            } catch (error) {
                                                alert(error.message);
                                            }
                                        }
                                        e.target.value = null; // Reset input
                                    }}
                                    style={{ display: 'none' }}
                                />
                                <ToolButton
                                    tool={{
                                        id: 'open',
                                        icon: FolderOpen,
                                        label: 'Open (Ctrl+O)',
                                        action: () => document.getElementById('toolbar-file-input').click()
                                    }}
                                />
                            </div>
                            <ToolButton
                                tool={{
                                    id: 'export',
                                    icon: Download,
                                    label: 'Export PNG',
                                    action: exportCanvasPNG
                                }}
                            />
                        </>
                    )}
                </div>

                {/* Drawing Tools Section */}
                <div style={{ display: 'flex', flexDirection: toolbarOrientation === 'horizontal' ? 'row' : 'column', gap: 4, alignItems: 'center' }}>
                    <SectionHeader label="Draw" isOpen={showDrawingTools} onToggle={() => setShowDrawingTools(!showDrawingTools)} icon={Pen} />
                    {showDrawingTools && drawingTools.map(tool => <ToolButton key={tool.id} tool={tool} />)}
                </div>

                {/* Shape Tools Section */}
                <div style={{ display: 'flex', flexDirection: toolbarOrientation === 'horizontal' ? 'row' : 'column', gap: 4, alignItems: 'center' }}>
                    <SectionHeader label="Shapes" isOpen={showShapeTools} onToggle={() => setShowShapeTools(!showShapeTools)} icon={Shapes} />
                    {showShapeTools && shapeTools.map(tool => <ToolButton key={tool.id} tool={tool} />)}
                    {showShapeTools && measureTools.map(tool => <ToolButton key={tool.id} tool={tool} />)}
                </div>

                <Divider />

                {/* Color Panel Section */}
                <div style={{ display: 'flex', flexDirection: toolbarOrientation === 'horizontal' ? 'row' : 'column', gap: 4, alignItems: 'center' }}>
                    <SectionHeader label="Color" isOpen={showColorPanel} onToggle={() => setShowColorPanel(!showColorPanel)} icon={Palette} />
                    {showColorPanel && (
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            {colors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => updateToolProperty('color', color)}
                                    style={{
                                        width: 24 * uiScale,
                                        height: 24 * uiScale,
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
                            <input
                                type="color"
                                value={toolProperties.color}
                                onChange={(e) => updateToolProperty('color', e.target.value)}
                                style={{
                                    width: 24 * uiScale,
                                    height: 24 * uiScale,
                                    borderRadius: '4px',
                                    border: '2px solid rgba(255, 255, 255, 0.3)',
                                    cursor: 'pointer',
                                    background: 'transparent'
                                }}
                                title="Custom Color"
                            />
                        </div>
                    )}
                </div>

                {/* Settings Section (Size/Opacity) */}
                <div style={{ display: 'flex', flexDirection: toolbarOrientation === 'horizontal' ? 'row' : 'column', gap: 4, alignItems: 'center' }}>
                    <SectionHeader label="Settings" isOpen={showSettings} onToggle={() => setShowSettings(!showSettings)} icon={Settings2} />
                    {showSettings && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 8px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <label style={{ fontSize: 10 * uiScale, color: settings.iconTheme === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)' }}>
                                    Size: {toolProperties.thickness}px
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={toolProperties.thickness}
                                    onChange={(e) => updateToolProperty('thickness', parseInt(e.target.value))}
                                    style={{ width: 80 * uiScale, accentColor: 'var(--accent-blue)' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <label style={{ fontSize: 10 * uiScale, color: settings.iconTheme === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)' }}>
                                    Opacity: {Math.round(toolProperties.opacity * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1"
                                    step="0.1"
                                    value={toolProperties.opacity}
                                    onChange={(e) => updateToolProperty('opacity', parseFloat(e.target.value))}
                                    style={{ width: 80 * uiScale, accentColor: 'var(--accent-blue)' }}
                                />
                            </div>
                            {['rectangle', 'circle'].includes(activeTool) && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <label style={{ fontSize: 10 * uiScale, color: settings.iconTheme === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)' }}>
                                        Fill: {Math.round(toolProperties.fillOpacity * 100)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={toolProperties.fillOpacity}
                                        onChange={(e) => updateToolProperty('fillOpacity', parseFloat(e.target.value))}
                                        style={{ width: 80 * uiScale, accentColor: 'var(--accent-blue)' }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <Divider />

                {/* Action Buttons - Always Visible */}
                <div style={{ display: 'flex', flexDirection: toolbarOrientation === 'horizontal' ? 'row' : 'column', gap: 4 }}>
                    <button className={`glass-button ${settings.iconTheme === 'light' ? 'light-icons' : ''}`} onClick={undo} title="Undo" style={{ width: baseSize, height: baseSize, padding: baseSize * 0.2 }}>
                        <Undo size={iconSize} />
                    </button>
                    <button className={`glass-button ${settings.iconTheme === 'light' ? 'light-icons' : ''}`} onClick={redo} title="Redo" style={{ width: baseSize, height: baseSize, padding: baseSize * 0.2 }}>
                        <Redo size={iconSize} />
                    </button>
                    <button className={`glass-button ${settings.iconTheme === 'light' ? 'light-icons' : ''}`} onClick={clearCanvas} title="Clear All" style={{ width: baseSize, height: baseSize, padding: baseSize * 0.2 }}>
                        <Trash2 size={iconSize} />
                    </button>
                </div>

                <Divider />

                {/* Export/Import/Grid - Always Visible */}
                <div style={{ display: 'flex', flexDirection: toolbarOrientation === 'horizontal' ? 'row' : 'column', gap: 4 }}>
                    <button className={`glass-button ${settings.iconTheme === 'light' ? 'light-icons' : ''}`} onClick={exportCanvasPNG} title="Export PNG" style={{ width: baseSize, height: baseSize, padding: baseSize * 0.2 }}>
                        <Download size={iconSize} />
                    </button>
                    <button className={`glass-button ${settings.iconTheme === 'light' ? 'light-icons' : ''}`} onClick={importImage} title="Import Image" style={{ width: baseSize, height: baseSize, padding: baseSize * 0.2 }}>
                        <Upload size={iconSize} />
                    </button>
                    <button className={`glass-button ${settings.iconTheme === 'light' ? 'light-icons' : ''}`} onClick={() => setShowBackgroundModal(true)} title="Background" style={{ width: baseSize, height: baseSize, padding: baseSize * 0.2 }}>
                        <Grid size={iconSize} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toolbar;
