import { useState } from "react"

const LayoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
)

const LayersIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 7l10-4 10 4-10 4z"/><path d="M2 12l10 4 10-4"/><path d="M2 17l10 4 10-4"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
  </svg>
)

const GearIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
)

const LogoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
)

const links = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutIcon />, badge: null },
  { name: "Projects", path: "/projects", icon: <LayersIcon />, badge: 4, type: "info" },
  { name: "Tasks", path: "/tasks", icon: <CheckIcon />, badge: 12, type: "danger" },
]
const badgeStyles = {
  info: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  danger: "bg-red-500/15 text-red-400 border-red-500/20",
  success: "bg-green-500/15 text-green-400 border-green-500/20",
}

function NavItem({ link, active, onClick }) {
  const isActive = active === link.path

  return (
    <button
      onClick={() => onClick(link.path)}
      className={`
        group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
        border text-sm font-medium transition-all duration-200 cursor-pointer
        ${isActive
          ? "bg-white/[0.08] border-white/10 text-white"
          : "border-transparent text-white/35 hover:bg-white/[0.04] hover:text-white/65"
        }
      `}
    >
      {isActive && (
        <span className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
      )}

      <span className={`
        flex items-center justify-center w-[30px] h-[30px] rounded-lg flex-shrink-0 transition-colors duration-200
        ${isActive ? "bg-white/[0.12]" : "bg-white/[0.05] group-hover:bg-white/[0.08]"}
      `}>
        {link.icon}
      </span>

      <span className="flex-1 text-left tracking-[0.1px]">{link.name}</span>

      {link.badge && (
  <span
    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border
    ${badgeStyles[link.type] || "bg-white/10 text-white/60 border-white/10"}`}
  >
    {link.badge}
  </span>
)}
 
    </button>
  )
}

export default function Sidebar() {
  const [active, setActive] = useState("/dashboard")

  return (
    <div className="w-64 h-screen bg-[#080808] flex flex-col px-4 py-7 gap-1.5 border-r border-white/[0.04] relative overflow-hidden">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/[0.03] blur-3xl" />

      {/* Logo */}
      <div className="flex items-center gap-3 px-2 pb-6 border-b border-white/[0.05]">
        <div className="w-[30px] h-[30px] rounded-[8px] bg-white flex items-center justify-center flex-shrink-0 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.5)]">
          <LogoIcon />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-white tracking-[0.1px]">PM System</p>
          <p className="text-[9.5px] font-medium tracking-[1.3px] uppercase text-white/20 mt-0.5">Workspace</p>
        </div>
      </div>

      {/* Section label */}
      <p className="text-[9.5px] font-medium tracking-[1.5px] uppercase text-white/20 px-3 mt-3 mb-1">
        Navigation
      </p>

      {/* Nav links */}
      {links.map(link => (
        <NavItem key={link.path} link={link} active={active} onClick={setActive} />
      ))}

      <div className="h-px bg-white/[0.05] my-2" />

      <NavItem
        link={{ name: "Settings", path: "/settings", icon: <GearIcon />, badge: null }}
        active={active}
        onClick={setActive}
      />

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-white/[0.05] flex items-center gap-3 px-1">
        <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 border border-white/10 flex items-center justify-center text-[13px] font-semibold text-white/70 flex-shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          A
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-medium text-white/75 truncate">Alex Monroe</p>
          <p className="text-[10.5px] text-white/25 mt-0.5">Admin</p>
        </div>
        <button className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:bg-white/[0.09] hover:text-white/70 transition-all duration-200">
          <GearIcon />
        </button>
      </div>

    </div>
  )
}