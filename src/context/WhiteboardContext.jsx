import React, { createContext, useContext, useState, useCallback } from 'react';

const WhiteboardContext = createContext();

export const useWhiteboard = () => {
    const context = useContext(WhiteboardContext);
    if (!context) {
        throw new Error('useWhiteboard must be used within WhiteboardProvider');
    }
    return context;
};

export const WhiteboardProvider = ({ children }) => {
    // Tool state
    const [activeTool, setActiveTool] = useState('pen');
    const [toolProperties, setToolProperties] = useState({
        color: '#007AFF',
        fillColor: '#007AFF',
        thickness: 3,
        opacity: 1,
        fillOpacity: 0.5,
        fontSize: 16,
        fontFamily: 'Inter'
    });

    // Canvas elements
    const [elements, setElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);

    // Ruler and Protractor
    const [ruler, setRuler] = useState(null);
    const [protractor, setProtractor] = useState(null);

    // History for undo/redo
    const [history, setHistory] = useState([[]]);
    const [historyStep, setHistoryStep] = useState(0);

    // Modals
    const [showEquationModal, setShowEquationModal] = useState(false);
    const [showTextModal, setShowTextModal] = useState(false);
    const [showBackgroundModal, setShowBackgroundModal] = useState(false);

    // Viewport state for Infinite Canvas
    const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });

    // Canvas reference for export
    const [canvasRef, setCanvasRef] = useState(null);

    // Clipboard for copy/paste
    const [clipboard, setClipboard] = useState([]);

    // Background and grid settings
    const [background, setBackground] = useState({
        gridType: 'none', // 'none' | 'dots' | 'lines' | 'squares'
        gridSize: 40,
        gridColor: 'rgba(200, 200, 200, 0.3)',
        backgroundColor: '#1a1a1a' // Dark background to match Liquid Glass aesthetic
    });

    const zoomIn = useCallback(() => {
        setViewport(prev => ({ ...prev, scale: Math.min(prev.scale * 1.1, 5) }));
    }, []);

    const zoomOut = useCallback(() => {
        setViewport(prev => ({ ...prev, scale: Math.max(prev.scale / 1.1, 0.1) }));
    }, []);

    const resetZoom = useCallback(() => {
        setViewport({ x: 0, y: 0, scale: 1 });
    }, []);

    const updateToolProperty = useCallback((property, value) => {
        setToolProperties(prev => ({ ...prev, [property]: value }));
    }, []);

    const addElement = useCallback((element) => {
        setElements(prev => {
            const newElements = [...prev, element];
            setHistory(h => [...h.slice(0, historyStep + 1), newElements]);
            setHistoryStep(s => s + 1);
            return newElements;
        });
    }, [historyStep]);

    const updateElement = useCallback((id, updates) => {
        setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
    }, []);

    const deleteElement = useCallback((id) => {
        setElements(prev => {
            const newElements = prev.filter(el => el.id !== id);
            setHistory(h => [...h.slice(0, historyStep + 1), newElements]);
            setHistoryStep(s => s + 1);
            return newElements;
        });
    }, [historyStep]);

    const undo = useCallback(() => {
        if (historyStep > 0) {
            setHistoryStep(s => s - 1);
            setElements(history[historyStep - 1]);
        }
    }, [historyStep, history]);

    const redo = useCallback(() => {
        if (historyStep < history.length - 1) {
            setHistoryStep(s => s + 1);
            setElements(history[historyStep + 1]);
        }
    }, [historyStep, history]);

    const clearCanvas = useCallback(() => {
        setElements([]);
        setHistory([[]]);
        setHistoryStep(0);
        setRuler(null);
        setProtractor(null);
    }, []);

    const exportCanvasPNG = useCallback(() => {
        if (!canvasRef) return;

        // Create a temporary canvas to export
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasRef.width;
        tempCanvas.height = canvasRef.height;
        const tempCtx = tempCanvas.getContext('2d');

        // Fill white background
        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Copy current canvas
        tempCtx.drawImage(canvasRef, 0, 0);

        // Trigger download
        const link = document.createElement('a');
        link.download = `cassini-export-${Date.now()}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    }, [canvasRef]);

    const importImage = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    addElement({
                        id: Date.now(),
                        type: 'image',
                        src: event.target.result,
                        x: 100,
                        y: 100,
                        width: img.width,
                        height: img.height,
                        originalWidth: img.width,
                        originalHeight: img.height
                    });
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        };
        input.click();
    }, [addElement]);

    // Clipboard operations
    const copyElements = useCallback((elementsToCopy) => {
        setClipboard(elementsToCopy.map(el => ({ ...el })));
    }, []);

    const pasteElements = useCallback(() => {
        if (clipboard.length === 0) return;

        const pastedElements = clipboard.map(el => ({
            ...el,
            id: Date.now() + Math.random(), // New ID
            x: el.x + 20, // Offset for visibility
            y: el.y + 20
        }));

        setElements(prev => {
            const newElements = [...prev, ...pastedElements];
            setHistory(h => [...h.slice(0, historyStep + 1), newElements]);
            setHistoryStep(s => s + 1);
            return newElements;
        });

        return pastedElements;
    }, [clipboard, historyStep]);

    const duplicateElements = useCallback((elementsToDup) => {
        const duplicated = elementsToDup.map(el => ({
            ...el,
            id: Date.now() + Math.random(),
            x: el.x + 20,
            y: el.y + 20
        }));

        setElements(prev => {
            const newElements = [...prev, ...duplicated];
            setHistory(h => [...h.slice(0, historyStep + 1), newElements]);
            setHistoryStep(s => s + 1);
            return newElements;
        });

        return duplicated;
    }, [historyStep]);

    const selectAll = useCallback(() => {
        return elements;
    }, [elements]);

    const deselectAll = useCallback(() => {
        return [];
    }, []);

    const updateBackground = useCallback((settings) => {
        setBackground(prev => ({ ...prev, ...settings }));
    }, []);

    const value = {
        activeTool,
        setActiveTool,
        toolProperties,
        updateToolProperty,
        elements,
        setElements,
        addElement,
        updateElement,
        deleteElement,
        selectedElement,
        setSelectedElement,
        ruler,
        setRuler,
        protractor,
        setProtractor,
        history,
        historyStep,
        undo,
        redo,
        clearCanvas,
        showEquationModal,
        setShowEquationModal,
        showTextModal,
        setShowTextModal,
        viewport,
        setViewport,
        zoomIn,
        zoomOut,
        resetZoom,
        canvasRef,
        setCanvasRef,
        exportCanvasPNG,
        importImage,
        copyElements,
        pasteElements,
        duplicateElements,
        selectAll,
        deselectAll,
        background,
        updateBackground,
        showBackgroundModal,
        setShowBackgroundModal
    };

    return (
        <WhiteboardContext.Provider value={value}>
            {children}
        </WhiteboardContext.Provider>
    );
};
