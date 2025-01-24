import { Route, Routes } from "react-router-dom";
import UserRequestsPage from "../components/userRequests/pages/UserRequestsPage";

const UserRequests = () => {
  return (
    <Routes>
      <Route path="/" element={<UserRequestsPage />} />
    </Routes>
  );
};

export default UserRequests;
