import { useState } from "react";

/* ─────────────────────────────────────────────────────
   Keyframes & font imports that Tailwind can't express.
   Inject once via <style> in Auth.jsx (the page).
───────────────────────────────────────────────────── */
export const AUTH_KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Italianno&display=swap');

  .font-outfit    { font-family: 'Outfit', sans-serif; }
  .font-italianno { font-family: 'Italianno', cursive; }

  input::placeholder { color: #4a5568; }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #0c1117 inset !important;
    -webkit-text-fill-color: #e2e8f0 !important;
  }

  @keyframes drift {
    0%, 100% { transform: translateY(0px) rotate(0deg);  opacity: 0.5; }
    50%       { transform: translateY(-16px) rotate(1.5deg); opacity: 0.8; }
  }
  @keyframes drift2 {
    0%, 100% { transform: translateY(0px) rotate(-1deg); opacity: 0.4; }
    50%       { transform: translateY(12px) rotate(1deg);  opacity: 0.7; }
  }
  @keyframes drift3 {
    0%, 100% { transform: translateY(0px);  opacity: 0.35; }
    60%       { transform: translateY(-10px) rotate(2deg); opacity: 0.6; }
  }
  @keyframes glowPulse {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 0.9; }
  }

  .anim-drift  { animation: drift  7s   ease-in-out infinite; }
  .anim-drift2 { animation: drift2 9s   ease-in-out infinite; }
  .anim-drift2-delay { animation: drift2 6.5s 1s ease-in-out infinite; }
  .anim-drift3 { animation: drift3 8s   ease-in-out infinite; }
  .anim-glow   { animation: glowPulse 5s ease-in-out infinite; }

  /* 3D flip — Tailwind's perspective/preserve-3d utilities aren't in base */
  .flip-wrapper      { perspective: 1200px; }
  .flip-inner        { transform-style: preserve-3d; transition: transform 0.65s cubic-bezier(0.4,0,0.2,1); }
  .flip-inner.flipped { transform: rotateY(180deg); }
  .flip-front        { backface-visibility: hidden; -webkit-backface-visibility: hidden; transform: rotateY(0deg); }
  .flip-back         { backface-visibility: hidden; -webkit-backface-visibility: hidden; transform: rotateY(180deg); }
`;

/* ────────────────────────────────── Flow logo ── */
export function FlowLogo({ size = 40 }) {
  return (
    <div
      className="rounded-xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 flex items-center justify-center shrink-0"
      style={{
        width: size, height: size,
        boxShadow: "0 8px 28px rgba(22,163,74,0.4), 0 2px 6px rgba(0,0,0,0.5)",
      }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 30 30" fill="none">
        <rect x="2" y="6" width="6" height="14" rx="2" fill="white" opacity="0.9" />
        <rect x="12" y="3" width="6" height="20" rx="2" fill="white" opacity="0.75" />
        <rect x="22" y="8" width="6" height="10" rx="2" fill="white" opacity="0.55" />
        <path d="M2 24 Q15 28 28 22" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d="M25 19 L28 22 L25 25" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
      </svg>
    </div>
  );
}

/* ────────────────────────────── Brand header ── */
export function BrandHeader({ promptText, linkLabel, onSwitch }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-center gap-2.5 mb-1.5">
        <FlowLogo size={40} />
        <span
          className="font-italianno text-green-50 leading-none tracking-wide"
          style={{ fontSize: 48, textShadow: "0 0 24px rgba(22,163,74,0.4)" }}
        >
          flow
        </span>
      </div>
      <p className="text-center text-slate-500 text-[13px] font-outfit">
        {promptText}{" "}
        <span
          onClick={onSwitch}
          className="text-green-400 font-medium cursor-pointer hover:text-green-300 transition-colors"
        >
          {linkLabel}
        </span>
      </p>
    </div>
  );
}

/* ──────────────────────────────── Input field ── */
export function InputField({ icon, type, name, placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative mb-[11px]">
      <div
        className="absolute left-[13px] top-1/2 -translate-y-1/2 flex items-center z-10 transition-colors duration-200"
        style={{ color: focused ? "#16a34a" : "#4a5568" }}
      >
        {icon}
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="font-outfit w-full rounded-[9px] text-slate-200 text-[13.5px] outline-none transition-all duration-200 box-border"
        style={{
          padding: "12px 13px 12px 40px",
          background: focused ? "rgba(22,163,74,0.06)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${focused ? "rgba(22,163,74,0.45)" : "rgba(255,255,255,0.08)"}`,
          boxShadow: focused ? "0 0 0 3px rgba(22,163,74,0.10)" : "none",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────── Icons ── */
export const EmailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
export const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
export const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

/* ──────────────────────────── Submit button ── */
export function SubmitButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="font-outfit w-full py-[13px] rounded-[9px] text-white font-semibold text-[14.5px] cursor-pointer transition-all duration-200 bg-gradient-to-br from-green-600 to-emerald-600 hover:-translate-y-px"
      style={{ boxShadow: "0 4px 20px rgba(22,163,74,0.35)" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 28px rgba(22,163,74,0.55)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(22,163,74,0.35)"; }}
    >
      {children}
    </button>
  );
}

/* ────────────────────────────── Social row ── */
function SocialBtn({ children }) {
  return (
    <button className="font-outfit flex-1 py-2.5 rounded-lg text-slate-400 text-[12.5px] flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/[0.14]">
      {children}
    </button>
  );
}

export function SocialRow() {
  return (
    <>
      <div className="flex items-center gap-2.5 my-4">
        <div className="flex-1 h-px bg-white/[0.07]" />
        <span className="font-outfit text-[11px] text-gray-700 tracking-wider">OR CONTINUE WITH</span>
        <div className="flex-1 h-px bg-white/[0.07]" />
      </div>
      <div className="flex gap-2">
     
        <SocialBtn>
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </SocialBtn>

      </div>
    </>
  );
}

/* ─────────────────── Card face shell (front / back of flip) ── */
export function CardFace({ children, isBack = false }) {
  return (
    <div
      className={`absolute inset-0 rounded-[18px] flex flex-col overflow-hidden ${isBack ? "flip-back" : "flip-front"}`}
      style={{
        background: "rgba(10,14,20,0.96)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 0 0 1px rgba(22,163,74,0.06), 0 30px 80px rgba(0,0,0,0.7)",
        padding: "32px 30px 28px",
      }}
    >
      {/* top shimmer */}
      <div className="absolute top-0 left-[18%] right-[18%] h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(22,163,74,0.65), transparent)" }} />
      {children}
      {/* bottom shimmer */}
      <div className="absolute bottom-0 left-[28%] right-[28%] h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(22,163,74,0.22), transparent)" }} />
    </div>
  );
}

/* ───────────────────── Floating background kanban tile ── */
export function BgTile({ className = "", children }) {
  return (
    <div
      className={`absolute rounded-[10px] border border-white/[0.05] bg-white/[0.02] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}