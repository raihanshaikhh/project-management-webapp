import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
function App() {


  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
    </Routes>
  )
}

export default App
