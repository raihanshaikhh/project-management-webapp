import { Outlet } from "react-router-dom";
import { ProjectsProvider } from "./context/Projectscontext.jsx";

export default function AppProviders() {
  return (
    <ProjectsProvider>
      <Outlet />
    </ProjectsProvider>
  );
}