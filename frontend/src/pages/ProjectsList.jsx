import React, { useState } from 'react';
import { useProjects } from '../context/Projectscontext';

const COLOR_OPTIONS = [
  '#378ADD', '#1D9E75', '#D85A30', '#D4537E',
  '#BA7517', '#7C3AED', '#0EA5E9', '#10B981',
];
const Toast = ({ message, onClose, undo }) => (
  <div className="fixed bottom-4 left-4/5 transform -translate-x-1/2 bg-black text-zinc-300 px-4 py-2 rounded shadow">
    {message}
    {undo && (
      <button onClick={undo} className="ml-4 underline">
        Undo
      </button>
    )}
    <button onClick={onClose} className="ml-4 text-sm opacity-70 hover:opacity-100">
      Dismiss
    </button>
  </div>
);
export default function ProjectsList({ compact = false }) {
  const { projects, addProject, removeProject, activeProject, setActiveProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(COLOR_OPTIONS[0]);
  const [newDescription, setNewDescription] = useState('');
  const [toast, setToast] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const handleDelete = (_id) => {
    const deletedProject = projects.find(p => p._id === _id);

    removeProject(_id);

    setToast({
      message: "Project deleted",
      undo: () => addProject(deletedProject.name, deletedProject.description).then((res) => {      // we need to restore the deleted project with its original ID for the UI to update correctly
        const restored = { ...res, _id: deletedProject._id };
        addProject((prev) => [...prev, restored]);
      }
      )
    });

    setTimeout(() => setToast(null), 5000);
  };
  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    addProject(trimmed, newDescription);
    setNewName('');
    setNewColor(COLOR_OPTIONS[0]);
    setShowForm(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') setShowForm(false);
  };

  return (
    <div className="flex flex-col gap-0.5">
      {/* Section header */}
      <div className="flex items-center justify-between px-2 mb-1">
        {!compact && (
          <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-300">
            Projects
          </p>
        )}
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-zinc-600 hover:text-white p-0.5 rounded transition-colors ml-auto"
          title="New project"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {showForm
              ? <><line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" /></>
              : <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>}
          </svg>
        </button>
      </div>

      {/* New project inline form */}
      {showForm && (
        <div className="mx-1 mb-2 p-2 rounded-md bg-zinc-900 border border-zinc-700 flex flex-col gap-2">
          <input
            autoFocus
            type="text"
            placeholder="Project name…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-600 outline-none border-b border-zinc-700 pb-1"
          />
          <textarea
            placeholder="Description (optional)…"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-600 outline-none border-b border-zinc-700 pb-1 resize-none"
          />
          {/* Color picker */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setNewColor(c)}
                className={`w-4 h-4 rounded-full transition-transform ${newColor === c ? 'scale-125 ring-2 ring-white/30' : ''}`}
                style={{ background: c }}
                title={c}
              />
            ))}
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors px-2 py-1 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-1 rounded transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Projects list */}
      {projects.map(({ _id, name, color }) => (
        <div
          key={_id}
          onClick={() => setActiveProject({ _id, name, color })}
          className={`group flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer
      ${activeProject?._id === _id
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              : 'text-zinc-400 hover:bg-blue-950 hover:text-white'
            }`}
        >
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
          <span className="truncate flex-1">{name}</span>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(_id); }}
            className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all p-0.5 rounded"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </div>
      ))}
      {toast && (
        <Toast
          message={toast.message}
          undo={toast.undo}
          onClose={() => setToast(null)}
        />
      )}

      {projects.length === 0 && (
        <p className="text-xs text-zinc-600 px-3 py-2 italic">No projects yet.</p>
      )}
    </div>
  );
}