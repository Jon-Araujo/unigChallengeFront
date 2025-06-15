import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import ProtectedRoute from './ProtectedRouter';
import Dashboard from '../pages/Dashboard';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    </Routes>
  );
}
