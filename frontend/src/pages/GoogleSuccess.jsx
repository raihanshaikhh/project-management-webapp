import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function GoogleSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", decodeURIComponent(user));
      navigate("/app/dashboard");
    } else {
      navigate("/auth?error=google_failed");
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
}