import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";
const DashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-[#F8FAFC]">
        <Outlet />
      </div>
    </div>
  );
};
export default DashboardLayout;