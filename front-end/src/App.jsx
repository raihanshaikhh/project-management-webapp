import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Cursor from "./components/Cursor.jsx"
import Dashboard from "./pages/Dashboard.jsx"

function App() {
  return (
    <>
    <Cursor />
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={< Dashboard/>}/>
    </Routes>
    </>
  )
}

export default App