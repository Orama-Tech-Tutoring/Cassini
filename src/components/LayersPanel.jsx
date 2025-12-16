import React, { useState } from 'react';
import { useWhiteboard } from '../context/WhiteboardContext';
import {
    Eye,
    EyeOff,
    Layers,
    X,
    GripVertical,
    ChevronRight,
    ChevronLeft,
    Trash2
} from 'lucide-react';

const LayersPanel = ({ selectedElements, setSelectedElements, onDeleteElement }) => {
    const { elements, updateElement, setElements } = useWhiteboard();
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [draggedIndex, setDraggedIndex] = useState(null);

    // Get layer name or generate default
    const getLayerName = (element, index) => {
        if (element.name) return element.name;
        const typeNames = {
            stroke: 'Stroke',
            rectangle: 'Rectangle',
            circle: 'Circle',
            line: 'Line',
            arrow: 'Arrow',
            text: 'Text',
            image: 'Image',
            equation: 'Equation'
        };
        return `${typeNames[element.type] || 'Element'} ${index + 1}`;
    };

    // Toggle layer visibility
    const toggleVisibility = (id) => {
        updateElement(id, { visible: elements.find(el => el.id === id)?.visible === false ? true : false });
    };

    // Start editing layer name
    const startEditing = (element, index) => {
        setEditingId(element.id);
        setEditName(element.name || getLayerName(element, index));
    };

    // Save layer name
    const saveName = () => {
        if (editingId && editName.trim()) {
            updateElement(editingId, { name: editName.trim() });
        }
        setEditingId(null);
        setEditName('');
    };

    // Handle drag start
    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    // Handle drag over
    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
    };

    // Handle drop - reorder layers
    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const newElements = [...elements];
        const [draggedItem] = newElements.splice(draggedIndex, 1);
        newElements.splice(dropIndex, 0, draggedItem);
        setElements(newElements);
        setDraggedIndex(null);
    };

    // Update opacity
    const handleOpacityChange = (id, opacity) => {
        updateElement(id, { opacity: parseFloat(opacity) });
    };

    // Check if element is selected
    const isSelected = (id) => selectedElements.some(el => el.id === id);

    // Toggle element selection
    const toggleSelection = (element) => {
        if (isSelected(element.id)) {
            setSelectedElements(selectedElements.filter(el => el.id !== element.id));
        } else {
            setSelectedElements([...selectedElements, element]);
        }
    };

    if (!isOpen) {
        return (
            <button
                className="glass-button"
                onClick={() => setIsOpen(true)}
                title="Open Layers (L)"
                style={{
                    position: 'fixed',
                    right: 20,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    borderRadius: '50%'
                }}
            >
                <Layers size={24} />
            </button>
        );
    }

    return (
        <div
            className="glass"
            style={{
                position: 'fixed',
                right: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 280,
                maxHeight: '70vh',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1000,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden'
            }}
        >
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Layers size={18} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Layers</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                        ({elements.length})
                    </span>
                </div>
                <button
                    className="glass-button"
                    onClick={() => setIsOpen(false)}
                    style={{ width: 28, height: 28, padding: 4 }}
                >
                    <X size={16} />
                </button>
            </div>

            {/* Layer List */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '8px 0'
            }}>
                {elements.length === 0 ? (
                    <div style={{
                        padding: 16,
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: 13
                    }}>
                        No layers yet
                    </div>
                ) : (
                    // Reverse to show top layer first
                    [...elements].reverse().map((element, reversedIndex) => {
                        const actualIndex = elements.length - 1 - reversedIndex;
                        const isHidden = element.visible === false;
                        const selected = isSelected(element.id);

                        return (
                            <div
                                key={element.id}
                                draggable
                                onDragStart={() => handleDragStart(actualIndex)}
                                onDragOver={(e) => handleDragOver(e, actualIndex)}
                                onDrop={(e) => handleDrop(e, actualIndex)}
                                onClick={() => toggleSelection(element)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '8px 12px',
                                    margin: '2px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: selected
                                        ? 'rgba(0, 122, 255, 0.3)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s ease',
                                    opacity: isHidden ? 0.5 : 1
                                }}
                            >
                                {/* Drag Handle */}
                                <GripVertical
                                    size={14}
                                    style={{ cursor: 'grab', color: 'rgba(255,255,255,0.4)' }}
                                />

                                {/* Visibility Toggle */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleVisibility(element.id);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 2,
                                        display: 'flex',
                                        color: isHidden ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.8)'
                                    }}
                                    title={isHidden ? 'Show Layer' : 'Hide Layer'}
                                >
                                    {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>

                                {/* Layer Name */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {editingId === element.id ? (
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            onBlur={saveName}
                                            onKeyDown={(e) => e.key === 'Enter' && saveName()}
                                            onClick={(e) => e.stopPropagation()}
                                            autoFocus
                                            style={{
                                                width: '100%',
                                                background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: 4,
                                                padding: '2px 6px',
                                                color: 'white',
                                                fontSize: 12
                                            }}
                                        />
                                    ) : (
                                        <span
                                            onDoubleClick={(e) => {
                                                e.stopPropagation();
                                                startEditing(element, actualIndex);
                                            }}
                                            style={{
                                                fontSize: 12,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: 'block'
                                            }}
                                            title="Double-click to rename"
                                        >
                                            {getLayerName(element, actualIndex)}
                                        </span>
                                    )}
                                </div>

                                {/* Opacity Slider (compact) */}
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1"
                                    step="0.1"
                                    value={element.opacity || 1}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        handleOpacityChange(element.id, e.target.value);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ width: 50, cursor: 'pointer' }}
                                    title={`Opacity: ${Math.round((element.opacity || 1) * 100)}%`}
                                />

                                {/* Delete */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteElement(element.id);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 2,
                                        display: 'flex',
                                        color: 'rgba(255,100,100,0.7)'
                                    }}
                                    title="Delete Layer"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer hint */}
            <div style={{
                padding: '8px 16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
                textAlign: 'center'
            }}>
                Press L to toggle • Drag to reorder
            </div>
        </div>
    );
};

export default LayersPanel;
