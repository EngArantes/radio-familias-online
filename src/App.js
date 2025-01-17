import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Importe o AuthProvider
import Header from './components/Header';
import Home from './pages/Home';
import SubHeader from './components/SubHeader';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './router/PrivateRoute';
import VideoGallery from './pages/VideoGallery'; 
import Contato from './pages/Contato';

function App() {
  return (
    <AuthProvider> 
      <Router>
        <div className="App">
          <SubHeader />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/videos-gallery" element={<VideoGallery />} /> 
            <Route path="/contato" element={<Contato />} />  
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;