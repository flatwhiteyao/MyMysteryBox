import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import BlindBoxPage from './components/BlindBoxPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/blind-box" element={<BlindBoxPage />} />
                <Route path="*" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default App;