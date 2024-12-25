import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UsersTable from "../UsersTable";
import TableSkeleton from "../../common/TableSkeleton";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AddUser from "../actions/AddUser";

const UsersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState(null);

  useEffect(() => {
    if (user.Auth !== 0) {
      navigate("/facilities");
      return;
    }
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "Users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsersData(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Bir hata oluştu.");
      }
    };
    if (!usersData) {
      fetchUsers();
    }
  }, [usersData, user, navigate]);

  return (
    <section className="md:ml-64 mt-20 px-[4%]">
      <div className="w-full flex justify-between py-6 ">
        <h1 className="font-bold text-2xl">Kullanıcılar</h1>
        <div>
          <AddUser onSuccess={() => setUsersData(null)} />
        </div>
      </div>

      <div className="relative shadow-md sm:rounded-lg">
        {usersData ? (
          <UsersTable users={usersData} onSuccess={() => setUsersData(null)} />
        ) : (
          <TableSkeleton />
        )}
      </div>
    </section>
  );
};

export default UsersPage;
