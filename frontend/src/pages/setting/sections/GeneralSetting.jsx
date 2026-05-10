import SettingCard from "../components/SettingCard.jsx";

const GeneralSettings = () => {
  return (
    <div className="general-settings text-stone-300">
      <h2>General Settings</h2>

      <SettingCard title="Workspace Name">
        <input type="text" placeholder="Enter workspace name" />
      </SettingCard>

      <SettingCard title="Timezone">
        <select>
          <option>Asia/Kolkata</option>
        </select>
      </SettingCard>
    </div>
  );
};

export default GeneralSettings;