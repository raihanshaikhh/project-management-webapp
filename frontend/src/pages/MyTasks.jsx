import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTasks, updateTask, createTask } from "../services/Api.js";
import { useProjects } from "../context/Projectscontext.jsx";
import TaskModal from "../components/TaskModal.jsx";

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

const toColumnId = (s) => s === "in_progress" ? "doing" : s === "done" ? "done" : "todo";
const toBackendStatus = (c) => c === "doing" ? "in_progress" : c === "done" ? "done" : "todo";

const formatTask = (t, projectName, projectColor) => ({
  id: t._id,
  title: t.title,
  project: projectName,
  projectColor: projectColor ?? "#378ADD",
  status: toColumnId(t.status),
  priority: t.priority || "Medium",
  due: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No date",
  comments: 0,
  assignees: t.assignedTo
    ? [t.assignedTo.username?.slice(0, 2).toUpperCase() ?? "ME"]
    : ["ME"],
});

// ── Project Dropdown ──────────────────────────────────────────────────────────
const ProjectDropdown = ({ projects, activeProject, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  
  // close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!projects.length) return null;

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-lg text-sm text-zinc-200 transition-colors min-w-[160px] justify-between"
      >
        <div className="flex items-center gap-2 min-w-0">
          {activeProject && (
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: activeProject.color ?? "#378ADD" }}
            />
          )}
          <span className="truncate">
            {activeProject?.name ?? "Select project"}
          </span>
        </div>
        {/* chevron */}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          className={`shrink-0 text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1.5 z-50 w-56 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl shadow-black/40 overflow-hidden"
          >
            <div className="p-1 flex flex-col gap-0.5 max-h-64 overflow-y-auto">
              {projects.map((p) => {
                const isActive = activeProject?._id === p._id;
                return (
                  <button
                    key={p._id}
                    onClick={() => { onSelect(p); setOpen(false); }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-left transition-colors
                      ${isActive
                        ? "bg-blue-500/10 text-blue-400"
                        : "text-zinc-300 hover:bg-zinc-800"
                      }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: p.color ?? "#378ADD" }}
                    />
                    <span className="truncate flex-1">{p.name}</span>
                    {isActive && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

const AvatarStack = ({ assignees }) => (
  <div className="flex -space-x-2">
    {assignees.slice(0, 3).map((a) => (
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
        <div className="p-3 flex flex-col gap-3">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium w-fit ${task.priority === "High" ? "bg-red-500/20 text-red-400" :
            task.priority === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
              "bg-emerald-500/20 text-emerald-400"
            }`}>
            {task.priority === "High" ? "Urgent" : task.priority === "Medium" ? "Important" : "Normal"}
          </span>
          <p className={`text-sm leading-snug ${done ? "line-through text-zinc-600" : "text-zinc-100"}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: task.projectColor }} />
            <span className="text-[11px] text-zinc-500">{task.project}</span>
          </div>
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

const Column = ({ col, tasks, setTasks, openModal }) => {
  const [active, setActive] = useState(false);
  const colTasks = tasks.filter((t) => t.status === col.id);

  const handleDragStart = (e, task) => e.dataTransfer.setData("taskId", task.id);
  const getIndicators = () => Array.from(document.querySelectorAll(`[data-column="${col.id}"]`));
  const clearHighlights = (els) => (els || getIndicators()).forEach((i) => (i.style.opacity = "0"));

  const getNearestIndicator = (e, indicators) => {
    const OFFSET = 50;
    return indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + OFFSET);
        return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
      },
      { offset: Number.NEGATIVE_INFINITY, element: indicators[indicators.length - 1] }
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    clearHighlights();
    const { element } = getNearestIndicator(e, getIndicators());
    element.style.opacity = "1";
    setActive(true);
  };
  const handleDragLeave = () => { clearHighlights(); setActive(false); };

  const handleDragEnd = async (e) => {
    const taskId = e.dataTransfer.getData("taskId");
    setActive(false);
    clearHighlights();

    const { element } = getNearestIndicator(e, getIndicators());
    const before = element.dataset.before || "-1";
    if (before === taskId) return;

    let copy = [...tasks];
    let taskToMove = copy.find((t) => t.id === taskId);
    if (!taskToMove) return;

    taskToMove = { ...taskToMove, status: col.id };
    copy = copy.filter((t) => t.id !== taskId);
    const idx = before === "-1" ? copy.length : copy.findIndex((t) => t.id === before);
    copy.splice(idx, 0, taskToMove);
    setTasks(copy);

    try {
      await updateTask(taskId, { status: toBackendStatus(col.id) });
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  };

  return (
    <div className="flex flex-col gap-3 min-w-0">
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

      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-col gap-2 flex-1 min-h-32 rounded-xl transition-colors p-1 ${active ? "bg-zinc-800/30" : "bg-transparent"}`}
      >
        {colTasks.length === 0 && !active && (
          <div className="flex flex-col items-center justify-center py-8 gap-2 border border-dashed border-zinc-800 rounded-xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            <p className="text-zinc-700 text-xs">No tasks</p>
          </div>
        )}
        {colTasks.map((task) => (
          <TaskCard key={task.id} task={task} handleDragStart={handleDragStart} />
        ))}
        <DropIndicator beforeId={null} column={col.id} />
        <button
          onClick={() => openModal(col.id)}
          className="flex items-center gap-2 text-zinc-600 hover:text-zinc-300 text-sm py-2 px-3 rounded-lg hover:bg-zinc-800/60 transition-colors w-full"
        >
          Add task
        </button>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState("todo");

  const { projects, activeProject, setActiveProject } = useProjects();

  // fetch tasks whenever activeProject changes
  useEffect(() => {
    if (!activeProject) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchTasks(activeProject._id);
        setTasks(res.data.data.map((t) => formatTask(t, activeProject.name, activeProject.color)));
      } catch (err) {
        console.error("Failed to fetch tasks", err);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeProject]);

  const filtered = search.trim()
    ? tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    : tasks;

  return (
    <div className="p-6 flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-white">My Tasks</h1>
            <p className="text-zinc-500 text-sm mt-0.5">
              {activeProject
                ? `${tasks.filter((t) => t.status !== "done").length} tasks remaining`
                : "No projects yet"}
            </p>
          </div>

          {/* Project dropdown sits right next to the title */}
          <ProjectDropdown
            projects={projects}
            activeProject={activeProject}
            onSelect={setActiveProject}
          />
        </div>

        {activeProject && (
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Task
          </button>
        )}
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* ── Empty state (no projects at all) ── */}
      {!loading && !error && !activeProject && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 border border-dashed border-zinc-800 rounded-2xl">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <p className="text-zinc-600 text-sm">Create a project from the sidebar to get started</p>
        </div>
      )}

      {/* ── Search + Kanban ── */}
      {!loading && !error && activeProject && (
        <>
          <div className="relative max-w-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm placeholder-zinc-600 rounded-lg focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                col={col}
                tasks={filtered}
                setTasks={setTasks}
                openModal={(status) => {
                  setNewStatus(status);
                  setShowModal(true);
                }}
              />
            ))}
          </div>
          {showModal && (
  <TaskModal
    status={newStatus}
    onClose={() => setShowModal(false)}
    onSave={async (taskData) => {
      try {
        const res = await createTask(activeProject._id, taskData);

        const formattedTask = formatTask(
          res.data.data,
          activeProject.name,
          activeProject.color
        );

        setTasks((prev) => [formattedTask, ...prev]);
        setShowModal(false);

      } catch (error) {
        console.error("Task create failed:", error);
      }
    }}
  />
)}
        </>
      )}
    </div>

  );
}