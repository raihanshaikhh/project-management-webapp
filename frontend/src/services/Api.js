import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true
})

API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token")

  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }

  return req
})
// ── Project API calls ──────────────────────────────────
export const fetchProjects = () => API.get("/projects")
export const fetchProjectById = (projectId) => API.get(`/projects/${projectId}`)
export const createProject = (name, description) => API.post("/projects", { name, description })
export const updateProject = (projectId, name, description) => API.patch(`/projects/${projectId}`, { name, description })
export const deleteProject = (projectId) => API.delete(`/projects/${projectId}`)

// ── Task API calls ─────────────────────────────────────
export const fetchTasks = (projectId) => API.get(`/projects/${projectId}/tasks`)
export const createTask = (projectId, data) => API.post(`/projects/${projectId}/tasks`, data)
export const fetchTaskById = (taskId) => API.get(`/tasks/${taskId}`)
export const updateTask = (taskId, data) => API.patch(`/tasks/${taskId}`, data)
export const deleteTask = (taskId) => API.delete(`/tasks/${taskId}`)

// ── SubTask API calls ──────────────────────────────────
export const createSubTask = (taskId, title) => API.post(`/tasks/${taskId}/subtasks`, { title })
export const updateSubTask = (subtaskId, data) => API.patch(`/subtasks/${subtaskId}`, data)
export const deleteSubTask = (subtaskId) => API.delete(`/subtasks/${subtaskId}`)


export default API;