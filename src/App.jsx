import React from 'react';
import { WhiteboardProvider } from './context/WhiteboardContext';
import Whiteboard from './components/Whiteboard';
import Toolbar from './components/Toolbar';
import TextModal from './components/TextModal';
import BackgroundModal from './components/BackgroundModal';
import Branding from './components/Branding';
import ChatSidebar from './components/ChatSidebar';
import './App.css';

function App() {
    return (
        <WhiteboardProvider>
            <Whiteboard />
            <Toolbar />
            <ChatSidebar />
            <TextModal />
            <BackgroundModal />
            <Branding />
        </WhiteboardProvider>
    );
}

export default App;
