import { useState } from "react";
import FacilitiesTable from "../FacilitiesTable";
import AddFacility from "../actions/AddFacility";
import TableSkeleton from "../../common/TableSkeleton";
import { useAuth } from "../../../context/AuthContext";
import { useAppContext } from "../../../context/AppContext";

const FacilitiesPage = () => {
  const { user } = useAuth();
  const { facilitiesData, setFacilitiesData } = useAppContext();
  const [tableIndex, setTableIndex] = useState(0);

  return (
    <section className="md:ml-64 pt-20 px-[4%] bg-gray-100 dark:bg-gray-700 min-h-screen text-gray-900 dark:text-white">
      <div className="w-full flex justify-between py-6">
        <h1 className="font-bold text-2xl">Tesisler</h1>
        {user.Auth === 0 && (
          <div>
            <AddFacility />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
        {facilitiesData?.map((fac, index) => (
          <button
            key={index}
            onClick={() => setTableIndex(index)}
            className={`text-sm px-5 py-2.5 whitespace-nowrap ${
              index == tableIndex
                ? "text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                : "text-gray-900 focus:outline-none bg-white rounded-lg border-2 border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            }`}
          >
            {facilitiesData[index]?.Name}
          </button>
        ))}
      </div>

      {facilitiesData ? (
        <FacilitiesTable
          facilitiy={facilitiesData[tableIndex]}
          facilities={facilitiesData}
          setFacilities={setFacilitiesData}
        />
      ) : (
        <TableSkeleton />
      )}
    </section>
  );
};

export default FacilitiesPage;
