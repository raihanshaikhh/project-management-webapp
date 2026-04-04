import { useEffect, useState } from "react";
import API from "../services/Api.js";

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

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">
       {user?.username ? `Welcome, ${user.username}` : "User not found"}
      </h1>
    </div>
  );
};

export default Dashboard;