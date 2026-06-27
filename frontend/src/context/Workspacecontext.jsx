import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchMyWorkspace,
  fetchWorkspaceMembers,
  inviteWorkspaceMember,
  removeWorkspaceMember,
  deleteWorkspaceApi,
  leaveWorkspaceApi,
  updateWorkspaceAPI,

} from "../services/Api.js";
import { getToken } from "../Routes/ProtectedRoutes.jsx";
import  socket  from "../services/socket.js";

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [workspace, setWorkspace] = useState(null);
  const [members, setMembers] = useState([]);
  const [myRole, setMyRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = getToken();
  const leaveWorkspace = async () => {
  await leaveWorkspaceApi();
  setWorkspace(null);
  setMembers([]);
  setMyRole(null);
};
const deleteWorkspace = async () => {
  await deleteWorkspaceApi();
  setWorkspace(null);
  setMembers([]);
  setMyRole(null);
};
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return;

    socket.emit("joinUserRoom", user._id);
    socket.on("connect", () => {
    socket.emit("joinUserRoom", user._id); // re-join after reconnect
  });
    socket.on("workspaceInvite", () => {
      loadWorkspace();
    });

    return () => {
      socket.off("workspaceInvite");
    };
  }, []); // runs once on mount
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    loadWorkspace();
  }, [token]);

const loadWorkspace = async () => {
  try {
    setLoading(true);
    const res = await fetchMyWorkspace();
    const data = res.data.data;
    setWorkspace(data.workspace);
    setMembers(data.workspace.members ?? []);
    setMyRole(data.role);
  } catch (err) {
    if (err.response?.status === 404) {
      // no workspace yet — not an error
      setWorkspace(null);
      setMembers([]);
      setMyRole(null);
    } else {
      setError(err.response?.data?.message || "Failed to load workspace");
    }
  } finally {
    setLoading(false);
  }
};

  const inviteMember = async (email, role = "member") => {
    await inviteWorkspaceMember(email, role);
    await loadWorkspace(); // re-fetch so members list is in sync
  };

  const removeMember = async (userId) => {
    await removeWorkspaceMember(userId);
    setMembers((prev) => prev.filter((m) => m.user._id !== userId));
  };
const updateWorkspace = async ({ name, description }) => {
  try {
    const res = await updateWorkspaceAPI({ name, description });
    const updated = res.data.data.workspace; // same shape as fetchMyWorkspace
    setWorkspace(updated);
    setMembers(updated.members ?? []);
    return { success: true };
  } catch (err) {
    const message = err.response?.data?.message || "Failed to update workspace";
    return { success: false, message };
  }
};
  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        updateWorkspace,
        members,
        myRole,
        loading,
        error,
        loadWorkspace,
        inviteMember,
        removeMember,
        leaveWorkspace,
        deleteWorkspace,
        
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  return ctx;
}