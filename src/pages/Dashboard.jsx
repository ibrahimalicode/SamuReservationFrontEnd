//DashboardPage
import { Route, Routes } from "react-router-dom";
import DashboardPage from "../components/dashboard/pages/DashboardPage";

const Dashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
    </Routes>
  );
};

export default Dashboard;
