import React, { useState } from 'react';
import { WhiteboardProvider, useWhiteboard } from './context/WhiteboardContext';
import Whiteboard from './components/Whiteboard';
import Toolbar from './components/Toolbar';
import TextModal from './components/TextModal';
import BackgroundModal from './components/BackgroundModal';
import Branding from './components/Branding';
import WelcomeScreen from './components/WelcomeScreen';
import './App.css';

const MainLayout = () => {
    const { setElements, updateBackground, setViewport } = useWhiteboard();
    const [showWelcome, setShowWelcome] = useState(true);

    const handleLoadFile = (data, filename) => {
        if (data.elements) setElements(data.elements);
        if (data.background) updateBackground(data.background);
        if (data.viewport) setViewport(data.viewport);
        // Optionally store filename if we want to track it
        setShowWelcome(false);
    };

    return (
        <>
            {showWelcome && (
                <WelcomeScreen
                    onNewCanvas={() => setShowWelcome(false)}
                    onLoadFile={handleLoadFile}
                />
            )}
            <div style={{ opacity: showWelcome ? 0 : 1, transition: 'opacity 0.5s ease' }}>
                <Whiteboard />
                <Toolbar />
                <TextModal />
                <BackgroundModal />
                <Branding />
            </div>
        </>
    );
};

function App() {
    return (
        <WhiteboardProvider>
            <MainLayout />
        </WhiteboardProvider>
    );
}

export default App;
