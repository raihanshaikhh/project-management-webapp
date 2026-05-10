// pages/setting/settings.config.js

import GeneralSetting from "./sections/GeneralSetting.jsx";
// import NotificationSettings from "./sections/NotificationSettings.jsx";
// import AppearanceSettings from "./sections/AppearanceSettings.jsx";

export const SETTINGS_TABS = [
  {
    id: "general",
    label: "General",
    icon: "settings",
    component: GeneralSetting,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: "bell",
    component: null, // swap in NotificationSettings when ready
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: "palette",
    component: null,
  },
   { id: "calendar",      label: "Calendar"      },
  { id: "security",      label: "Security"      },
];
