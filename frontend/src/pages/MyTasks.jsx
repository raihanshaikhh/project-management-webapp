import { useState } from "react";

// Columns config
const Columns = [
  { id: "todo", label: "To Do", accent: "#378ADD", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: "in-progress", label: "In Progress", accent: "#EF9F27", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { id: "done", label: "Done", accent: "#1D9E75", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
];

// 🔹 Column Component
const Column = ({ col, tasks, onAddTask }) => {
  return (
    <div className={`flex flex-col p-3 rounded-lg border ${col.bg} ${col.border} flex-1 min-w-[250px]`}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: col.accent }} />
          <span className="text-sm font-medium text-white">{col.label}</span>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>

        {/* + Button */}
        <button
          onClick={() => onAddTask(col.id)}
          className="text-zinc-400 hover:text-white text-lg px-2"
        >
          +
        </button>
      </div>

      {/* Tasks */}
      <div className="mt-3 flex flex-col gap-2">
        {tasks.length === 0 ? (
          <p className="text-xs text-zinc-500">No tasks</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="p-3 bg-zinc-800 rounded-md text-sm text-white hover:bg-zinc-700 transition">
              <p className="font-medium">{task.title}</p>
              <p className="text-xs text-zinc-400">{task.project}</p>
              <p className="text-[10px] text-zinc-500 mt-1">Due: {task.due}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 🔹 SearchBar
const SearchBar = () => {
  return (
    <div className="relative mt-6 w-full md:w-64">
      <input
        type="text"
        placeholder="Search tasks..."
        className="w-full pl-4 pr-4 py-2 bg-zinc-800/60 text-zinc-300 rounded-lg border border-zinc-700"
      />
    </div>
  );
};

// 🔹 Main Component
const MyTasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Fix login bug", project: "Mobile App v2", status: "in-progress", due: "Apr 6" },
    { id: 2, title: "Review PR 42", project: "Website Redesign", status: "todo", due: "Apr 7" },
  ]);

  // Group tasks per column
  const groupedTasks = Columns.reduce((acc, col) => {
    acc[col.id] = tasks.filter(t => t.status === col.id);
    return acc;
  }, {});

  // Add task
  const addTask = (status) => {
    const newTask = {
      id: Date.now(),
      title: "New Task",
      project: "Untitled",
      status,
      due: "No date"
    };

    setTasks(prev => [...prev, newTask]);
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Tasks</h1>
          <p className="text-zinc-500 mt-1">All your tasks in one place.</p>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          + New Task
        </button>
      </div>

      {/* Search */}
      <SearchBar />

      {/* Board */}
      <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
        {Columns.map((col) => (
          <Column
            key={col.id}
            col={col}
            tasks={groupedTasks[col.id]}
            onAddTask={addTask}
          />
        ))}
      </div>

    </div>
  );
};

export default MyTasks;