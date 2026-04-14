import { useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { projectName } = useParams();

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">{projectName}</h1>
      <p>Project details will come here...</p>
    </div>
  );
}