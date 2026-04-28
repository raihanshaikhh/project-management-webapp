import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Paperclip,
  Link2,
  Trash2,
  Plus,
  Check,
  FileText,
  Image,
  File,
  Archive,
  ExternalLink,
} from "lucide-react";

// ─── constants ────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  Low: { active: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" },
  Medium: { active: "bg-yellow-500/10  border-yellow-500/30  text-yellow-400" },
  High: { active: "bg-orange-500/10  border-orange-500/30  text-orange-400" },
  Urgent: { active: "bg-red-500/10     border-red-500/30     text-red-400" },
};

const FILE_ICON_MAP = {
  pdf: { icon: FileText, bg: "bg-red-500/10", text: "text-red-400" },
  png: { icon: Image, bg: "bg-blue-500/10", text: "text-blue-400" },
  jpg: { icon: Image, bg: "bg-blue-500/10", text: "text-blue-400" },
  jpeg: { icon: Image, bg: "bg-blue-500/10", text: "text-blue-400" },
  docx: { icon: FileText, bg: "bg-violet-500/10", text: "text-violet-400" },
  zip: { icon: Archive, bg: "bg-yellow-500/10", text: "text-yellow-400" },
};

function getFileIcon(filename = "") {
  const ext = filename.split(".").pop()?.toLowerCase();
  return FILE_ICON_MAP[ext] || { icon: File, bg: "bg-zinc-800", text: "text-zinc-400" };
}

// ─── sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Icon size={12} className="text-zinc-500" />
      <span className="text-[10.5px] font-semibold tracking-widest uppercase text-zinc-500">
        {children}
      </span>
    </div>
  );
}

