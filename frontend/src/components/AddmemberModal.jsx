import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspace } from "../context/WorkspaceContext.jsx"; // ← swapped
import toast from "react-hot-toast";

export default function AddMemberModal({ onClose }) { // ← removed projectId, not needed
  const { members, inviteMember, removeMember, myRole } = useWorkspace(); // ← swapped
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ← removed: const members = projectMembers[projectId] || [];
  // members comes directly from workspace context now

  const handleAdd = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      await inviteMember(email, role); // ← swapped, no projectId
      setEmail("");
      toast.success("Member invited");
    } catch (err) {
      const message = err.response?.data?.message || "User not found";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    try {
      await removeMember(userId); // ← swapped, no projectId
      toast.success("Member removed");
    } catch (err) {
      toast.error("Failed to remove member");
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
              <h2 className="text-white font-semibold text-base">
                Workspace Members
              </h2>
              <p className="text-zinc-500 text-xs mt-0.5">
                Invite people to your workspace
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Only admins can invite */}
          {myRole === "admin" && (
            <div className="flex flex-col gap-2 mb-5">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email address..."
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-zinc-500 text-zinc-200 text-sm placeholder-zinc-600 rounded-lg px-3 py-2 outline-none transition-colors"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-lg px-2 py-2 outline-none"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {error && <p className="text-red-400 text-xs px-1">{error}</p>}

              <button
                onClick={handleAdd}
                disabled={loading || !email.trim()}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Invite Member
                  </>
                )}
              </button>
            </div>
          )}

          <div className="h-px bg-zinc-800 mb-4" />

          {/* Members list */}
          <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
            {members.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-zinc-600 text-sm">No members yet</p>
                <p className="text-zinc-700 text-xs mt-1">Invite someone above</p>
              </div>
            ) : (
              members.map((m) => {
                const initials = `${m.user?.username?.[0] || ""}${m.user?.lastname?.[0] || ""}`.toUpperCase() || "?";
                return (
                  <div
                    key={m._id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-zinc-800/60 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-xs font-semibold text-blue-400">
                        {initials}
                      </div>
                      <div>
                        <p className="text-zinc-200 text-sm font-medium">
                          {m.user?.username} {m.user?.lastname}
                        </p>
                        <p className="text-zinc-500 text-xs">{m.user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                        ${m.role === "owner"
                          ? "bg-amber-500/15 text-amber-400"
                          : m.role === "admin"
                          ? "bg-purple-500/15 text-purple-400"
                          : "bg-zinc-700/60 text-zinc-400"
                        }`}
                      >
                        {m.role}
                      </span>

                      {/* only admins can remove, and can't remove other admins */}
                      {myRole === "admin" && m.role !== "admin" && (
                        <button
                          onClick={() => handleRemove(m.user._id)}
                          className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all p-1 rounded"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}