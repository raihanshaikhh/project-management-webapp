import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import Sidebar from "./components/auth/layout/Sidebar.jsx";
function App() {


  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      {<Route path = "/sidebar" element={<Sidebar />} />}
    </Routes>
  )
}

export default App
