import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Booking from "./pages/Booking"; // Import lại từ Booking.jsx
import Account from "./pages/Account";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Cabins from "./pages/Cabins";
import { DarkModeProvider } from "./context/DarkModeContext";
import GlobalStyles from "./styles/GlobalSyles";
import AppLayout from "./ui/AppLayout";
import ProtectedRoute from "./api/ProtectedRoute";

function App() {
  return (
    <DarkModeProvider>
      <GlobalStyles />

      <BrowserRouter>
        <Routes>
          {/* Trang chính có AppLayout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />

            {/* Các route yêu cầu đăng nhập */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/:id" // Route chi tiết booking
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cabins"
              element={
                <ProtectedRoute>
                  <Cabins />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
