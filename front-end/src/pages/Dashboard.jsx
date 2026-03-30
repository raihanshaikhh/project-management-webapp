





const summaryCards = [
  { label: "Total Projects", value: 12, trend: "+2 this month" },
  { label: "Active Tasks", value: 48, trend: "+6 today" },
  { label: "Completed Tasks", value: 134, trend: "+18 this week" },
  { label: "Team Members", value: 9, trend: "1 new member" },
]

const recentProjects = [
  { name: "Website Revamp", progress: 78, owner: "Ayesha", status: "On Track" },
  { name: "Mobile App v2", progress: 54, owner: "Rafay", status: "In Review" },
  { name: "Client Portal", progress: 31, owner: "Sarah", status: "At Risk" },
]

const upcomingTasks = [
  { title: "Design handoff review", due: "Today, 4:30 PM", priority: "High" },
  { title: "Sprint planning", due: "Tomorrow, 10:00 AM", priority: "Medium" },
  { title: "API integration test", due: "Mar 29, 2:00 PM", priority: "High" },
  { title: "Release notes draft", due: "Mar 30, 12:00 PM", priority: "Low" },
]

const activityFeed = [
  "Ayesha moved 'Landing page redesign' to Done.",
  "Rafay commented on 'Auth middleware improvements'.",
  "Sarah created a new task in Client Portal.",
  "You completed 3 tasks in Mobile App v2.",
]

const borderCard = "border border-[#F4F5EF]/12"
const surface = "bg-[#101113]"

function getPriorityClasses(priority) {
  if (priority === "High") return "bg-[#2092EA]/12 text-[#2092EA] border-[#2092EA]/25"
  if (priority === "Medium") return "bg-[#F4F5EF]/6 text-[#F4F5EF]/75 border-[#F4F5EF]/15"
  return "bg-[#5DD62C]/10 text-[#5DD62C] border-[#5DD62C]/25"
}

function getStatusClasses(status) {
  if (status === "On Track") return "bg-[#5DD62C]/10 text-[#5DD62C] border-[#5DD62C]/25"
  if (status === "In Review") return "bg-[#2092EA]/12 text-[#2092EA] border-[#2092EA]/25"
  return "bg-[#F4F5EF]/6 text-[#F4F5EF]/65 border-[#F4F5EF]/18"
}

function Dashboard() {
  return (
    <div className="min-h-full bg-[#212322] p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F4F5EF]"> Welcome,</h1>
        <p className="text-sm text-[#2092EA] mt-1">Overview of projects, tasks, and team activity</p>
        
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => (
          <div key={card.label} className={`rounded-2xl ${borderCard} ${surface} p-4`}>
            <p className="text-xs uppercase tracking-wide text-[#F4F5EF]">{card.label}</p>
            <p className="text-2xl font-bold text-[#2092EA] mt-2">{card.value}</p>
            <p className="text-xs text-[#5DD62C] mt-2 font-medium">{card.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className={`xl:col-span-2 rounded-2xl ${borderCard} ${surface} p-5`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#F4F5EF]">Recent Projects</h2>
            <button type="button" className="text-sm font-medium text-[#2092EA] hover:opacity-80 transition-opacity">
              View all
            </button>
          </div>

          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.name} className={`rounded-xl ${borderCard} bg-[#212322] p-4`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#F4F5EF]">{project.name}</h3>
                    <p className="text-xs text-[#F4F5EF]/50 mt-1">Owner: {project.owner}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusClasses(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="h-2 rounded-full bg-[#F4F5EF]/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2092EA]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#F4F5EF]/45 mt-1">{project.progress}% complete</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl ${borderCard} ${surface} p-5`}>
          <h2 className="text-lg font-semibold text-[#F4F5EF] mb-4">Upcoming Tasks</h2>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.title} className={`rounded-xl ${borderCard} bg-[#212322] p-3`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-[#F4F5EF]">{task.title}</p>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border ${getPriorityClasses(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-xs text-[#F4F5EF]/50 mt-1">{task.due}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`mt-5 rounded-2xl ${borderCard} ${surface} p-5`}>
        <h2 className="text-lg font-semibold text-[#F4F5EF] mb-3">Team Activity</h2>
        <ul className="space-y-2">
          {activityFeed.map((activity) => (
            <li
              key={activity}
              className="text-sm text-[#F4F5EF]/70 rounded-lg border border-[#F4F5EF]/8 bg-[#0c0d0e] px-3 py-2"
            >
              {activity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Dashboard