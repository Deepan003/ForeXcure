import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Chatbot from './pages/Chatbot';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Store from './pages/Store';

// Import the new global styles
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes: Only logged-in users can access */}
          <Route 
            path="/chatbot" 
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/doctors" 
            element={
              <ProtectedRoute>
                <Doctors />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/store" 
            element={
              <ProtectedRoute>
                <Store />
              </ProtectedRoute>
            } 
          />

          {/* Add a simple 404 page or redirect */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;