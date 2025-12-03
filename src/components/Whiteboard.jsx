import React, { useRef, useEffect, useState } from 'react';
import { useWhiteboard } from '../context/WhiteboardContext';
import { snapToRulerEdge, pointInRect } from '../utils/geometry';
import SelectionActionMenu from './SelectionActionMenu';

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const currentPathRef = useRef([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [draggedElement, setDraggedElement] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [selectionBox, setSelectionBox] = useState(null);
    const [selectedElements, setSelectedElements] = useState([]);
    const [isErasing, setIsErasing] = useState(false);
    const [isPanning, setIsPanning] = useState(false);
    const [currentShape, setCurrentShape] = useState(null); // For shape preview

    const {
        activeTool,
        setActiveTool,
        toolProperties,
        elements,
        addElement,
        updateElement,
        deleteElement,
        ruler,
        setRuler,
        protractor,
        setProtractor,
        selectedElement,
        setSelectedElement,
        viewport,
        setViewport,
        setCanvasRef,
        undo,
        redo
    } = useWhiteboard();

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            redrawCanvas();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Register canvas with context for export
    useEffect(() => {
        if (canvasRef.current) {
            setCanvasRef(canvasRef.current);
        }
    }, [setCanvasRef]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if typing in input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            // Tool shortcuts (only if not using Ctrl/Cmd)
            if (!e.ctrlKey && !e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'p':
                        setActiveTool('pen');
                        break;
                    case 'e':
                        setActiveTool('eraser');
                        break;
                    case 's':
                    case 'v':
                        setActiveTool('select');
                        break;
                    case 'r':
                        setActiveTool('rectangle');
                        break;
                    case 'c':
                        setActiveTool('circle');
                        break;
                    case 'l':
                        setActiveTool('line');
                        break;
                    case 'a':
                        setActiveTool('arrow');
                        break;
                    default:
                        break;
                }
            }

            // Undo/Redo with Ctrl/Cmd
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    undo();
                } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
                    e.preventDefault();
                    redo();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setActiveTool, undo, redo]);

    // Redraw canvas whenever elements change
    useEffect(() => {
        redrawCanvas();
    }, [elements, ruler, protractor, selectedElements, selectionBox, viewport, currentShape]);

    // Handle Zoom
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleWheel = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const zoomSensitivity = 0.001;
                const delta = -e.deltaY * zoomSensitivity;
                const newScale = Math.min(Math.max(viewport.scale + delta, 0.1), 5);

                // Zoom towards pointer
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                const scaleRatio = newScale / viewport.scale;
                const newX = mouseX - (mouseX - viewport.x) * scaleRatio;
                const newY = mouseY - (mouseY - viewport.y) * scaleRatio;

                setViewport({ x: newX, y: newY, scale: newScale });
            }
        };

        canvas.addEventListener('wheel', handleWheel, { passive: false });
        return () => canvas.removeEventListener('wheel', handleWheel);
    }, [viewport]);



    const drawStroke = (ctx, element) => {
        if (!element.points || element.points.length === 0) return;

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = element.color;
        ctx.globalAlpha = element.opacity;

        // If we have pressure data, draw segments with varying width
        if (element.points[0].pressure !== undefined) {
            for (let i = 1; i < element.points.length; i++) {
                const p1 = element.points[i - 1];
                const p2 = element.points[i];

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);

                // Calculate thickness based on pressure
                const pressure = p2.pressure || 0.5;
                const dynamicThickness = Math.max(1, element.thickness * pressure * 2);

                ctx.lineWidth = dynamicThickness;
                ctx.stroke();
            }
        } else {
            // Fallback for old strokes without pressure
            ctx.beginPath();
            ctx.lineWidth = element.thickness;
            ctx.moveTo(element.points[0].x, element.points[0].y);
            for (let i = 1; i < element.points.length; i++) {
                ctx.lineTo(element.points[i].x, element.points[i].y);
            }
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
    };

    const drawText = (ctx, element) => {
        ctx.font = `${element.fontSize}px ${element.fontFamily}`;
        ctx.fillStyle = element.color;
        ctx.globalAlpha = element.opacity || 1;
        ctx.fillText(element.text, element.x, element.y);
        ctx.globalAlpha = 1;
    };

    const drawEquation = (ctx, element) => {
        if (element.html) {
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.fontSize = `${element.fontSize}px`;
            tempDiv.style.color = element.color;
            tempDiv.innerHTML = element.html;
            document.body.appendChild(tempDiv);

            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${element.width}" height="${element.height}">
                    <foreignObject width="100%" height="100%">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: ${element.fontSize}px; color: ${element.color}; padding: 10px;">
                            ${element.html}
                        </div>
                    </foreignObject>
                </svg>
            `;

            const img = new Image();
            const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            img.onload = () => {
                ctx.globalAlpha = element.opacity || 1;
                ctx.drawImage(img, element.x, element.y, element.width, element.height);
                ctx.globalAlpha = 1;
                URL.revokeObjectURL(url);
                document.body.removeChild(tempDiv);
            };

            img.src = url;
        }
    };

    const drawShape = (ctx, element) => {
        ctx.save();
        ctx.strokeStyle = element.color;
        ctx.lineWidth = element.thickness;
        ctx.globalAlpha = element.opacity;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (element.type === 'rectangle') {
            ctx.strokeRect(element.x, element.y, element.width, element.height);
        } else if (element.type === 'circle') {
            ctx.beginPath();
            ctx.ellipse(
                element.x + element.width / 2,
                element.y + element.height / 2,
                Math.abs(element.width / 2),
                Math.abs(element.height / 2),
                0, 0, 2 * Math.PI
            );
            ctx.stroke();
        } else if (element.type === 'line') {
            ctx.beginPath();
            ctx.moveTo(element.x, element.y);
            ctx.lineTo(element.x + element.width, element.y + element.height);
            ctx.stroke();
        } else if (element.type === 'arrow') {
            const startX = element.x;
            const startY = element.y;
            const endX = element.x + element.width;
            const endY = element.y + element.height;

            // Draw line
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Draw arrowhead
            const angle = Math.atan2(endY - startY, endX - startX);
            const headLength = element.thickness * 4;

            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
            ctx.lineTo(endX, endY);
            ctx.fillStyle = element.color;
            ctx.fill();
        }
        ctx.restore();
    };

    const drawImage = (ctx, element) => {
        const img = new Image();
        img.onload = () => {
            ctx.save();
            ctx.globalAlpha = element.opacity || 1;
            ctx.drawImage(img, element.x, element.y, element.width, element.height);
            ctx.globalAlpha = 1;
            ctx.restore();
        };
        img.src = element.src;
    };

    const drawRuler = (ctx, ruler) => {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.fillRect(ruler.x, ruler.y, ruler.width, ruler.height);
        ctx.strokeRect(ruler.x, ruler.y, ruler.width, ruler.height);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        const markCount = 20;
        for (let i = 0; i <= markCount; i++) {
            const x = ruler.x + (ruler.width / markCount) * i;
            const markHeight = i % 5 === 0 ? 15 : 8;
            ctx.beginPath();
            ctx.moveTo(x, ruler.y);
            ctx.lineTo(x, ruler.y + markHeight);
            ctx.stroke();

            if (i % 5 === 0) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = '10px Inter';
                ctx.fillText(i.toString(), x - 5, ruler.y + 25);
            }
        }
        ctx.restore();
    };

    const drawProtractor = (ctx, protractor) => {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(protractor.x, protractor.y, protractor.radius, 0, Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.font = '10px Inter';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

        for (let angle = 0; angle <= 180; angle += 10) {
            const rad = (angle * Math.PI) / 180;
            const x1 = protractor.x + Math.cos(rad) * protractor.radius;
            const y1 = protractor.y + Math.sin(rad) * protractor.radius;
            const markLength = angle % 30 === 0 ? 15 : 8;
            const x2 = protractor.x + Math.cos(rad) * (protractor.radius - markLength);
            const y2 = protractor.y + Math.sin(rad) * (protractor.radius - markLength);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            if (angle % 30 === 0) {
                const textX = protractor.x + Math.cos(rad) * (protractor.radius - 25);
                const textY = protractor.y + Math.sin(rad) * (protractor.radius - 25);
                ctx.fillText(angle.toString(), textX - 10, textY + 5);
            }
        }
        ctx.restore();
    };

    const getStrokeBounds = (element) => {
        if (!element.points || element.points.length === 0) return null;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        element.points.forEach(p => {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        });

        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    };

    const drawSelectionBox = (ctx, element) => {
        let bounds;
        if (element.type === 'stroke') {
            bounds = getStrokeBounds(element);
        } else if (element.type === 'text') {
            ctx.font = `${element.fontSize}px ${element.fontFamily} `;
            const metrics = ctx.measureText(element.text);
            bounds = {
                x: element.x,
                y: element.y - element.fontSize,
                width: metrics.width,
                height: element.fontSize
            };
        } else if (element.type === 'equation') {
            bounds = {
                x: element.x,
                y: element.y,
                width: element.width,
                height: element.height
            };
        } else if (['rectangle', 'circle', 'line', 'arrow'].includes(element.type)) {
            bounds = {
                x: Math.min(element.x, element.x + element.width),
                y: Math.min(element.y, element.y + element.height),
                width: Math.abs(element.width),
                height: Math.abs(element.height)
            };
        } else if (element.type === 'image') {
            bounds = {
                x: element.x,
                y: element.y,
                width: element.width,
                height: element.height
            };
        }

        if (bounds) {
            ctx.strokeStyle = '#007AFF';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(bounds.x - 5, bounds.y - 5, bounds.width + 10, bounds.height + 10);
            ctx.setLineDash([]);
        }
    };

    const redrawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(viewport.x, viewport.y);
        ctx.scale(viewport.scale, viewport.scale);

        // Draw all elements
        elements.forEach(element => {
            if (element.type === 'stroke') {
                drawStroke(ctx, element);
            } else if (element.type === 'text') {
                drawText(ctx, element);
            } else if (element.type === 'equation') {
                drawEquation(ctx, element);
            } else if (['rectangle', 'circle', 'line', 'arrow'].includes(element.type)) {
                drawShape(ctx, element);
            } else if (element.type === 'image') {
                drawImage(ctx, element);
            }
        });

        // Draw current shape preview
        if (currentShape) {
            drawShape(ctx, currentShape);
        }

        // Draw ruler and protractor
        if (ruler) drawRuler(ctx, ruler);
        if (protractor) drawProtractor(ctx, protractor);

        // Draw selection boxes
        selectedElements.forEach(el => drawSelectionBox(ctx, el));

        // Draw selection box while dragging
        if (selectionBox) {
            ctx.strokeStyle = '#007AFF';
            ctx.lineWidth = 2 / viewport.scale; // Keep line width constant on screen
            ctx.setLineDash([5 / viewport.scale, 5 / viewport.scale]);
            ctx.strokeRect(selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height);
            ctx.setLineDash([]);
        }

        ctx.restore();
    };

    const getPointerPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left - viewport.x) / viewport.scale,
            y: (e.clientY - rect.top - viewport.y) / viewport.scale,
            pressure: e.pressure !== undefined ? e.pressure : 0.5
        };
    };

    const isPointNearElement = (pos, element) => {
        if (element.type === 'stroke') {
            return element.points.some(p =>
                Math.hypot(p.x - pos.x, p.y - pos.y) < toolProperties.thickness + 10
            );
        } else if (element.type === 'text') {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.font = `${element.fontSize}px ${element.fontFamily} `;
            const metrics = ctx.measureText(element.text);
            return pointInRect(pos.x, pos.y, {
                x: element.x,
                y: element.y - element.fontSize,
                width: metrics.width,
                height: element.fontSize
            });
        } else if (element.type === 'equation') {
            return pointInRect(pos.x, pos.y, {
                x: element.x,
                y: element.y,
                width: element.width,
                height: element.height
            });
        } else if (['rectangle', 'circle', 'line', 'arrow'].includes(element.type)) {
            // Simple bounding box check for shapes
            const minX = Math.min(element.x, element.x + element.width);
            const maxX = Math.max(element.x, element.x + element.width);
            const minY = Math.min(element.y, element.y + element.height);
            const maxY = Math.max(element.y, element.y + element.height);

            // Add padding for easier selection
            return pos.x >= minX - 10 && pos.x <= maxX + 10 &&
                pos.y >= minY - 10 && pos.y <= maxY + 10;
        } else if (element.type === 'image') {
            return pointInRect(pos.x, pos.y, {
                x: element.x,
                y: element.y,
                width: element.width,
                height: element.height
            });
        }
        return false;
    };

    const handlePointerDown = (e) => {
        e.target.setPointerCapture(e.pointerId);
        const pos = getPointerPos(e);

        // TOUCH INPUT: Force Pan
        if (e.pointerType === 'touch') {
            setDragOffset({ x: e.clientX, y: e.clientY });
            setIsPanning(true);
            return;
        }

        // MOUSE/PEN INPUT: Tool Logic
        if (activeTool === 'select') {
            const clickedElement = elements.find(el => isPointNearElement(pos, el));
            if (!clickedElement) {
                // Start panning
                setDragOffset({ x: e.clientX, y: e.clientY }); // Store screen coords for panning
                setIsDrawing(true); // Reuse isDrawing for panning state
                return;
            }
        }

        if (activeTool === 'pen') {
            setIsDrawing(true);
            // Initialize path with pressure in ref
            currentPathRef.current = [{ ...pos, pressure: e.pressure || 0.5 }];

            // Draw initial point
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.fillStyle = toolProperties.color;
            ctx.globalAlpha = toolProperties.opacity;
            ctx.arc(pos.x, pos.y, toolProperties.thickness / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

        } else if (activeTool === 'eraser') {
            setIsErasing(true);
            const elementToDelete = elements.find(el => isPointNearElement(pos, el));
            if (elementToDelete) {
                deleteElement(elementToDelete.id);
            }
        } else if (activeTool === 'select') {
            const clickedElement = elements.find(el => isPointNearElement(pos, el));

            if (clickedElement) {
                if (e.shiftKey) {
                    setSelectedElements(prev =>
                        prev.includes(clickedElement)
                            ? prev.filter(el => el.id !== clickedElement.id)
                            : [...prev, clickedElement]
                    );
                } else {
                    setSelectedElement(clickedElement);
                    setSelectedElements([clickedElement]);
                    setDraggedElement(clickedElement);

                    // Set drag offset based on element type
                    if (clickedElement.type === 'stroke' && clickedElement.points.length > 0) {
                        setDragOffset({
                            x: pos.x - clickedElement.points[0].x,
                            y: pos.y - clickedElement.points[0].y
                        });
                    } else {
                        setDragOffset({ x: pos.x - clickedElement.x, y: pos.y - clickedElement.y });
                    }
                }
            } else {
                // Start selection box
                setSelectionBox({ x: pos.x, y: pos.y, width: 0, height: 0, startX: pos.x, startY: pos.y });
                setSelectedElement(null);
                setSelectedElements([]);
            }
        } else if (activeTool === 'ruler') {
            setRuler({
                x: pos.x - 150,
                y: pos.y - 20,
                width: 300,
                height: 40
            });
        } else if (activeTool === 'protractor') {
            setProtractor({
                x: pos.x,
                y: pos.y,
                radius: 100,
                startAngle: 0,
                endAngle: Math.PI
            });
        } else if (['rectangle', 'circle', 'line', 'arrow'].includes(activeTool)) {
            setIsDrawing(true);
            setCurrentShape({
                type: activeTool,
                x: pos.x,
                y: pos.y,
                width: 0,
                height: 0,
                startX: pos.x,
                startY: pos.y,
                color: toolProperties.color,
                thickness: toolProperties.thickness,
                opacity: toolProperties.opacity
            });
        }
    };

    const handlePointerMove = (e) => {
        const pos = getPointerPos(e);

        // TOUCH INPUT: Pan
        if (isPanning && e.pointerType === 'touch') {
            const dx = e.clientX - dragOffset.x;
            const dy = e.clientY - dragOffset.y;
            setViewport(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
            setDragOffset({ x: e.clientX, y: e.clientY });
            return;
        }

        // Handle Panning (Mouse/Pen)
        if (activeTool === 'select' && isDrawing && !draggedElement && !selectionBox) {
            const dx = e.clientX - dragOffset.x;
            const dy = e.clientY - dragOffset.y;
            setViewport(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
            setDragOffset({ x: e.clientX, y: e.clientY });
            return;
        }

        if (isErasing && activeTool === 'eraser') {
            const elementsToCheck = [...elements];
            for (const el of elementsToCheck) {
                if (isPointNearElement(pos, el)) {
                    deleteElement(el.id);
                    break;
                }
            }
            return;
        }

        if (isDrawing && activeTool === 'pen') {
            const snappedPos = ruler ? snapToRulerEdge(pos.x, pos.y, ruler) : pos;
            const newPoint = { ...snappedPos, pressure: e.pressure || 0.5 };

            // Add to ref path
            currentPathRef.current.push(newPoint);

            // Draw segment directly to canvas (bypass React state)
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            ctx.save();
            ctx.translate(viewport.x, viewport.y);
            ctx.scale(viewport.scale, viewport.scale);

            const points = currentPathRef.current;

            if (points.length >= 2) {
                const p1 = points[points.length - 2];
                const p2 = points[points.length - 1];

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);

                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.strokeStyle = toolProperties.color;
                ctx.globalAlpha = toolProperties.opacity;

                const pressure = p2.pressure || 0.5;
                const dynamicThickness = Math.max(1, toolProperties.thickness * pressure * 2);
                ctx.lineWidth = dynamicThickness;

                ctx.stroke();
                ctx.globalAlpha = 1;
            }
            ctx.restore();
            return;
        }

        // Update shape preview
        if (isDrawing && currentShape) {
            setCurrentShape({
                ...currentShape,
                width: pos.x - currentShape.startX,
                height: pos.y - currentShape.startY
            });
            return;
        }

        // Allow dragging selected elements
        if (draggedElement && activeTool === 'select') {
            const newX = pos.x - dragOffset.x;
            const newY = pos.y - dragOffset.y;

            if (draggedElement.type === 'stroke') {
                const deltaX = newX - draggedElement.points[0].x;
                const deltaY = newY - draggedElement.points[0].y;
                const newPoints = draggedElement.points.map(p => ({
                    x: p.x + deltaX,
                    y: p.y + deltaY,
                    pressure: p.pressure // Preserve pressure
                }));
                updateElement(draggedElement.id, { points: newPoints });
                setDragOffset({ x: pos.x - newPoints[0].x, y: pos.y - newPoints[0].y });
            } else {
                updateElement(draggedElement.id, { x: newX, y: newY });
            }
            return;
        }

        if (selectionBox && activeTool === 'select') {
            const width = pos.x - selectionBox.startX;
            const height = pos.y - selectionBox.startY;
            setSelectionBox({
                ...selectionBox,
                x: width < 0 ? pos.x : selectionBox.startX,
                y: height < 0 ? pos.y : selectionBox.startY,
                width: Math.abs(width),
                height: Math.abs(height)
            });
        }
    };

    const handlePointerUp = (e) => {
        e.target.releasePointerCapture(e.pointerId);

        if (isPanning) {
            setIsPanning(false);
            return;
        }

        if (isDrawing && activeTool === 'pen' && currentPathRef.current.length > 0) {
            addElement({
                id: Date.now(),
                type: 'stroke',
                points: [...currentPathRef.current], // Create copy from ref
                color: toolProperties.color,
                thickness: toolProperties.thickness,
                opacity: toolProperties.opacity
            });
            currentPathRef.current = []; // Clear ref
        }

        if (isDrawing && currentShape) {
            // Only add if it has some size
            if (Math.abs(currentShape.width) > 5 || Math.abs(currentShape.height) > 5) {
                addElement({
                    id: Date.now(),
                    ...currentShape
                });
            }
            setCurrentShape(null);
        }

        if (selectionBox && activeTool === 'select') {
            const selected = elements.filter(el => {
                if (el.type === 'stroke') {
                    const bounds = getStrokeBounds(el);
                    return bounds && pointInRect(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2, selectionBox);
                } else if (el.type === 'text' || el.type === 'equation') {
                    return pointInRect(el.x, el.y, selectionBox);
                }
                return false;
            });
            setSelectedElements(selected);
            setSelectionBox(null);
        }

        setIsDrawing(false);
        setIsErasing(false);
        setDraggedElement(null);
    };

    // Action menu handlers
    const handleDeleteSelected = () => {
        selectedElements.forEach(el => deleteElement(el.id));
        setSelectedElements([]);
        setSelectedElement(null);
    };

    // Calculate action menu position
    const getActionMenuPosition = () => {
        if (selectedElements.length === 0) return { x: 0, y: 0 };

        let minY = Infinity;
        let avgX = 0;

        selectedElements.forEach(el => {
            if (el.type === 'stroke') {
                const bounds = getStrokeBounds(el);
                if (bounds) {
                    minY = Math.min(minY, bounds.y);
                    avgX += bounds.x + bounds.width / 2;
                }
            } else {
                minY = Math.min(minY, el.y);
                avgX += el.x;
            }
        });

        avgX /= selectedElements.length;

        return { x: avgX, y: minY };
    };

    return (
        <>
            <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    touchAction: 'none', // Prevent scrolling/zooming on touch devices
                    cursor: activeTool === 'pen' ? 'crosshair' : activeTool === 'eraser' ? 'pointer' : 'default'
                }}
            />
            {selectedElements.length > 0 && (
                <SelectionActionMenu
                    selectedElements={selectedElements}
                    onDelete={handleDeleteSelected}
                    position={getActionMenuPosition()}
                />
            )}
        </>
    );
};

export default Whiteboard;
