const SettingCard = ({ title, children }) => {
  return (
    <div className="setting-card">
      <h4>{title}</h4>
      {children}
    </div>
  );
};

export default SettingCard;