import { Outlet } from "react-router-dom";
import { ProjectsProvider } from "./context/Projectscontext.jsx";
import { WorkspaceProvider } from "./context/Workspacecontext.jsx";

export default function AppProviders() {
  return (
    <WorkspaceProvider>
    <ProjectsProvider>
      <Outlet />
    </ProjectsProvider>
    </WorkspaceProvider>
  );
}