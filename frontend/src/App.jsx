import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import MyTasks from "./pages/MyTasks.jsx";
import Inbox from "./pages/Inbox.jsx";
import Calendar from "./pages/Calendar.jsx";
import Settings from "./pages/setting/Setting.jsx";
import ProtectedRoute from "./Routes/ProtectedRoutes.jsx";
import AppProviders from "./AppProvider.jsx";
import socket from "./services/Socket.js";
import { useEffect } from "react";


  

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  



  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/sign-in" element={<Auth />} />

      <Route element={<ProtectedRoute />}>
      <Route element={<AppProviders />}>
        <Route path="/app" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
      </Route>
    </Routes>
  )
}

export default App