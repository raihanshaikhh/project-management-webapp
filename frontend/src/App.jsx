import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
function App() {


  return (
    <Routes>
  <Route path="/" element={<Auth />} />

  <Route path="/app" element={<DashboardLayout />}>
    <Route path="dashboard" element={<Dashboard />} />
  </Route>
</Routes>
  )
}

export default App
