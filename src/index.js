import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import { RegisterContextProvider } from './context/RegisterContext';
import { LoginContextProvider } from './context/LoginContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <LoginContextProvider>
        <RegisterContextProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </RegisterContextProvider>
      </LoginContextProvider>
    </ChatContextProvider>
  </AuthContextProvider>
);
