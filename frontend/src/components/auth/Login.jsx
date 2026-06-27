import {
  CardFace,
  BrandHeader,
  InputField,
  EmailIcon,
  LockIcon,
  SubmitButton,
  SocialRow,
} from "./Authcomponents.jsx";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/Api.js";
import toast from "react-hot-toast";

export default function Login({ form, onChange, onSwitch }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      const data = res.data.data; // { user, accessToken, refreshToken }
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Logged in");
      
      navigate("/app/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardFace isBack={false}>
      <BrandHeader
        promptText="Don't have an account?"
        linkLabel="Sign up"
        onSwitch={onSwitch}
      />

      <InputField
        icon={<EmailIcon />}
        type="email"
        name="email"
        placeholder="Email address"
        value={form.email}
        onChange={onChange}
      />
      <InputField
        icon={<LockIcon />}
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={onChange}
      />

      <div className="text-right mb-4 -mt-1">
        <span className="font-outfit text-green-600 text-[12.5px] cursor-pointer hover:text-green-400 transition-colors opacity-85">
          Forgot password?
        </span>
      </div>

      {error && <p className="font-outfit text-red-400 text-xs mb-2">{error}</p>}

      <SubmitButton onClick={handleSubmit}>
        {loading ? "Logging in..." : "Log In"}
      </SubmitButton>

      <SocialRow />
    </CardFace>
  );
}