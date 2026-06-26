import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import Community from './pages/Community';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/community" element={<Community />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
