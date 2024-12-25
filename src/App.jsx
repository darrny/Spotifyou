import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import TopArtists from './components/TopArtists';
import TopSongs from './components/TopSongs';
import AIRecommendations from './components/AIRecommendations';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Home />} />
            <Route path="top-artists" element={<TopArtists />} />
            <Route path="top-songs" element={<TopSongs />} />
            <Route path="ai-recommendations" element={<AIRecommendations />} />
          </Route>

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;