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
  useEffect(() => {
    if (!activeProject) {
      setMembers([]); // ✅ clear old members
      return;
    }
    const loadMembers = async () => {
      try {
        const res = await getProjectMembers(activeProject._id);
        setMembers(res.data.data || []);
      } catch (err) {
        console.error("Failed to load members", err);
      }
    };

    loadMembers();
  }, [activeProject]);
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
      // Clean up members cache for deleted project
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

  // ── Members ──────────────────────────────────────────────

  const fetchMembers = async (projectId) => {
    try {
      const { data } = await getProjectMembers(projectId);
      // data.data because your API wraps responses in { data: ... }
      setProjectMembers((prev) => ({ ...prev, [projectId]: data.data }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch members");
    }
  };

  const addMember = async (projectId, email, role = "member") => {
    try {
      const { data } = await addMembersToProject(projectId, email, role);
      if (data?.data) {
        setProjectMembers((prev) => ({
          ...prev,
          [projectId]: [...(prev[projectId] || []), data.data],
        }));
      }
      return data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
      throw err; // re-throw so the modal can show the error
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
        // members
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