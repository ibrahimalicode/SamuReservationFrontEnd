import { doc, Timestamp, updateDoc } from "firebase/firestore";
import DaysEnums from "../../enums/daysEnums";
import EditFacility from "./actions/EditFacility";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import ShowDetails from "./actions/ShowDetails";
import { usePopup } from "../../context/PopupContext";
import AddOthers from "./actions/AddOthers";

const FacilitiesTable = ({
  facilitiy,
  facilities,
  setFacilities,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { setPopupContent } = usePopup();
  // Days in proper order
  const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get current day index
  const currentDayIndex = new Date().getDay();

  // Rearrange the programs starting from the current day
  const sortedPrograms = daysOrder
    .slice(currentDayIndex)
    .concat(daysOrder.slice(0, currentDayIndex))
    .filter((day) => Object.keys(facilitiy.Programs).includes(day));

  function handleTakeReservation(day, index, time) {
    if (facilitiy.MinUsers > 0) {
      setPopupContent(
        <AddOthers
          day={day}
          index={index}
          time={time}
          facilitiy={facilitiy}
          facilities={facilities}
          setFacilities={setFacilities}
        />
      );
      return;
    }
    // Helper to calculate the next occurrence of the selected day
    const getNextOccurrence = (day) => {
      const targetDayIndex = daysOrder.indexOf(day);
      const now = new Date();

      // Get the difference in days from today
      const dayDiff = (targetDayIndex - now.getDay() + 7) % 7;

      // Calculate the next occurrence of the selected day
      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + dayDiff);
      nextDate.setHours(0, 0, 0, 0); // Set to start of the day

      return Timestamp.fromDate(nextDate);
    };

    // Determine the timestamp for the selected day
    const selectedDayTimestamp =
      day === new Date().toLocaleString("en-US", { weekday: "short" })
        ? Timestamp.now() // If today, use the current timestamp
        : getNextOccurrence(day); // Otherwise, calculate the next occurrence

    // Helper to update facilities and Firestore
    const updateFacility = (updatedPrograms) => {
      const updatedFacilities = [...facilities];
      const facilityIndex = updatedFacilities.findIndex(
        (fac) => fac.id === facilitiy.id
      );
      updatedFacilities[facilityIndex].Programs = updatedPrograms;

      // Update state
      setFacilities(updatedFacilities);

      // Update Firestore
      const facilityRef = doc(db, "Facilities", facilitiy.id);
      updateDoc(facilityRef, { Programs: updatedPrograms });

      console.log("Updated facilities:", updatedFacilities);
    };

    // Clone current programs
    const updatedPrograms = { ...facilitiy.Programs };

    if (time?.LastTaken && Timestamp.now().seconds > time.LastTaken.seconds) {
      // Override Users and set PastUsers
      updatedPrograms[day][index] = {
        ...time,
        PastUsers: time.Users,
        Users: [
          {
            FullName: `${user.FirstName} ${user.LastName}`,
            StudentNumber: user.IdNumber,
            UserId: user.Email,
          },
        ],
        LastTaken: selectedDayTimestamp,
      };
    } else {
      // Append the current user to Users
      updatedPrograms[day][index] = {
        ...time,
        Users: [
          ...time.Users,
          {
            FullName: `${user.FirstName} ${user.LastName}`,
            StudentNumber: user.IdNumber,
            UserId: user.Email,
          },
        ],
      };
    }

    // Apply updates
    updateFacility(updatedPrograms);
  }

  return (
    <main className="overflow-x-auto" key={facilitiy.id}>
      <div className="w-max p-4 relative shadow-lg border-2 border-slate-300 sm:rounded-lg">
        <div className="flex text-sm justify-between items-end max-w-4xl">
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-bold">Ad:</span> {facilitiy.Name}
            </p>
            <p>
              <span className="font-bold">Açıklama:</span>{" "}
              {facilitiy.Description}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p>
              <span className="font-bold">Min Kullanıcı:</span>{" "}
              {facilitiy.MinUsers}
            </p>
            <p>
              <span className="font-bold">Max Kullanıcı:</span>{" "}
              {facilitiy.MaxUsers}
            </p>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <EditFacility facilitiy={facilitiy} onSuccess={onSuccess} />
            <p>
              <span className="font-bold">Bir Kullanıcı Haftada:</span> 3
            </p>
          </div>
        </div>

        <div className="w-full">
          <h1 className="font-bold text-lg mt-3">Programlar:</h1>
          {Object.keys(facilitiy.Programs).map((prg, index) => (
            <div key={index} className="mb-2">
              <h1 className="font-bold mb-2">
                {
                  DaysEnums.filter((en) => en.id == sortedPrograms[index])[0]
                    ?.label
                }
              </h1>
              <div className="w-full flex text-sm text-center gap-3">
                {facilitiy.Programs[sortedPrograms[index]].map((time, i) => (
                  <div
                    key={i}
                    className="border rounded-md overflow-clip cursor-pointer"
                  >
                    <div
                      className="bg-slate-400/30 w-32 py-1.5 mb-1"
                      onClick={() =>
                        setPopupContent(<ShowDetails data={time} />)
                      }
                    >
                      <p>{time.Gender == 0 ? "Kız" : "Erkek"}</p>
                      <p>
                        Alan Kişi:{" "}
                        {!time?.LastTaken ||
                        Timestamp.now().seconds > time?.LastTaken?.seconds
                          ? 0
                          : time?.Users?.length || 0}
                      </p>
                    </div>
                    <p className="py-2.5">
                      {time.StartTime}-{time.EndTime}
                    </p>
                    {/* {time.Users.map((user) => (
                    <div key={user.UserId}>{user.FullName}</div>
                  ))} */}
                    <button
                      onClick={() =>
                        handleTakeReservation(sortedPrograms[index], i, time)
                      }
                      className="text-white bg-blue-700 hover:bg-blue-800 rounded-sm text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 px-2 py-1.5 mb-1"
                    >
                      Reservasyon al
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default FacilitiesTable;
