import { useEffect } from "react";
import UsersTable from "../UsersTable";
import AddUser from "../actions/AddUser";
import { useNavigate } from "react-router-dom";
import TableSkeleton from "../../common/TableSkeleton";
import { useAuth } from "../../../context/AuthContext";
import { useAppContext } from "../../../context/AppContext";

const UsersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { usersData } = useAppContext();

  useEffect(() => {
    if (user?.Auth !== 0) {
      navigate("/facilities");
      return;
    }
  }, [user, navigate]);

  return (
    <section className="md:ml-64 pt-20 px-[4%] bg-gray-100 dark:bg-gray-700 min-h-screen">
      <div className="w-full flex justify-between py-6 text-gray-900 dark:text-white">
        <h1 className="font-bold text-2xl">Kullanıcılar</h1>
        <div>
          <AddUser />
        </div>
      </div>

      <div className="relative shadow-md sm:rounded-lg">
        {usersData ? <UsersTable users={usersData} /> : <TableSkeleton />}
      </div>
    </section>
  );
};

export default UsersPage;
