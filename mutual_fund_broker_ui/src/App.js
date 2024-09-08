import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from  './components/Login';
import Dashboard from  './components/Dashboard';
import FundDetails from  './components/FundDetails';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Login /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard/></Layout>} />
        <Route path="/fund-details/:schemeCode" element={<Layout><FundDetails/></Layout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
