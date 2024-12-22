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

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const facilitiesCollection = collection(db, "Facilities");
        const facilitiesSnapshot = await getDocs(facilitiesCollection);
        const facilitiesList = facilitiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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

  console.log(facilitiesData);

  return (
    <section className="md:ml-64 mt-16 px-[4%]">
      <div className="w-full flex justify-between py-6 ">
        <h1 className="font-bold text-2xl">Tesisler</h1>
        <div>
          <AddFacility onSuccess={() => setfacilitiesData(null)} />
        </div>
      </div>

      <div className="relative shadow-md sm:rounded-lg">
        {facilitiesData ? (
          <FacilitiesTable
            facilities={facilitiesData}
            onSuccess={() => setfacilitiesData(null)}
          />
        ) : (
          <TableSkeleton />
        )}
      </div>
    </section>
  );
};

export default FacilitiesPage;
