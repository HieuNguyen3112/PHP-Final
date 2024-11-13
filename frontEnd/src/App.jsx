import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Account from "./pages/Account";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
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
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/account" element={<Account />} />
            <Route path="/cabins" element={<Cabins />} />
            <Route path="/users" element={<Users />} /> 
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
