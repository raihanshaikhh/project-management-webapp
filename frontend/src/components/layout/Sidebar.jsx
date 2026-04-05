import React, { useState } from 'react';
import { BrandHeader } from '../auth/Authcomponents.jsx';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    badge: null,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    label: 'My Tasks',
    badge: 5,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
  },
  {
    label: 'Inbox',
    badge: 3,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
    ),
  },
  {
    label: 'Calendar',
    badge: null,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
];

const PROJECTS = [
  { name: 'Website Redesign', color: '#378ADD' },
  { name: 'Mobile App v2',    color: '#1D9E75' },
  { name: 'Q3 Marketing',     color: '#D85A30' },
  { name: 'API Integration',  color: '#D4537E' },
  { name: 'Design System',    color: '#BA7517' },
];

const BOTTOM_ITEMS = [
  {
    label: 'Settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
  {
    label: 'Invite Teammates',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [active, setActive] = useState('Dashboard');

  return (
    <div
      className={`bg-[#0F172A] min-h-screen flex flex-col transition-all duration-500 text-slate-400 ${
        isOpen ? 'w-64' : 'w-[60px]'
      }`}
    >
      {/* ── Toggle button — always visible, nothing else when collapsed ── */}
      <div className="flex items-center justify-start p-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className=" hover:text-white hover:bg-zinc-800 p-1.5 rounded-md transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          {isOpen ? ( <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="6" y1="18" x2="18" y2="6" />
      </svg>):(<svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>)}
         
        </button>
      </div>

      {isOpen && (
        <>
          {/* Brand */}
          <div className="px-4 pb-4 border-b border-zinc-800">
            <BrandHeader />
          </div>

          {/* Main nav */}
          <div className="mt-4 px-2 flex flex-col gap-0.5 text-slate-400">
            <p className="text-[15px] font-medium uppercase tracking-widest px-2 mb-1">
              Main
            </p>
            {NAV_ITEMS.map(({ label, icon, badge }) => (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  active === label
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span className="shrink-0">{icon}</span>
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="text-[11px] font-medium bg-blue-600/25 text-blue-400 px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mx-3 my-3 border-t border-zinc-800" />

          {/* Projects */}
          <div className="px-2 flex flex-col gap-0.5 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between px-2 mb-1">
              <p className=" text-[10px] font-medium uppercase tracking-widest">
                Projects
              </p>
              <button
                className="text-zinc-600 hover:text-white p-0.5 rounded transition-colors"
                title="New project"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
            {PROJECTS.map(({ name, color }) => (
              <button
                key={name}
                className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                <span className="truncate">{name}</span>
              </button>
            ))}
          </div>

          <div className="mx-3 my-3 border-t border-zinc-800" />

          {/* Bottom utilities */}
          <div className="px-2 flex flex-col gap-0.5">
            {BOTTOM_ITEMS.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  active === label
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span className="shrink-0">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* User row */}
          <div className="mx-2 mt-2 mb-3 p-2 rounded-md flex items-center gap-3 hover:bg-zinc-800 cursor-pointer transition-colors">
            <div className="w-7 h-7 rounded-full bg-blue-600/25 flex items-center justify-center text-blue-400 text-xs font-medium shrink-0">
              RH
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-medium truncate">Raihan</p>
              <p className="text-zinc-500 text-xs truncate">Developer</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}