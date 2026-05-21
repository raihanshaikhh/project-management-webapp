import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspace } from "../context/Workspacecontext.jsx";
import { createWorkspace } from "../services/Api.js";
import toast from "react-hot-toast";

export default function WorkspaceModal({ onClose }) {
  const { loadWorkspace } = useWorkspace();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createWorkspace(name.trim(), description.trim());
      await loadWorkspace(); // re-fetch so WorkspaceContext updates
      toast.success("Workspace created");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold text-base">Create Workspace</h2>
              <p className="text-zinc-500 text-xs mt-0.5">Set up your team's workspace</p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-3 mb-5">
            <input
              type="text"
              placeholder="Workspace name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-zinc-500 text-zinc-200 text-sm placeholder-zinc-600 rounded-lg px-3 py-2 outline-none transition-colors"
            />
            <textarea
              placeholder="Description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-zinc-500 text-zinc-200 text-sm placeholder-zinc-600 rounded-lg px-3 py-2 outline-none transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "Create Workspace"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}