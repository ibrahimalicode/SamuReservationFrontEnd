import { Route, Routes } from "react-router-dom";
import SettingsPage from "../components/settings/pages/SettingsPage";

const Settings = () => {
  return (
    <Routes>
      <Route path="/" element={<SettingsPage />} />
    </Routes>
  );
};

export default Settings;
