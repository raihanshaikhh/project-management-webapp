import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchProjects,
  createProject  as apiCreateProject,
  updateProject  as apiUpdateProject,
  deleteProject  as apiDeleteProject,
} from '../services/Api.js';

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, setProjects]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const res  = await fetchProjects();
        const list = res.data.data.map((entry) => entry.project);
        setProjects(list);

        // auto-select the first project so MyTasks always has something to show
        if (list.length > 0) setActiveProject(list[0]);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const addProject = async (name, description = '') => {
    try {
      const res        = await apiCreateProject(name, description);
      const newProject = res.data.data;
      setProjects((prev) => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
      throw err;
    }
  };

  const removeProject = async (projectId) => {
    try {
      await apiDeleteProject(projectId);
      setProjects((prev) => {
        const updated = prev.filter((p) => p._id !== projectId);
        // if the deleted one was active, fall back to the first remaining
        if (activeProject?._id === projectId) {
          setActiveProject(updated[0] ?? null);
        }
        return updated;
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
      throw err;
    }
  };

  const updateProject = async (projectId, name, description) => {
    try {
      const res     = await apiUpdateProject(projectId, name, description);
      const updated = res.data.data;
      setProjects((prev) => prev.map((p) => (p._id === projectId ? updated : p)));
      if (activeProject?._id === projectId) setActiveProject(updated);
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
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
        addProject,
        removeProject,
        updateProject,
      }}
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