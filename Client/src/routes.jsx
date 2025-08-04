import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";

// Public Pages
import HomePage from "./Pages/landingPage";
import LoginPage from "./Pages/login";

// Dashboards (Protected)
import AdminDashboard from "./Pages/Dashboards/Admin/AdminDashboard";
import ClientDashboard from "./Pages/Dashboards/ClientPages/ClientDashboard";
import ManagerDashboard from "./Pages/Dashboards/Admin/AdminDashboard"; // You can change this if needed
import ServiceDashboard from "./Pages/Dashboards/ServiceMan/ServicemanDashboard";

// Admin Pages
import AssignCampaigns from "./Pages/Dashboards/Admin/AssignCampaigns";
import ManageBoards from "./Pages/Dashboards/Admin/ManageBoards";
import ManageUsers from "./Pages/Dashboards/Admin/ManageUsers";
import ManageCampaigns from "./Pages/Dashboards/Admin/ManageCampaigns";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/assign-campaigns" element={<AssignCampaigns />} />
        <Route path="/manage-boards" element={<ManageBoards />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/manage-campaigns" element={<ManageCampaigns />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

      </Route>

      {/* Client */}
      <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
        <Route path="/client-dashboard" element={<ClientDashboard />} />
      </Route>

      {/* Serviceman */}
      <Route element={<ProtectedRoute allowedRoles={["serviceman"]} />}>
        <Route path="/serviceman-dashboard" element={<ServiceDashboard />} />
      </Route>

      {/* Manager */}
      <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