function AttachmentItem({ file, onRemove }) {
  const { icon: Icon, bg, text } = getFileIcon(file.name);
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] group"
    >
      <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${bg}`}>
        <Icon size={13} className={text} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-medium text-zinc-300 truncate">{file.name}</p>
        <p className="text-[10.5px] text-zinc-600 mt-0.5">{file.size}</p>
      </div>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md flex items-center justify-center
                   text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
      >
        <X size={10} />
      </button>
    </motion.div>
  );
}

function LinkItem({ link, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] group"
    >
      <Link2 size={12} className="text-zinc-600 shrink-0" />
      <a
        href={link.url}
        target="_blank"
        rel="noreferrer"
        className="flex-1 truncate text-[12px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
      >
        {link.url}
        <ExternalLink size={10} className="shrink-0" />
      </a>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md flex items-center justify-center
                   text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
      >
        <X size={10} />
      </button>
    </motion.div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function EditTaskModal({ task = {}, members = [], onClose, onSave, onDelete }) {

  // ── state ──────────────────────────────────────────────────────────────────
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "Medium");
  const [assignee, setAssignee] = useState(task.assignedTo?._id || task.assignedTo || "");
  // add to state at the top of EditTaskModal
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );
  const [attachments, setAttachments] = useState(task.attachments || []);
  const [links, setLinks] = useState(task.links || []);
  const [linkInput, setLinkInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fileRef = useRef(null);

  // ── handlers ───────────────────────────────────────────────────────────────

  const handleSave = async () => {
    let finalLinks = [...links];

    if (linkInput.trim()) {
      finalLinks.push({ id: Date.now(), url: normalizeUrl(linkInput.trim()) });
    }
    try {
      setSaving(true);
      console.log("Saving links:", links);
      const ok = await onSave?.({
        title,
        description,
        priority,
        assignedTo: assignee || null,
        dueDate: dueDate || null,
        attachments,
        links: links.map(l => ({ url: l.url }))
      });
      if (ok !== false) {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  // ↑ handleSave closes here — handleFileChange and addLink are sibling functions below

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map((f) => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: f.size > 1_000_000
        ? `${(f.size / 1_000_000).toFixed(1)} MB`
        : `${Math.round(f.size / 1000)} KB`,
    }));
    setAttachments((prev) => [...prev, ...mapped]);
    e.target.value = "";
  };
  const normalizeUrl = (value) => {
    if (!value) return value;
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  };
  const addLink = () => {
    const value = linkInput.trim();
    if (!value) return;
    setLinks((prev) => [...prev, { id: Date.now(), url: normalizeUrl(value) }]);
    setLinkInput("");
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[520px] bg-[#111112] border border-white/[0.08] rounded-[20px] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-zinc-600">
            Edit Task
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/[0.05] text-zinc-500 hover:text-zinc-300
                       hover:bg-white/10 flex items-center justify-center transition-all"
          >
            <X size={12} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5 max-h-[480px] overflow-y-auto">

          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
            className="w-full bg-transparent border-b border-white/10 text-zinc-100 text-[16px]
                       font-medium pb-2.5 outline-none focus:border-blue-500 transition-colors
                       placeholder:text-zinc-700"
          />

          {/* Description */}
          <div>
            <SectionLabel icon={FileText}>Description</SectionLabel>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more context..."
              className="w-full resize-none rounded-[10px] bg-white/[0.03] border border-white/[0.07]
                         px-3 py-2.5 text-zinc-400 text-[13px] outline-none
                         focus:border-blue-500/40 focus:bg-blue-500/[0.03] transition-all"
            />
          </div>

          {/* Priority */}
          <div>
            <SectionLabel icon={Check}>Priority</SectionLabel>
            <div className="grid grid-cols-4 gap-1.5">
              {Object.keys(PRIORITY_CONFIG).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-1.5 rounded-[8px] border text-[11px] font-semibold transition-all
                    ${priority === p
                      ? PRIORITY_CONFIG[p].active
                      : "bg-white/[0.03] border-white/[0.07] text-zinc-600 hover:text-zinc-400"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Assignee + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <SectionLabel icon={Check}>Assignee</SectionLabel>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full h-9 px-3 rounded-[8px] bg-white/[0.04] border border-white/[0.07]
                           text-zinc-400 text-[12px] outline-none appearance-none cursor-pointer
                           hover:bg-white/[0.06] transition-colors"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>{m.username}</option>
                ))}
              </select>
            </div>
            <div>
              <SectionLabel icon={Check}>Due Date</SectionLabel>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-9 px-3 rounded-[8px] bg-white/[0.04] border border-white/[0.07]
                           text-zinc-400 text-[12px] outline-none hover:bg-white/[0.06] transition-colors"
              />
            </div>
          </div>

          <hr className="border-white/[0.05]" />

          {/* Attachments */}
          <div>
            <SectionLabel icon={Paperclip}>Attachments</SectionLabel>
            <div
              onClick={() => fileRef.current?.click()}
              className="border border-dashed border-white/10 rounded-[10px] py-4 flex flex-col
                         items-center gap-1.5 cursor-pointer hover:border-blue-500/40
                         hover:bg-blue-500/[0.03] transition-all group"
            >
              <Paperclip size={18} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
              <p className="text-[11.5px] text-zinc-600">Click to upload</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="mt-2 flex flex-col gap-1.5">
              <AnimatePresence>
                {attachments.map((file) => (
                  <AttachmentItem
                    key={file.id}
                    file={file}
                    onRemove={() =>
                      setAttachments((prev) => prev.filter((x) => x.id !== file.id))
                    }
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          <hr className="border-white/[0.05]" />

          {/* Links */}
          <div>
            <SectionLabel icon={Link2}>Links & Documents</SectionLabel>
            <div className="flex gap-2">
              <input
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLink()}
                placeholder="https://..."
                className="flex-1 h-9 px-3 rounded-[8px] bg-white/[0.04] border border-white/[0.07]
                           text-zinc-400 text-[12px] outline-none focus:border-blue-500/40
                           transition-colors placeholder:text-zinc-700"
              />
              <button
                onClick={addLink}
                className="h-9 px-3 rounded-[8px] bg-blue-500/10 border border-blue-500/20
                           text-blue-400 flex items-center gap-1.5 text-[12px] font-semibold
                           hover:bg-blue-500/18 transition-all"
              >
                <Plus size={12} />
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              <AnimatePresence>
                {links.map((link) => (
                  <LinkItem
                    key={link.id}
                    link={link}
                    onRemove={() =>
                      setLinks((prev) => prev.filter((x) => x.id !== link.id))
                    }
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500">Sure?</span>
              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 h-9 px-3.5 rounded-[10px] border border-red-500/40
                 bg-red-500/15 text-red-400 text-[12px] font-semibold
                 hover:bg-red-500/25 transition-all active:scale-95"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="h-9 px-3 rounded-[10px] border border-white/[0.08] text-zinc-500 text-[12px]
                 hover:bg-white/[0.05] transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-[10px] border border-red-500/20
               bg-red-500/[0.06] text-red-400 text-[12px] font-semibold
               hover:bg-red-500/12 hover:border-red-500/35 transition-all active:scale-95"
            >
              <Trash2 size={13} />
              Delete Task
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="h-9 px-4 rounded-[10px] border border-white/[0.08] text-zinc-500 text-[12px]
                         hover:bg-white/[0.05] hover:text-zinc-300 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 h-9 px-4 rounded-[10px] bg-blue-600
                         hover:bg-blue-500 text-white text-[12px] font-semibold
                         disabled:opacity-50 transition-all active:scale-95"
            >
              {saved && <Check size={12} />}
              {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}