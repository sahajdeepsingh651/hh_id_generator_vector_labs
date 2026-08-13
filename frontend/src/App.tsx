import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Generator } from './pages/Generator';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#FFF8EB] text-[#063725] selection:bg-[#FEE101] selection:text-[#063725]">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/generate" element={<Generator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
