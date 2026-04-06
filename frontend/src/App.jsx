
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import MyTasks from "./pages/MyTasks.jsx";
import Inbox from "./pages/Inbox.jsx";
import Calendar from "./pages/Calendar.jsx";
function App() {


  return (
    <Routes>
  <Route path="/" element={<Auth />} />

  <Route path="/app" element={<DashboardLayout />}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="tasks"    element={<MyTasks />} />
<Route path="inbox"    element={<Inbox />} />
<Route path="calendar" element={<Calendar />} />
  </Route>
</Routes>
  )
}

export default App
