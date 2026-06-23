import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useWorkspace } from "../../context/Workspacecontext.jsx";
import AddMemberModal from "../AddmemberModal.jsx";
import WorkspaceModal from "../WorkspaceModal.jsx";
import EditWorkspaceModal from "../EditWorkspaceModal.jsx";

const DashboardLayout = () => {
  const { workspace } = useWorkspace();

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showEditWorkspaceModal, setShowEditWorkspaceModal] = useState(false);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-zinc-950 border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
          {/* Workspace name */}
          <div className="flex items-center gap-2">
            {workspace ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-zinc-300 text-sm font-medium">
                  {workspace.name}
                </span>
              </>
            ) : (
              <span className="text-zinc-600 text-sm">No workspace</span>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {workspace ? (
              <>
                {/* Invite */}
                <button
                  onClick={() => setShowMemberModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                    <path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>
                  Invite
                </button>

                {/* Edit Workspace */}
                <button
                  onClick={() => setShowEditWorkspaceModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                  Edit Workspace
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowWorkspaceModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create Workspace
              </button>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 bg-zinc-950 p-6">
          <Outlet />
        </main>
      </div>

      {/* Modals */}
      {showMemberModal && (
        <AddMemberModal onClose={() => setShowMemberModal(false)} />
      )}

      {showWorkspaceModal && (
        <WorkspaceModal onClose={() => setShowWorkspaceModal(false)} />
      )}

      {showEditWorkspaceModal && (
        <EditWorkspaceModal
          onClose={() => setShowEditWorkspaceModal(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;