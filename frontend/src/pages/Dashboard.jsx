import { useEffect, useState } from "react";
import { RiProgress5Line } from "react-icons/ri";
import { FaTasks } from "react-icons/fa";
import { AiOutlineFileDone } from "react-icons/ai";
import { GrProjects } from "react-icons/gr";


import API from "../services/Api.js";


const Stats = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm w-full min-h-28 flex justify-between items-center">
      
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-semibold">{value}</h3>
      </div>

      {icon && (
        <div className="text-2xl p-3 bg-gray-100 rounded-lg">
          {icon}
        </div>
      )}

    </div>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await API.get("/auth/current-user");
        setUser(res.data.data);
        
         // depends on your controller response
      } catch (err) {
        console.error("Not logged in", err);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  if (loading) return <p>Loading...</p>;
    const date = new Date();
  return ( 
    <>
    <div className="p-4">
      <h1 className="text-3xl font-semibold font-family-roboto text-[#006066] mt-6">
       {user?.username ? `👋 Welcome, ${user.username}!` : "User not found"}
      </h1>
      <p className="text-lg mt-3 mx-13 text-gray-600">
        {date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
    
<div className="px-4 md:px-6 lg:px-8">  
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

    <Stats 
      title="Open Tasks" 
      value="120" 
      icon={<FaTasks className="text-blue-500" />} 
    />

    <Stats 
      title="In Progress" 
      value="$5,000" 
      icon={<RiProgress5Line className="text-yellow-500" />} 
    />

    <Stats 
      title="Completed" 
      value="32" 
      icon={<AiOutlineFileDone className="text-green-500" />} 
    />

    <Stats 
      title="Projects" 
      value="8" 
      icon={<GrProjects className="text-purple-500" />} 
    />

  </div>
</div>




    </>
  );
};

export default Dashboard;