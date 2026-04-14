import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ProjectsProvider } from './context/Projectscontext.jsx'

createRoot(document.getElementById('root')).render(
  <ProjectsProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ProjectsProvider>
)