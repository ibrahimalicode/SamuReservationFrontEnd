import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TableSkeleton from "../../common/TableSkeleton";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAuth } from "../../../context/AuthContext";
import FacilitiesTable from "../FacilitiesTable";
import AddFacility from "../actions/AddFacility";

const FacilitiesPage = () => {
  const { user } = useAuth();
  const [facilitiesData, setfacilitiesData] = useState(null);
  const [tableData, setTableData] = useState();

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const facilitiesCollection = collection(db, "Facilities");
        const facilitiesSnapshot = await getDocs(facilitiesCollection);
        const facilitiesList = facilitiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTableData(facilitiesList[0]);
        setfacilitiesData(facilitiesList);
      } catch (error) {
        console.error("Error fetching facilities:", error);
        toast.error("Bir hata oluştu.");
      }
    };
    if (!facilitiesData) {
      fetchFacilities();
    }
  }, [facilitiesData, user]);

  // console.log(facilitiesData);

  return (
    <section className="md:ml-64 mt-16 px-[4%]">
      <div className="w-full flex justify-between py-6 ">
        <h1 className="font-bold text-2xl">Tesisler</h1>
        <div>
          <AddFacility onSuccess={() => setfacilitiesData(null)} />
        </div>
      </div>

      <div className="flex gap-4 mb-3">
        {facilitiesData?.map((fac) => (
          <button
            key={fac.id}
            onClick={() => setTableData(fac)}
            className={`text-sm px-5 py-2.5 ${
              fac.id == tableData?.id
                ? "text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                : "text-gray-900 focus:outline-none bg-white rounded-lg border-2 border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            }`}
          >
            {fac.Name}
          </button>
        ))}
      </div>

      {facilitiesData ? (
        <FacilitiesTable
          facilitiy={tableData}
          onSuccess={() => setfacilitiesData(null)}
        />
      ) : (
        <TableSkeleton />
      )}
    </section>
  );
};

export default FacilitiesPage;
