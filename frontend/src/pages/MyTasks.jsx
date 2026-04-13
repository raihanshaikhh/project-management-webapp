import { useState } from "react";
import { motion } from "framer-motion";

const INITIAL_TASKS = [
  { id: "1", title: "Fix login bug", project: "Mobile App v2", projectColor: "#1D9E75", status: "todo", priority: "High", due: "Apr 6", comments: 3, assignees: ["RH", "AM"] },
  { id: "2", title: "Review PR #42", project: "Website Redesign", projectColor: "#378ADD", status: "todo", priority: "Medium", due: "Apr 7", comments: 1, assignees: ["RH"] },
  { id: "3", title: "Write API endpoint docs", project: "API Integration", projectColor: "#D4537E", status: "todo", priority: "Low", due: "Apr 8", comments: 2, assignees: ["SP"] },
  { id: "4", title: "Redesign landing page", project: "Website Redesign", projectColor: "#378ADD", status: "todo", priority: "High", due: "Apr 10", comments: 5, assignees: ["RH", "SP", "AM"] },
  { id: "5", title: "Integrate Stripe API", project: "API Integration", projectColor: "#D4537E", status: "doing", priority: "High", due: "Apr 9", comments: 4, assignees: ["RH", "AM"] },
  
];

const COLUMNS = [
  { id: "todo", label: "To do", accent: "#378ADD" },
  { id: "doing", label: "In Progress", accent: "#EF9F27" },
  { id: "done", label: "Done", accent: "#1D9E75" },
];



const AVATAR_COLORS = {
  RH: "bg-blue-600/30 text-blue-400",
  AM: "bg-pink-600/30 text-pink-400",
  SP: "bg-amber-600/30 text-amber-400",
};

const AvatarStack = ({ assignees }) => (
  <div className="flex -space-x-2">
    {assignees.slice(0, 3).map(a => (
      <div key={a} className={`w-6 h-6 rounded-full border border-zinc-800 flex items-center justify-center text-[9px] font-semibold ${AVATAR_COLORS[a] ?? "bg-zinc-700 text-zinc-300"}`}>
        {a}
      </div>
    ))}
    {assignees.length > 3 && (
      <div className="w-6 h-6 rounded-full border border-zinc-800 bg-zinc-700 flex items-center justify-center text-[9px] text-zinc-400">
        +{assignees.length - 3}
      </div>
    )}
  </div>
);

const DropIndicator = ({ beforeId, column }) => (
  <div
    data-before={beforeId || "-1"}
    data-column={column}
    className="my-0.5 h-0.5 w-full bg-blue-400 opacity-0 rounded-full"
  />
);

const TaskCard = ({ task, handleDragStart }) => {
  const done = task.status === "done";

  return (
    <>
      <DropIndicator beforeId={task.id} column={task.status} />
      <motion.div
        layout
        layoutId={task.id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, task)}
        className="group bg-zinc-900/80 backdrop-blur border border-zinc-800/50 rounded-xl overflow-hidden hover:border-zinc-500 hover:shadow-lg hover:shadow-black/20 transition-colors cursor-grab active:cursor-grabbing"
      >
        {/* <div className={`h-1 w-full ${PRIORITY_BAR[task.priority]}`} /> */}

        <div className="p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${task.priority === "High"
                ? "bg-red-500/20 text-red-400"
                : task.priority === "Medium"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-emerald-500/20 text-emerald-400"
              }`}>
              {task.priority === "High"
                ? "Urgent"
                : task.priority === "Medium"
                  ? "Important"
                  : "Normal"}
            </span>
          </div>
          {/* Title */}
          <p className={`text-sm leading-snug ${done ? "line-through text-zinc-600" : "text-zinc-100"}`}>
            {task.title}
          </p>

          {/* Project tag */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: task.projectColor }} />
            <span className="text-[11px] text-zinc-500">{task.project}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-zinc-500">
              <div className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                <span className="text-[11px]">{task.comments}</span>
              </div>
              <span className="text-[11px]">{task.due}</span>
            </div>
            <AvatarStack assignees={task.assignees} />
          </div>
        </div>
      </motion.div>
    </>
  );
};

const Column = ({ col, tasks, setTasks }) => {
  const [active, setActive] = useState(false);

  const colTasks = tasks.filter(t => t.status === col.id);

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const getIndicators = () =>
    Array.from(document.querySelectorAll(`[data-column="${col.id}"]`));

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();
    indicators.forEach(i => (i.style.opacity = "0"));
  };

  const getNearestIndicator = (e, indicators) => {
    const OFFSET = 50;
    return indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }
        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY, element: indicators[indicators.length - 1] }
    );
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const { element } = getNearestIndicator(e, indicators);
    element.style.opacity = "1";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const handleDragEnd = (e) => {
    const taskId = e.dataTransfer.getData("taskId");
    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const before = element.dataset.before || "-1";

    if (before === taskId) return;

    let copy = [...tasks];
    let taskToMove = copy.find(t => t.id === taskId);
    if (!taskToMove) return;

    taskToMove = { ...taskToMove, status: col.id };
    copy = copy.filter(t => t.id !== taskId);

    if (before === "-1") {
      copy.push(taskToMove);
    } else {
      const idx = copy.findIndex(t => t.id === before);
      copy.splice(idx, 0, taskToMove);
    }

    setTasks(copy);
  };

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Column header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: col.accent }} />
          <span className="text-sm font-medium text-zinc-200">{col.label}</span>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded-full min-w-5 text-center">
            {colTasks.length}
          </span>
        </div>
        <button className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 rounded hover:bg-zinc-800">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      <div className="h-px bg-zinc-800 w-full" />

      {/* Drop zone */}
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-col gap-2 flex-1 min-h-32 rounded-xl transition-colors p-1 ${active ? "bg-zinc-800/30" : "bg-transparent"
          }`}
      >
        {colTasks.length === 0 && !active && (
          <div className="flex flex-col items-center justify-center py-8 gap-2 border border-dashed border-zinc-800 rounded-xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            <p className="text-zinc-700 text-xs">No tasks</p>
          </div>
        )}
        {colTasks.map(task => (
          <TaskCard key={task.id} task={task} handleDragStart={handleDragStart} />
        ))}
        <DropIndicator beforeId={null} column={col.id} />
        {/* Add task */}
        <button className="flex items-center gap-2 text-zinc-600 hover:text-zinc-300 text-sm py-2 px-3 rounded-lg hover:bg-zinc-800/60 transition-colors w-full">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add task
        </button>
      </div>


    </div>
  );
};

export default function MyTasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    : tasks;

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">My Tasks</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            {tasks.filter(t => t.status !== "done").length} tasks remaining
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Task
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm placeholder-zinc-600 rounded-lg focus:outline-none focus:border-zinc-600 transition-colors"
        />
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map(col => (
          <Column key={col.id} col={col} tasks={filtered} setTasks={setTasks} />
        ))}
      </div>
    </div>
  );
}