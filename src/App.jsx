// doubao/frontend/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import BlindBoxPage from './components/BlindBoxPage';
import BlindBoxInfoPage from './components/BlindBoxInfoPage';
import PaymentPage from './components/PaymentPage';
import DrawnStyleDetailPage from './components/DrawnStyleDetailPage';
import UserProfilePage from './components/UserProfilePage';
import UserDrawnBlindBoxesPage from './components/UserDrawnBlindBoxesPage';
import PlayerShowsPage from './components/PlayerShowsPage';
import PlayerShowDetailPage from './components/PlayerShowDetailPage';
import PlayerShowCreatePage from './components/PlayerShowCreatePage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/blind-box" element={<BlindBoxPage />} />
                <Route path="/blind-box/:id" element={<BlindBoxInfoPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/drawn-style-detail" element={<DrawnStyleDetailPage />} />
                <Route path="/user-profile" element={<UserProfilePage />} />
                <Route path="/user-drawn-blind-boxes" element={<UserDrawnBlindBoxesPage />} />
                <Route path="/player-shows" element={<PlayerShowsPage />} />
                <Route path="/player-show-detail/:id" element={<PlayerShowDetailPage />} />
                <Route path="/player-show-create" element={<PlayerShowCreatePage />} />
                <Route path="*" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default App;