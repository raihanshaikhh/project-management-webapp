import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AUTH_KEYFRAMES, BgTile } from "../components/auth/Authcomponents.jsx";
import Login    from "../components/auth/Login.jsx";
import Register from "../components/auth/Register.jsx";

const LOGIN_H    = 480;
const REGISTER_H = 572;

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === "/sign-in"; // ← replaces `flipped`

  const [form,    setForm   ] = useState({ name: "", email: "", password: "", confirm: "" });
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const cardHeight = isLogin ? LOGIN_H : REGISTER_H;

  return (
    <>
      <style>{AUTH_KEYFRAMES}</style>

      <div className="font-outfit min-h-screen bg-[#060a0e] flex items-center justify-center relative overflow-hidden">

        {/* ── Ambient green glow ── */}
        <div
          className="anim-glow absolute w-[700px] h-[700px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          style={{ background: "radial-gradient(circle, rgba(22,163,74,0.07) 0%, transparent 65%)" }}
        />

        {/* ── Dot grid ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(22,163,74,0.13) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
          }}
        />

        {/* ── Floating kanban tiles ── */}
        <BgTile className="anim-drift w-[148px] h-[86px] top-[11%] left-[7%]">
          <div className="p-[10px_12px]">
            <div className="w-16 h-1.5 rounded bg-green-600/30 mb-[7px]" />
            <div className="w-[110px] h-1 rounded bg-white/[0.07] mb-1" />
            <div className="w-20 h-1 rounded bg-white/[0.05] mb-2" />
            <div className="flex gap-1">
              {["#16a34a", "#0d9488", "#6366f1"].map((c, i) => (
                <div key={i} className="w-3.5 h-3.5 rounded-full opacity-55" style={{ background: c }} />
              ))}
            </div>
          </div>
        </BgTile>

        <BgTile className="anim-drift2 w-[118px] h-[68px] top-[16%] right-[8%]">
          <div className="p-[9px_11px]">
            <div className="w-[54px] h-[5px] rounded bg-indigo-500/35 mb-1.5" />
            <div className="w-[86px] h-1 rounded bg-white/[0.06] mb-[3px]" />
            <div className="w-[58px] h-1 rounded bg-white/[0.04]" />
          </div>
        </BgTile>

        <BgTile className="anim-drift3 w-[168px] h-[100px] bottom-[13%] left-[5%]">
          <div className="p-[11px_13px]">
            <div className="flex justify-between items-center mb-2">
              <div className="w-[58px] h-[5px] rounded bg-teal-600/40" />
              <div className="font-outfit px-[7px] py-[2px] rounded bg-green-600/[0.18] text-[9px] text-green-400">Active</div>
            </div>
            <div className="w-full h-1 rounded bg-white/[0.06] mb-[3px]" />
            <div className="w-[70%] h-1 rounded bg-green-600/[0.18] mb-2.5" />
            <div className="flex gap-[5px]">
              <div className="font-outfit px-2 py-[3px] rounded bg-green-600/[0.14] text-[9px] text-green-400">In Progress</div>
              <div className="font-outfit px-2 py-[3px] rounded bg-indigo-500/[0.12] text-[9px] text-indigo-300">Design</div>
            </div>
          </div>
        </BgTile>

        <BgTile className="anim-drift2-delay w-[124px] h-[72px] bottom-[17%] right-[6%]">
          <div className="p-[9px_12px]">
            <div className="flex items-center gap-1.5 mb-[7px]">
              <div className="w-2.5 h-2.5 rounded-full bg-green-600 opacity-65" />
              <div className="w-[65px] h-[5px] rounded bg-white/[0.08]" />
            </div>
            <div className="w-full h-[3px] rounded bg-white/[0.05] mb-[3px]" />
            <div className="w-[55%] h-[3px] rounded bg-green-600/[0.22] mb-[7px]" />
            <div className="w-full h-[3px] rounded bg-white/[0.04]" />
          </div>
        </BgTile>

        {/* ── Flip container ── */}
        <div
          className={`flip-wrapper w-[388px] transition-[opacity,transform] duration-500 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <div
            className="relative"
            style={{
              height: cardHeight,
              transition: "height 0.65s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <div className={`flip-inner absolute inset-0 ${!isLogin ? "flipped" : ""}`}>

              <Login
                form={form}
                onChange={handleChange}
                onSwitch={() => navigate("/sign-up")}
              />

              <Register
                form={form}
                onChange={handleChange}
                onSwitch={() => navigate("/sign-in")}
              />

            </div>
          </div>
        </div>

      </div>
    </>
  );
}