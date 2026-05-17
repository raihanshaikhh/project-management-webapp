import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchMyWorkspace } from "../services/Api.js";
import { getToken } from "../Routes/ProtectedRoutes.jsx";

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [workspace, setWorkspace] = useState(null);
  const [members, setMembers] = useState([]);
  const [myRole, setMyRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getToken();

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    loadWorkspace();
  }, [token]);

  const loadWorkspace = async () => {
    try {
      setLoading(true);
      const res = await fetchMyWorkspace();
      const data = res.data.data; // { workspace: {...}, role: "admin" }

      setWorkspace(data.workspace);
      setMembers(data.workspace.members ?? []);
      setMyRole(data.role);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{ workspace, members, myRole, loading, error, loadWorkspace }}
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