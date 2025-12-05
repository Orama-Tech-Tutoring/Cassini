import React from 'react';
import {
    Trash2,
    AlignLeft,
    AlignCenterHorizontal,
    AlignRight,
    AlignStartVertical,
    AlignCenterVertical,
    AlignEndVertical,
    ArrowUpToLine,
    ArrowDownToLine,
    Layers,
    GripHorizontal,
    GripVertical
} from 'lucide-react';
import { useWhiteboard } from '../context/WhiteboardContext';

const SelectionToolbar = ({ selectedElements, onDelete, onUpdateElements }) => {
    const { elements, setElements } = useWhiteboard();

    if (!selectedElements || selectedElements.length === 0) return null;

    // Get bounds of selected elements
    const getBounds = (elements) => {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        elements.forEach(el => {
            const x = el.x || (el.points ? Math.min(...el.points.map(p => p.x)) : 0);
            const y = el.y || (el.points ? Math.min(...el.points.map(p => p.y)) : 0);
            const width = el.width || (el.points ? Math.max(...el.points.map(p => p.x)) - x : 0);
            const height = el.height || (el.points ? Math.max(...el.points.map(p => p.y)) - y : 0);

            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + width);
            maxY = Math.max(maxY, y + height);
        });
        return { minX, minY, maxX, maxY };
    };

    // Alignment functions - use batch updates
    const alignLeft = () => {
        const bounds = getBounds(selectedElements);
        const selectedIds = selectedElements.map(el => el.id);
        setElements(prev => prev.map(el => {
            if (!selectedIds.includes(el.id)) return el;
            if (el.points) {
                const offset = bounds.minX - Math.min(...el.points.map(p => p.x));
                return { ...el, points: el.points.map(p => ({ ...p, x: p.x + offset })) };
            }
            return { ...el, x: bounds.minX };
        }));
    };

    const alignCenterH = () => {
        const bounds = getBounds(selectedElements);
        const centerX = (bounds.minX + bounds.maxX) / 2;
        const selectedIds = selectedElements.map(el => el.id);
        setElements(prev => prev.map(el => {
            if (!selectedIds.includes(el.id)) return el;
            if (el.points) {
                const elBounds = getBounds([el]);
                const elCenterX = (elBounds.minX + elBounds.maxX) / 2;
                const offset = centerX - elCenterX;
                return { ...el, points: el.points.map(p => ({ ...p, x: p.x + offset })) };
            }
            const elWidth = el.width || 0;
            return { ...el, x: centerX - elWidth / 2 };
        }));
    };

    const alignRight = () => {
        const bounds = getBounds(selectedElements);
        const selectedIds = selectedElements.map(el => el.id);
        setElements(prev => prev.map(el => {
            if (!selectedIds.includes(el.id)) return el;
            if (el.points) {
                const elMaxX = Math.max(...el.points.map(p => p.x));
                const offset = bounds.maxX - elMaxX;
                return { ...el, points: el.points.map(p => ({ ...p, x: p.x + offset })) };
            }
            const elWidth = el.width || 0;
            return { ...el, x: bounds.maxX - elWidth };
        }));
    };

    const alignTop = () => {
        const bounds = getBounds(selectedElements);
        const selectedIds = selectedElements.map(el => el.id);
        setElements(prev => prev.map(el => {
            if (!selectedIds.includes(el.id)) return el;
            if (el.points) {
                const offset = bounds.minY - Math.min(...el.points.map(p => p.y));
                return { ...el, points: el.points.map(p => ({ ...p, y: p.y + offset })) };
            }
            return { ...el, y: bounds.minY };
        }));
    };

    const alignCenterV = () => {
        const bounds = getBounds(selectedElements);
        const centerY = (bounds.minY + bounds.maxY) / 2;
        const selectedIds = selectedElements.map(el => el.id);
        setElements(prev => prev.map(el => {
            if (!selectedIds.includes(el.id)) return el;
            if (el.points) {
                const elBounds = getBounds([el]);
                const elCenterY = (elBounds.minY + elBounds.maxY) / 2;
                const offset = centerY - elCenterY;
                return { ...el, points: el.points.map(p => ({ ...p, y: p.y + offset })) };
            }
            const elHeight = el.height || 0;
            return { ...el, y: centerY - elHeight / 2 };
        }));
    };

    const alignBottom = () => {
        const bounds = getBounds(selectedElements);
        const selectedIds = selectedElements.map(el => el.id);
        setElements(prev => prev.map(el => {
            if (!selectedIds.includes(el.id)) return el;
            if (el.points) {
                const elMaxY = Math.max(...el.points.map(p => p.y));
                const offset = bounds.maxY - elMaxY;
                return { ...el, points: el.points.map(p => ({ ...p, y: p.y + offset })) };
            }
            const elHeight = el.height || 0;
            return { ...el, y: bounds.maxY - elHeight };
        }));
    };

    // Z-Order functions
    const bringToFront = () => {
        const selectedIds = selectedElements.map(el => el.id);
        setElements(prev => {
            const other = prev.filter(el => !selectedIds.includes(el.id));
            const selected = prev.filter(el => selectedIds.includes(el.id));
            return [...other, ...selected];
        });
    };

    const sendToBack = () => {
        const selectedIds = selectedElements.map(el => el.id);
        setElements(prev => {
            const other = prev.filter(el => !selectedIds.includes(el.id));
            const selected = prev.filter(el => selectedIds.includes(el.id));
            return [...selected, ...other];
        });
    };

    // Distribute functions
    const distributeHorizontal = () => {
        if (selectedElements.length < 3) return;

        // Get element bounds and sort by x position
        const elementsWithBounds = selectedElements.map(el => {
            const bounds = getBounds([el]);
            return { ...el, bounds };
        }).sort((a, b) => a.bounds.minX - b.bounds.minX);

        const totalBounds = getBounds(selectedElements);
        const totalWidth = elementsWithBounds.reduce((sum, el) =>
            sum + (el.bounds.maxX - el.bounds.minX), 0);
        const spacing = (totalBounds.maxX - totalBounds.minX - totalWidth) / (elementsWithBounds.length - 1);

        let currentX = totalBounds.minX;
        const updates = {};

        elementsWithBounds.forEach(el => {
            const elWidth = el.bounds.maxX - el.bounds.minX;
            const offset = currentX - el.bounds.minX;
            updates[el.id] = offset;
            currentX += elWidth + spacing;
        });

        setElements(prev => prev.map(el => {
            if (updates[el.id] === undefined) return el;
            const offset = updates[el.id];
            if (el.points) {
                return { ...el, points: el.points.map(p => ({ ...p, x: p.x + offset })) };
            }
            return { ...el, x: (el.x || 0) + offset };
        }));
    };

    const distributeVertical = () => {
        if (selectedElements.length < 3) return;

        // Get element bounds and sort by y position
        const elementsWithBounds = selectedElements.map(el => {
            const bounds = getBounds([el]);
            return { ...el, bounds };
        }).sort((a, b) => a.bounds.minY - b.bounds.minY);

        const totalBounds = getBounds(selectedElements);
        const totalHeight = elementsWithBounds.reduce((sum, el) =>
            sum + (el.bounds.maxY - el.bounds.minY), 0);
        const spacing = (totalBounds.maxY - totalBounds.minY - totalHeight) / (elementsWithBounds.length - 1);

        let currentY = totalBounds.minY;
        const updates = {};

        elementsWithBounds.forEach(el => {
            const elHeight = el.bounds.maxY - el.bounds.minY;
            const offset = currentY - el.bounds.minY;
            updates[el.id] = offset;
            currentY += elHeight + spacing;
        });

        setElements(prev => prev.map(el => {
            if (updates[el.id] === undefined) return el;
            const offset = updates[el.id];
            if (el.points) {
                return { ...el, points: el.points.map(p => ({ ...p, y: p.y + offset })) };
            }
            return { ...el, y: (el.y || 0) + offset };
        }));
    };

    const showAlignTools = selectedElements.length > 1;
    const showDistributeTools = selectedElements.length > 2;

    return (
        <div
            className="glass"
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 2000,
                padding: '12px 16px',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minWidth: '200px',
                pointerEvents: 'auto'
            }}
        >
            {/* Header with count */}
            <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <Layers size={14} />
                {selectedElements.length} element{selectedElements.length !== 1 ? 's' : ''} selected
            </div>

            {/* Alignment Tools - only show when multiple selected */}
            {showAlignTools && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase' }}>
                        Align
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <ToolButton onClick={alignLeft} title="Align Left">
                            <AlignLeft size={16} />
                        </ToolButton>
                        <ToolButton onClick={alignCenterH} title="Align Center">
                            <AlignCenterHorizontal size={16} />
                        </ToolButton>
                        <ToolButton onClick={alignRight} title="Align Right">
                            <AlignRight size={16} />
                        </ToolButton>
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />
                        <ToolButton onClick={alignTop} title="Align Top">
                            <AlignStartVertical size={16} />
                        </ToolButton>
                        <ToolButton onClick={alignCenterV} title="Align Middle">
                            <AlignCenterVertical size={16} />
                        </ToolButton>
                        <ToolButton onClick={alignBottom} title="Align Bottom">
                            <AlignEndVertical size={16} />
                        </ToolButton>
                    </div>
                </div>
            )}

            {/* Distribute Tools - only show when 3+ selected */}
            {showDistributeTools && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase' }}>
                        Distribute
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <ToolButton onClick={distributeHorizontal} title="Distribute Horizontally">
                            <GripHorizontal size={16} />
                        </ToolButton>
                        <ToolButton onClick={distributeVertical} title="Distribute Vertically">
                            <GripVertical size={16} />
                        </ToolButton>
                    </div>
                </div>
            )}

            {/* Z-Order Tools */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase' }}>
                    Order
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <ToolButton onClick={bringToFront} title="Bring to Front">
                        <ArrowUpToLine size={16} />
                    </ToolButton>
                    <ToolButton onClick={sendToBack} title="Send to Back">
                        <ArrowDownToLine size={16} />
                    </ToolButton>
                </div>
            </div>

            {/* Delete Button */}
            <button
                className="glass-button"
                onClick={onDelete}
                title="Delete Selected"
                style={{
                    width: '100%',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'rgba(255, 45, 85, 0.2)',
                    color: '#FF2D55',
                    fontWeight: 500,
                    fontSize: '13px'
                }}
            >
                <Trash2 size={16} />
                Delete
            </button>
        </div>
    );
};

// Helper component for tool buttons
const ToolButton = ({ children, onClick, title, active }) => (
    <button
        className="glass-button"
        onClick={onClick}
        title={title}
        style={{
            width: '32px',
            height: '32px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: active ? 'rgba(0, 122, 255, 0.3)' : 'transparent'
        }}
    >
        {children}
    </button>
);

export default SelectionToolbar;
