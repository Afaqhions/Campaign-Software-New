// src/App.jsx
import './App.css';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import LandingPage from './Pages/landingPage';
import LoginPage from './Pages/login';

// Dashboards
import AdminDashboard from './Pages/Dashboards/Admin/AdminDashboard';
import ClientDashboard from './Pages/Dashboards/ClientPages/ClientDashboard';
import ServiceManDashboard from './Pages/Dashboards/ServiceMan/ServicemanDashboard';

// Admin Functional Pages
import ManageUsers from './Pages/Dashboards/Admin/ManageUsers';
import ManageCampaigns from './Pages/Dashboards/Admin/ManageCampaigns';
import ManageBoards from './Pages/Dashboards/Admin/ManageBoards';
import ViewBoardStats from './Pages/Dashboards/Admin/ViewBoardStats';
import AssignCampaigns from './Pages/Dashboards/Admin/AssignCampaigns';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Dashboard Routes */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/client-dashboard" element={<ClientDashboard />} />
      <Route path="/serviceman-dashboard" element={<ServiceManDashboard />} />

      {/* Admin Functional Routes */}
      <Route path="/admin/users" element={<ManageUsers />} />
      <Route path="/admin/campaigns" element={<ManageCampaigns />} />
      <Route path="/admin/boards" element={<ManageBoards />} />
      <Route path="/admin/boards/stats" element={<ViewBoardStats />} />
      <Route path="/admin/assign" element={<AssignCampaigns />} />

      {/* Note:
        - Integrate token-based protection in future via AuthContext or custom PrivateRoutes
        - These routes match typical RESTful backend routes e.g. /admin/campaigns (GET, POST, PUT, DELETE)
      */}
    </Routes>
  );
}

export default App;
