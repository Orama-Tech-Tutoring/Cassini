import React, { useState } from 'react';
import { useWhiteboard } from '../context/WhiteboardContext';
import { X, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const TextModal = () => {
    const { showTextModal, setShowTextModal, addElement, toolProperties } = useWhiteboard();
    const [text, setText] = useState('');
    const [fontSize, setFontSize] = useState(24);
    const [fontFamily, setFontFamily] = useState('Inter');

    // Formatting states
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [textAlign, setTextAlign] = useState('left'); // 'left', 'center', 'right'
    const [backgroundColor, setBackgroundColor] = useState('');
    const [showBgColor, setShowBgColor] = useState(false);

    if (!showTextModal) return null;

    const handleInsert = () => {
        if (!text.trim()) return;

        addElement({
            id: Date.now(),
            type: 'text',
            text: text,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            fontSize: fontSize,
            fontFamily: fontFamily,
            color: toolProperties.color,
            opacity: toolProperties.opacity,
            // New formatting properties
            bold: isBold,
            italic: isItalic,
            underline: isUnderline,
            textAlign: textAlign,
            backgroundColor: showBgColor ? backgroundColor : null
        });

        setShowTextModal(false);
        resetModal();
    };

    const resetModal = () => {
        setText('');
        setIsBold(false);
        setIsItalic(false);
        setIsUnderline(false);
        setTextAlign('left');
        setBackgroundColor('');
        setShowBgColor(false);
    };

    const handleClose = () => {
        setShowTextModal(false);
        resetModal();
    };

    const fonts = ['Inter', 'Arial', 'Georgia', 'Courier New', 'Comic Sans MS', 'Times New Roman'];
    const bgColors = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#5856D6', '#AF52DE', '#FF2D55'];

    // Build font style for preview
    const fontWeight = isBold ? 'bold' : 'normal';
    const fontStyle = isItalic ? 'italic' : 'normal';
    const textDecoration = isUnderline ? 'underline' : 'none';

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
        }}>
            <div className="glass-modal" style={{
                width: '500px',
                maxWidth: '90vw',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 600,
                        margin: 0
                    }}>Insert Text</h2>
                    <button
                        onClick={handleClose}
                        className="glass-button"
                        style={{
                            width: '36px',
                            height: '36px',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Text Input */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 500
                    }}>
                        Text Content
                    </label>
                    <textarea
                        className="glass-input"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter your text here..."
                        rows={4}
                        autoFocus
                        style={{
                            resize: 'vertical',
                            minHeight: '80px'
                        }}
                    />
                </div>

                {/* Text Formatting Toolbar */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 500
                    }}>
                        Formatting
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {/* Bold/Italic/Underline */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                                onClick={() => setIsBold(!isBold)}
                                className="glass-button"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: isBold ? 'rgba(0, 122, 255, 0.3)' : 'transparent'
                                }}
                                title="Bold"
                            >
                                <Bold size={18} />
                            </button>
                            <button
                                onClick={() => setIsItalic(!isItalic)}
                                className="glass-button"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: isItalic ? 'rgba(0, 122, 255, 0.3)' : 'transparent'
                                }}
                                title="Italic"
                            >
                                <Italic size={18} />
                            </button>
                            <button
                                onClick={() => setIsUnderline(!isUnderline)}
                                className="glass-button"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: isUnderline ? 'rgba(0, 122, 255, 0.3)' : 'transparent'
                                }}
                                title="Underline"
                            >
                                <Underline size={18} />
                            </button>
                        </div>

                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />

                        {/* Text Alignment */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                                onClick={() => setTextAlign('left')}
                                className="glass-button"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: textAlign === 'left' ? 'rgba(0, 122, 255, 0.3)' : 'transparent'
                                }}
                                title="Align Left"
                            >
                                <AlignLeft size={18} />
                            </button>
                            <button
                                onClick={() => setTextAlign('center')}
                                className="glass-button"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: textAlign === 'center' ? 'rgba(0, 122, 255, 0.3)' : 'transparent'
                                }}
                                title="Align Center"
                            >
                                <AlignCenter size={18} />
                            </button>
                            <button
                                onClick={() => setTextAlign('right')}
                                className="glass-button"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: textAlign === 'right' ? 'rgba(0, 122, 255, 0.3)' : 'transparent'
                                }}
                                title="Align Right"
                            >
                                <AlignRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Background Color */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer'
                    }}>
                        <input
                            type="checkbox"
                            checked={showBgColor}
                            onChange={(e) => setShowBgColor(e.target.checked)}
                            style={{ accentColor: 'var(--accent-blue)' }}
                        />
                        Text Background
                    </label>
                    {showBgColor && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {bgColors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setBackgroundColor(color)}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: 'var(--radius-sm)',
                                        background: color,
                                        border: backgroundColor === color ? '3px solid white' : '2px solid rgba(255,255,255,0.3)',
                                        cursor: 'pointer'
                                    }}
                                />
                            ))}
                            <input
                                type="color"
                                value={backgroundColor || '#007AFF'}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Font Family */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 500
                    }}>
                        Font Family
                    </label>
                    <select
                        className="glass-input"
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        style={{
                            cursor: 'pointer'
                        }}
                    >
                        {fonts.map(font => (
                            <option key={font} value={font} style={{ background: '#1e1e2e' }}>
                                {font}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Font Size */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 500
                    }}>
                        Font Size: {fontSize}px
                    </label>
                    <input
                        type="range"
                        min="12"
                        max="72"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        style={{
                            width: '100%',
                            accentColor: 'var(--accent-blue)'
                        }}
                    />
                </div>

                {/* Preview */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 500
                    }}>
                        Preview
                    </label>
                    <div style={{
                        padding: '20px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        minHeight: '80px',
                        display: 'flex',
                        alignItems: textAlign === 'center' ? 'center' : 'flex-start',
                        justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start'
                    }}>
                        <span style={{
                            fontSize: `${fontSize}px`,
                            fontFamily: fontFamily,
                            fontWeight: fontWeight,
                            fontStyle: fontStyle,
                            textDecoration: textDecoration,
                            color: toolProperties.color,
                            textAlign: textAlign,
                            backgroundColor: showBgColor && backgroundColor ? backgroundColor : 'transparent',
                            padding: showBgColor && backgroundColor ? '4px 8px' : '0',
                            borderRadius: showBgColor && backgroundColor ? '4px' : '0',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                        }}>
                            {text || 'Your text here...'}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={handleClose}
                        className="glass-button"
                        style={{ padding: '10px 20px' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInsert}
                        className="glass-button active"
                        style={{ padding: '10px 20px' }}
                        disabled={!text.trim()}
                    >
                        Insert Text
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TextModal;
