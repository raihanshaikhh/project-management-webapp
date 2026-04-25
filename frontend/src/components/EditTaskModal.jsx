import { useState } from "react";

export default function EditTaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);

  const handleSubmit = async () => {
    await onSave({
      title,
      priority,
    });
  };

  return (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800/50 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-lg font-medium text-zinc-100 mb-6 tracking-tight">Edit Task</h2>

      <div className="space-y-5">
        {/* Input Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-zinc-500 ml-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-transparent border-b border-zinc-800 py-2 text-zinc-200 focus:border-blue-500 focus:outline-none transition-colors placeholder:text-zinc-600"
          />
        </div>

        {/* Priority Select */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-zinc-500 ml-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full bg-zinc-800/50 border border-zinc-800 rounded-lg h-10 px-3 text-sm text-zinc-300 focus:outline-none appearance-none cursor-pointer hover:bg-zinc-800 transition-colors"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Urgent</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-6 mt-10">
        <button 
          onClick={onClose}
          className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          Discard
        </button>
        <button
          onClick={handleSubmit}
          className="text-sm font-medium text-white bg-zinc-100/10 hover:bg-zinc-100/20 px-6 py-2 rounded-full border border-zinc-700 transition-all active:scale-95"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}