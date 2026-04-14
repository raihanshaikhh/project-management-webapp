import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchProjects,
  createProject  as apiCreateProject,
  updateProject  as apiUpdateProject,
  deleteProject  as apiDeleteProject,
} from '../services/Api.js';
const DEFAULT_PROJECTS = [
  { id: '1', name: 'Website Redesign', color: '#378ADD' },
  { id: '2', name: 'Mobile App v2',    color: '#1D9E75' },
  { id: '3', name: 'Q3 Marketing',     color: '#D85A30' },
  { id: '4', name: 'API Integration',  color: '#D4537E' },
  { id: '5', name: 'Design System',    color: '#BA7517' },
];

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

    useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const res = await fetchProjects();
        // your backend returns: [{ project: {...}, role: "..." }, ...]
        // we pull out the nested project object from each entry
        const list = res.data.data.map((entry) => entry.project);
        setProjects(list);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);


  const addProject = async (name, description = '') => {
    try {
      const res = await apiCreateProject(name, description);
      const newProject = res.data.data; // backend returns the created project
      setProjects((prev) => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
      throw err; // so the form can catch it too if needed
    }
  };
  const removeProject = async (projectId) => {
    try {
      await apiDeleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
      throw err;
    }
  };

 const updateProject = async (projectId, name, description) => {
    try {
      const res = await apiUpdateProject(projectId, name, description);
      const updated = res.data.data;
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? updated : p))
      );
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update project");
      throw err;
    }
  };

  return (
    <ProjectsContext.Provider
      value={{ projects, loading, error, addProject, removeProject, updateProject }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be used inside <ProjectsProvider>');
  return ctx;
}