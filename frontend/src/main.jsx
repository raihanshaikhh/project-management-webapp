import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'


createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#18181b",
            color: "#e4e4e7",
            border: "1px solid #3f3f46",
            fontSize: "13px",
            borderRadius: "10px",
          },
          success: { iconTheme: { primary: "#22c55e", secondary: "#0a0a0a" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#0a0a0a" } },
        }}
      />
    </BrowserRouter>

)