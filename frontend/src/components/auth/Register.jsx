import {
  CardFace,
  BrandHeader,
  InputField,
  EmailIcon,
  LockIcon,
  UserIcon,
  SubmitButton,
  SocialRow,
} from "./Authcomponents.jsx";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/Api.js";

export default function Register({ form, onChange, onSwitch }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await API.post("/auth/register", {
        username: form.name,
        email: form.email,
        password: form.password,
      });
       if (form.password !== form.confirm) {
    setError("Passwords do not match");
    return;
  }
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardFace isBack={true}>
      <BrandHeader
        promptText="Already have an account?"
        linkLabel="Log in"
        onSwitch={onSwitch}
      />

      <InputField
        icon={<UserIcon />}
        type="text"
        name="name"
        placeholder="Username"
        value={form.name}
        onChange={onChange}
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
      <InputField
        icon={<LockIcon />}
        type="password"
        name="confirm"
        placeholder="Confirm password"
        value={form.confirm}
        onChange={onChange}
      />

      <div className="h-2.5" />

      {error && <p className="font-outfit text-red-400 text-xs mb-2">{error}</p>}

      <SubmitButton onClick={handleSubmit}>
        {loading ? "Creating account..." : "Create Account"}
      </SubmitButton>

      <SocialRow />
    </CardFace>
  );
}