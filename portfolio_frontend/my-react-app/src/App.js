
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import RiskEngine from './pages/RiskEngine';
import BrowseStocks from './pages/BrowseStocks';
import Profile from './pages/Profile';
import Balance from './pages/Balance';


function App() {
  return (
  
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/risk-engine" element={<RiskEngine />} />
            <Route path="/browse-stocks" element={<BrowseStocks />} />
            <Route path="/balance" element={<Balance />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </MainLayout>
      </Router>
   
  );
}

export default App;
