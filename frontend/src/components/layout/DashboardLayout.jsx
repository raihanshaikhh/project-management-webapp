import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";
const DashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-zinc-950 p-6">
        <Outlet />
      </main>
    </div>
  );
};
export default DashboardLayout;