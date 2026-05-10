import { SETTINGS_TABS } from "../setting.config";

const SettingsSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="settings-sidebar text-amber-300 flex flex-col gap-4">
      {SETTINGS_TABS.map(({ id, label }) => (
        <button
          key={id}
          className={activeTab === id ? "active" : ""}
          onClick={() => setActiveTab(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default SettingsSidebar;