import { useEffect, useState } from "react";
import { RiProgress5Line } from "react-icons/ri";
import { FaTasks } from "react-icons/fa";
import { AiOutlineFileDone } from "react-icons/ai";
import { GrProjects } from "react-icons/gr";
import API from "../services/Api.js";




// High-contrast, vibrant glassmorphism inspired badges
const BADGE = {
  "To Do": "bg-zinc-800 text-zinc-300 border border-zinc-700",
  "In Progress": "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  "Done": "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const Stats = ({ title, value, icon }) => (
  <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors w-full min-h-28 flex justify-between items-center group">
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{title}</p>
      <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
    </div>
    {icon && (
      <div className="text-xl p-3 bg-zinc-800/80 group-hover:bg-zinc-700/80 rounded-xl transition-colors">
        {icon}
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await API.get("/auth/current-user", {
          withCredentials: true,

        });

        setUser(res.data.data);
        const dashRes = await API.get("/dashboard", {
          withCredentials: true,
        });

        setDashboardData(dashRes.data.data);
      } catch (err) {
        console.error("Not logged in", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (loading) return <p className="text-zinc-500 p-6 animate-pulse font-medium">Loading workspace...</p>;
  if (!dashboardData) return <p className="text-zinc-500 p-6 font-medium">No dashboard data.</p>;
  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>

      {/* Greeting */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {getGreeting()}, <span className="text-blue-400">{user?.username ?? "there"}</span> 👋
        </h1>
        <p className="text-zinc-500 font-medium mt-1.5">{date}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Stats
          title="Open Tasks"
          value={dashboardData?.openTasks ?? 0}
          icon={<FaTasks className="text-blue-400" />}
        />

        <Stats
          title="In Progress"
          value={dashboardData?.taskCounts?.in_progress ?? 0}
          icon={<RiProgress5Line className="text-amber-400"  />}
        />

        <Stats
          title="Completed"
          value={dashboardData?.taskCounts?.done ?? 0}
          icon={<AiOutlineFileDone className="text-emerald-400" />}
        />

        <Stats
          title="Projects"
          value={dashboardData?.projectCount ?? 0}
          icon={<GrProjects className="text-violet-400" />}
        />
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* My Tasks */}
        <div className="lg:col-span-3 bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 backdrop-blur-sm">
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
            Current Focus
          </p>
          <div className="flex flex-col">
            {dashboardData?.myTasks?.map((task, i) => {
              const done = task.status === "Done";
              return (
                <div
                  key={task.id}
                  className={`flex items-start gap-4 py-4 transition-opacity ${i < task.length - 1 ? "border-b border-zinc-800/50" : ""
                    } ${done ? "opacity-60" : "opacity-100"}`}
                >
                  {/* Checkbox */}
                  <div
                    className={`mt-1 w-5 h-5 min-w-[20px] rounded-md border-2 flex items-center justify-center transition-all ${done
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-zinc-700 hover:border-zinc-400"
                      }`}
                  >
                    {done && (
                      <svg width="10" height="8" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <p
                      className={`text-sm font-semibold ${done
                          ? "line-through text-zinc-500"
                          : "text-zinc-100"
                        }`}
                    >
                      {task.title}
                    </p>

                    <p className="text-xs text-zinc-500 mt-1">
                      <span className="text-zinc-400">
                        {task.project?.name}
                      </span>{" "}
                      • Due{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  {/* Badge */}
                  <span
                    className={`text-[10px] px-3 py-1 rounded-lg ${BADGE[task.status]
                      }`}
                  >
                    {task.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 p-6 backdrop-blur-sm">
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
            Project Health
          </p>

          <div className="flex flex-col gap-2">
            {dashboardData?.projects?.map((proj, i) => {
              const pct = Math.round((proj.done / proj.total) * 100);

              return (
                <div
                  key={proj._id || proj.name}
                  className={`py-4 ${i < dashboard.projects.length - 1
                      ? "border-b border-zinc-800/50"
                      : ""
                    }`}
                >
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-bold text-zinc-100">
                      {proj.name}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {pct}%
                    </span>
                  </div>

                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: proj.color || "#3b82f6",
                      }}
                    />
                  </div>

                  <p className="text-xs text-zinc-500 mt-2">
                    {proj.done} / {proj.total} Tasks
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
};
export default Dashboard;
