import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Account from "./pages/Account";
import Users from "./pages/Users"; // Thêm import cho Users
import Settings from "./pages/Settings"; // Thêm import cho Settings
import Cabins from "./pages/Cabins";
import { DarkModeProvider } from "./context/DarkModeContext";
import GlobalStyles from "./styles/GlobalSyles";
import AppLayout from "./ui/AppLayout";

function App() {
  return (
    <DarkModeProvider>
      <GlobalStyles />

      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Điều hướng mặc định từ '/' đến '/dashboard' */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/account" element={<Account />} />
            <Route path="/cabins" element={<Cabins />} />
            <Route path="/users" element={<Users />} /> {/* Thêm route cho Users */}
            <Route path="/settings" element={<Settings />} /> {/* Thêm route cho Settings */}
          </Route>
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
