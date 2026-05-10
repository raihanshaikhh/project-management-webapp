import { useState } from "react";
import SettingsSidebar from "./components/SettingSidebar.jsx";

import GeneralSettings from "./sections/GeneralSetting.jsx";


const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;

      case "notifications":
        return <NotificationSettings />;

      case "appearance":
        return <AppearanceSettings />;

      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="settings-layout">
      <SettingsSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="settings-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;