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
export const fetchProjects    = ()                         => API.get("/projects")
export const fetchProjectById = (projectId)                => API.get(`/projects/${projectId}`)
export const createProject    = (name, description)        => API.post("/projects", { name, description })
export const updateProject    = (projectId, name, description) => API.patch(`/projects/${projectId}`, { name, description })
export const deleteProject    = (projectId)                => API.delete(`/projects/${projectId}`)

export default API;