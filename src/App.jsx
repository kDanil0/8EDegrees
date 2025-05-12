import { Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import MainLayout from "./layouts/MainLayout";
import POSLayout from "./layouts/POSLayout";

// Pages
import InventoryPage from "./pages/inventory/InventoryPage";
import SupplyChainPage from "./pages/supply-chain/SupplyChainPage";
import PosPage from "./pages/pos/PosPage";
import AccountingPage from "./pages/accounting/AccountingPage";
import CustomersPage from "./pages/customers/CustomersPage";
import FeedbackPage from "./pages/customers/FeedbackPage";
import LoginPage from "./pages/auth/LoginPage";
import UserManagement from "./pages/users/UserManagement";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<InventoryPage />} />
            <Route path="/accounting" element={<AccountingPage />} />
            <Route path="/supply-chain" element={<SupplyChainPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/users" element={<UserManagement />} />
          </Route>
        </Route>

        {/* POS routes (accessible to both cashier and admin) */}
        <Route element={<ProtectedRoute allowedRoles={["cashier", "admin"]} />}>
          <Route element={<POSLayout />}>
            <Route path="/pos" element={<PosPage />} />
          </Route>
        </Route>

        {/* Catch-all redirect to login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
