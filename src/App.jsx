import React, { useState } from 'react';
import { WhiteboardProvider, useWhiteboard } from './context/WhiteboardContext';
import Whiteboard from './components/Whiteboard';
import Toolbar from './components/Toolbar';
import TextModal from './components/TextModal';
import BackgroundModal from './components/BackgroundModal';
import Branding from './components/Branding';
import WelcomeScreen from './components/WelcomeScreen';
import SettingsSidebar from './components/SettingsSidebar';
import CommandPalette from './components/CommandPalette';
import './App.css';

const MainLayout = () => {
    const { setElements, updateBackground, setViewport, showWelcome, setShowWelcome, updateSettings } = useWhiteboard();

    const handleLoadFile = (data, filename) => {
        if (data.elements) setElements(data.elements);
        if (data.background) updateBackground(data.background);
        if (data.viewport) setViewport(data.viewport);
        if (data.author) updateSettings({ userName: data.author });
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
                <SettingsSidebar />
                <CommandPalette />
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
