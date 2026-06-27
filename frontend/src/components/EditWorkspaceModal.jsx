import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspace } from "../context/Workspacecontext.jsx";
import toast from "react-hot-toast";

export default function EditWorkspaceModal({ onClose }) {
    const {
        workspace,
        updateWorkspace,
        myRole,
        leaveWorkspace,
        deleteWorkspace,
    } = useWorkspace();
    const isAdmin = myRole === "admin";  // ✅ add this

    const [name, setName] = useState(workspace?.name || "");
    const [description, setDescription] = useState(workspace?.description || "");
    const [loading, setLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) return toast.error("Workspace name is required");
        try {
            setLoading(true);
            await updateWorkspace({ name: name.trim(), description: description.trim() });
            toast.success("Workspace updated");
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update workspace");
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = async () => {
        try {
            await leaveWorkspace();
            toast.success("Left workspace");
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to leave workspace");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteWorkspace();
            toast.success("Workspace deleted");
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete workspace");
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
                                {isAdmin ? "Edit Workspace" : "Workspace Info"}
                            </h2>
                            <p className="text-zinc-500 text-xs mt-0.5">
                                {isAdmin
                                    ? "Update workspace details and settings"
                                    : "You are a member of this workspace"}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-zinc-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Form — admin only, members see read-only */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-zinc-400 text-xs mb-2">
                                Workspace name
                            </label>
                            {isAdmin ? (
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Workspace name"
                                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-zinc-500 text-zinc-200 text-sm rounded-lg px-3 py-2 outline-none transition-colors"
                                />
                            ) : (
                                <p className="text-zinc-200 text-sm px-3 py-2 bg-zinc-800/50 rounded-lg">
                                    {workspace?.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-zinc-400 text-xs mb-2">
                                Description
                            </label>
                            {isAdmin ? (
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    placeholder="Describe this workspace..."
                                    className="w-full resize-none bg-zinc-800 border border-zinc-700 focus:border-zinc-500 text-zinc-200 text-sm rounded-lg px-3 py-2 outline-none transition-colors"
                                />
                            ) : (
                                <p className="text-zinc-400 text-sm px-3 py-2 bg-zinc-800/50 rounded-lg min-h-[80px]">
                                    {workspace?.description || "No description"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Save button — admin only */}
                    {isAdmin && (
                        <button
                            onClick={handleSave}
                            disabled={loading || !name.trim()}
                            className="w-full mt-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    )}

                    {/* Footer */}
                    <div className="mt-5 pt-4 border-t border-zinc-800">
                        {isAdmin ? (
                            confirmDelete ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-zinc-500 text-xs">
                                        Delete entire workspace?
                                    </span>
                                    <button
                                        onClick={handleDelete}
                                        className="px-3 py-1.5 bg-red-500/15 border border-red-500/30 text-red-400 text-xs rounded-lg hover:bg-red-500/25 transition-colors"
                                    >
                                        Yes, delete
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(false)}
                                        className="px-3 py-1.5 text-zinc-500 text-xs rounded-lg hover:bg-zinc-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setConfirmDelete(true)}
                                    className="flex items-center gap-2 text-red-400 text-xs hover:text-red-300 transition-colors"
                                >
                                    Delete Workspace
                                </button>
                            )
                        ) : (
                            <button
                                onClick={handleLeave}
                                className="flex items-center gap-2 text-zinc-500 text-xs hover:text-red-400 transition-colors"
                            >
                                Leave Workspace
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}