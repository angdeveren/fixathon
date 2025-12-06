import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientView from './pages/ClientView';
import AdminView from './pages/AdminView';
import CustomerFeed from './pages/CustomerFeed';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="/app" element={<ClientView />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/admin/customer/:id" element={<CustomerFeed />} />
      </Routes>
    </Router>
  );
}

export default App;
