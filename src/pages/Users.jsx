import { Route, Routes } from "react-router-dom";
import UsersPage from "../components/users/pages/UsersPage";

const Users = () => {
  return (
    <Routes>
      <Route path="/" element={<UsersPage />} />
    </Routes>
  );
};

export default Users;
