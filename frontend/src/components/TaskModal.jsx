import { useState } from "react";
import { X, Check } from "lucide-react";
import { fetchTasks, createTask } from "../services/Api";

export default function TaskModal({ status, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [color, setColor] = useState("#3B82F6");

  const priorities = ["Low", "Medium", "High", "Urgent"];

  const colors = [
    "#3B82F6", "#F59E0B", "#A3A3A3", "#F97316", "#FACC15",
    "#B08968", "#EC4899", "#84CC16", "#7C3AED", "#A21CAF", "#DB2777",
  ];

const handleSubmit = async () => {
  if (!title.trim()) return;

  const subTask = {
    title,
    description: desc,
    status,
    priority
  };
  console.log("subTask:", subTask);
  await onSave(subTask);
  onClose();
  
}

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen z-999 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
    >
      <div className="relative w-full max-w-110 mx-4 max-h-[85vh] overflow-y-auto rounded-2xl border border-zinc-800 shadow-2xl"
        style={{ backgroundColor: "#0B1120" }}
      >
        <div className="p-6">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-lg border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <h2 className="text-2xl font-semibold text-white mb-1">Create new task</h2>
          <p className="text-zinc-500 text-sm mb-6">Add a task and keep your workflow moving.</p>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm text-zinc-300 mb-2">Title</label>
            <input
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="w-full h-11 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm text-zinc-300 mb-2">Description</label>
            <textarea
              rows={3}
              maxLength={500}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Enter description"
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-600 outline-none focus:border-zinc-600 resize-none transition-colors"
            />
          </div>

          {/* Priority */}
          <div className="mb-4">
            <label className="block text-sm text-zinc-300 mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-600 transition-colors"
            >
              {priorities.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          {/* Label Colour */}
          <div className="mb-6">
            <label className="block text-sm text-zinc-300 mb-3">Label Colour</label>
            <div className="flex gap-2.5 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ring-2 ring-offset-2 ring-offset-[#0B1120]"
                  style={{
                    background: c,
                    ringColor: color === c ? c : "transparent",
                    outline: color === c ? `2px solid ${c}` : "2px solid transparent",
                    outlineOffset: "2px",
                  }}
                >
                  {color === c && <Check size={14} className="text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 h-10 rounded-xl border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
            >
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}