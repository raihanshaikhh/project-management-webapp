import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchProjects,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject,
  addMembersToProject,
  getProjectMembers,
  deleteMember,
} from "../services/Api.js";

import { getToken } from "../Routes/ProtectedRoutes.jsx";

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [projectMembers, setProjectMembers] = useState({});
  const token = getToken();

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await fetchProjects();
      const list = res.data.data.map((entry) => entry.project);
      setProjects(list);
      setActiveProject(list[0] || null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadProjects();
    } else {
      setLoading(false);
    }
  }, [token]);

  // ── Members ──────────────────────────────────────────────

  const fetchMembers = async (projectId) => {
    try {
      const { data } = await getProjectMembers(projectId);
      setProjectMembers((prev) => ({ ...prev, [projectId]: data.data }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch members");
    }
  };

  // FIX 1: useEffect now calls fetchMembers so members are stored as
  // { [projectId]: [...] } — previously called setProjectMembers(res.data.data)
  // which stored a plain array, making projectMembers[projectId] undefined everywhere
  useEffect(() => {
    if (!activeProject) return;
    fetchMembers(activeProject._id);
  }, [activeProject?._id]); // dep on _id only — avoids re-running on object reference changes

  const addProject = async (name, description = "") => {
    try {
      const res = await apiCreateProject(name, description);
      const newProject = res.data.data;
      setProjects((prev) => [...prev, newProject]);
      if (!activeProject) setActiveProject(newProject);
      return newProject;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
      throw err;
    }
  };

  const removeProject = async (projectId) => {
    try {
      await apiDeleteProject(projectId);
      setProjects((prev) => {
        const updated = prev.filter((p) => p._id !== projectId);
        if (activeProject?._id === projectId) {
          setActiveProject(updated[0] || null);
        }
        return updated;
      });
      setProjectMembers((prev) => {
        const updated = { ...prev };
        delete updated[projectId];
        return updated;
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
      throw err;
    }
  };

  const updateProject = async (projectId, name, description) => {
    try {
      const res = await apiUpdateProject(projectId, name, description);
      const updatedProject = res.data.data;
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? updatedProject : p))
      );
      if (activeProject?._id === projectId) setActiveProject(updatedProject);
      return updatedProject;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update project");
      throw err;
    }
  };

  const addMember = async (projectId, email, role = "member") => {
    try {
      await addMembersToProject(projectId, email, role);
      // FIX 2: instead of trying to append data.data (whose shape is unpredictable),
      // re-fetch the full members list so the UI is always in sync with the server
      await fetchMembers(projectId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
      throw err;
    }
  };

  const removeMember = async (projectId, userId) => {
    try {
      await deleteMember(projectId, userId);
      setProjectMembers((prev) => ({
        ...prev,
        [projectId]: (prev[projectId] || []).filter(
          (m) => m.user._id !== userId
        ),
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member");
      throw err;
    }
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        loading,
        error,
        activeProject,
        setActiveProject,
        loadProjects,
        addProject,
        removeProject,
        updateProject,
        projectMembers,
        fetchMembers,
        addMember,
        removeMember,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used inside <ProjectsProvider>");
  }
  return context;
}