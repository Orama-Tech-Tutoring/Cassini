# Cassini - Release Notes

## Version 1.3.0 - Shape Tools & Input Enhancement

**Release Date:** December 2, 2025

### 🚀 New Features

#### Shape Tools

- ✅ **Rectangle Tool** - Draw rectangles by dragging from corner to corner
- ✅ **Circle Tool** - Draw circles/ellipses with dynamic sizing
- ✅ **Line Tool** - Draw straight lines between two points
- ✅ **Arrow Tool** - Draw arrows with automatic arrowhead rendering
- ✅ **Real-time Preview** - See shapes as you draw them before releasing
- ✅ **Full Integration** - Shapes are selectable, movable, and deletable like other elements

#### Stylus-Only Mode

- ✅ **Touch-to-Pan** - Touch inputs exclusively pan and navigate the canvas
- ✅ **Pen-to-Draw** - Only stylus and mouse inputs can draw and interact with tools
- ✅ **Improved Workflow** - Prevents accidental drawing when using touch to navigate
- ✅ **Cross-Platform** - Works on tablets, touch laptops, and stylus devices

### 🔧 Technical Improvements

- **Shape Rendering:** Dedicated `drawShape()` function with support for all geometric primitives
- **Input Discrimination:** Pointer Events API detects touch vs pen/mouse for intelligent input handling
- **Live Preview:** Shape preview system shows shapes in real-time during drawing
- **Hit Detection:** Enhanced selection logic for shape bounding boxes

### 🎨 UI Updates

- **Toolbar:** Added 4 new shape tool buttons (Rectangle, Circle, Line, Arrow)
- **Icons:** Using Lucide React icons for consistent visual language
- **Ordering:** Shape tools positioned logically after selection tools

---

## Version 1.2.0 - Infinite Canvas & AI

**Release Date:** November 20, 2025

### 🚀 New Features

#### Infinite Canvas

- ✅ **Unlimited Canvas** - Draw beyond the viewport with infinite workspace
- ✅ **Pan & Zoom** - Navigate the canvas using Select tool drag (pan) and Ctrl+Scroll (zoom)
- ✅ **Viewport System** - Robust coordinate mapping between screen and world space
- ✅ **Smooth Transformations** - All drawings maintain precision at any zoom level

#### AI Integration

- ✅ **Gemini Chat Sidebar** - Built-in AI assistant powered by Google Gemini
- ✅ **Collapsible Interface** - Chat sidebar can be minimized to maximize drawing space
- ✅ **Context-Aware** - Real-time responses with loading states and error handling
- ✅ **Model Support** - Compatible with gemini-2.0-flash-lite and other Gemini models

#### UI Enhancements

- ✅ **Collapsible Toolbar** - Toggle button to hide/show toolbar for more workspace
- ✅ **Smooth Animations** - Enhanced transitions for UI state changes

### 🔧 Technical Improvements

- **Coordinate System:** Screen-to-world coordinate transformation for accurate drawing at any zoom
- **Performance:** Optimized rendering with viewport-aware canvas updates
- **API Integration:** Hardcoded API key support with model auto-detection

### 📝 Configuration

- Gemini API key is configured in `src/services/geminiService.js`
- Model: `gemini-2.0-flash-lite` (verified compatible with v1beta API)

---

## Version 1.1.0 - Stylus Support & Performance

**Release Date:** November 19, 2025

### 🚀 New Features

#### Stylus & Input Enhancements

- ✅ **Full Stylus Support** - Native support for pressure-sensitive styluses (e.g., Surface Pen, Apple Pencil)
- ✅ **Pressure Sensitivity** - Stroke thickness dynamically adjusts based on applied pressure
- ✅ **Palm Rejection** - Improved handling to prevent accidental touches while drawing
- ✅ **Zero-Latency Drawing** - New direct-to-canvas rendering engine for instant feedback
- ✅ **Pointer Events API** - Modernized input handling for seamless mouse, touch, and pen interaction

### 🔧 Improvements

- **Performance:** Optimized rendering pipeline for smoother drawing at high refresh rates
- **Compatibility:** Unified input handling across all device types
- **UX:** Enhanced responsiveness for rapid strokes

---

## Version 1.0.0 - Initial Release

**Release Date:** November 19, 2025

### 🎉 Features

#### Drawing Tools

- ✅ Pen tool with customizable color, thickness (1-20px), and opacity (10-100%)
- ✅ Eraser tool with drag-to-erase functionality
- ✅ Custom color picker (8 presets + custom colors)

#### Selection & Manipulation

- ✅ Select tool with click or drag-box selection
- ✅ **Drag-to-move** - Selected elements can be dragged immediately
- ✅ Multi-select with Shift+click
- ✅ Delete selected elements via action menu
- ✅ Works for all element types (strokes, text, equations)

#### Measurement Tools

- ✅ Ruler with measurement marks and pen snapping
- ✅ Protractor showing angles from 0° to 180°

#### Text Tool

- ✅ Insert text with customizable font family
- ✅ Adjustable font size (12-72px)
- ✅ Live preview before insertion
- ✅ Movable and selectable after placement

#### UI/UX

- ✅ Apple Liquid Glass design system
- ✅ Glassmorphism effects throughout
- ✅ Smooth animations and micro-interactions
- ✅ Undo/Redo functionality
- ✅ Clear all canvas
- ✅ Responsive toolbar

### 📦 Build Information

**Production Build:**

- Bundle size: 164.58 KB (52.44 KB gzipped)
- CSS size: 4.14 KB (1.28 KB gzipped)
- Build time: ~2 seconds
- Output directory: `dist/`

### 🚀 Deployment

The production build is ready in the `dist` folder. You can deploy it to:

- Static hosting (Netlify, Vercel, GitHub Pages)
- Web server (Apache, Nginx)
- Cloud platforms (AWS S3, Azure, Google Cloud)

**To preview the production build locally:**

```bash
npm run preview
```

### 📋 Installation & Usage

**Development:**

```bash
npm install
npm run dev
```

**Production Build:**

```bash
npm run build
```

### 🛠️ Technical Stack

- React 18.2.0
- Vite 4.4.5
- HTML5 Canvas
- KaTeX 0.16.9
- Lucide React 0.263.1

### ✨ Highlights

- **Zero Dependencies** for core functionality (only UI libraries)
- **High Performance** canvas rendering
- **Premium Design** with Apple Liquid Glass aesthetic
- **Intuitive UX** - drag-to-move without toggle buttons
- **Clean Codebase** - well-organized and maintainable

### 📝 Future Enhancements (Potential v2.0)

- Export canvas as image (PNG/SVG)
- Import background images
- Layers support
- Collaboration features
- Keyboard shortcuts

---

**Built with ❤️ by The Lab Technologies**
