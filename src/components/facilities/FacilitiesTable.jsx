import { doc, Timestamp, updateDoc } from "firebase/firestore";
import DaysEnums from "../../enums/daysEnums";
import EditFacility from "./actions/EditFacility";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import ShowDetails from "./actions/ShowDetails";
import { usePopup } from "../../context/PopupContext";
import AddOthers from "./actions/AddOthers";
import toast from "react-hot-toast";
import { useRef } from "react";

const FacilitiesTable = ({ facilitiy, facilities, setFacilities }) => {
  const toastId = useRef();
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

  // Helper to update facilities and Firestore
  const updateFacility = (updatedPrograms) => {
    const updatedFacilities = [...facilities];
    const facilityIndex = updatedFacilities.findIndex(
      (fac) => fac.id === facilitiy.id
    );
    updatedFacilities[facilityIndex].Programs = updatedPrograms;

    // Update Firestore
    const facilityRef = doc(db, "Facilities", facilitiy.id);
    try {
      updateDoc(facilityRef, { Programs: updatedPrograms });
    } catch (err) {
      throw new Error(err);
    }

    // Update state
    setFacilities(updatedFacilities);

    // console.log("Updated facilities:", updatedFacilities);
  };

  function checkUserPerDayWeek(day) {
    let dayReservationCount = 0;
    let weekReservationCount = 0;

    facilitiy.Programs[day].map((time) => {
      if (
        time?.LastTaken &&
        new Date(time?.LastTaken.seconds * 1000).toISOString() >
          new Date(Timestamp.now().seconds * 1000).toISOString() &&
        time.Users.some((U) => U.StudentNumber === user.IdNumber)
      ) {
        dayReservationCount++;
      }
    });

    if (dayReservationCount < facilitiy.UserPerDay) {
      Object.keys(facilitiy.Programs).map((prg) =>
        facilitiy.Programs[prg].map((time) => {
          if (
            time?.LastTaken &&
            new Date(time?.LastTaken.seconds * 1000).toISOString() >
              new Date(Timestamp.now().seconds * 1000).toISOString() &&
            time.Users.some((U) => U.StudentNumber === user.IdNumber)
          ) {
            weekReservationCount++;
          }
        })
      );
      // console.log("Haftada alinan", weekReservationCount);
      if (!(weekReservationCount < facilitiy.UserPerWeek)) {
        toast.dismiss();
        toast.error(
          `Bu hafta için olan ${facilitiy.UserPerWeek} rezervasyon hakkınızı kullandınız.`
        );
        return false;
      }
    }
    // console.log("Gunde alinan", dayReservationCount);
    if (!(dayReservationCount < facilitiy.UserPerDay)) {
      toast.dismiss();
      toast.error(
        `Bir gün için olan ${facilitiy.UserPerDay} rezervasyon hakkınızı kullandınız.`
      );
      return false;
    }

    return true;
  }

  function handleTakeReservation(day, index, time) {
    if (!checkUserPerDayWeek(day)) return;

    if (facilitiy.MinUsers > 1) {
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

    try {
      toast.dismiss();
      toastId.current = toast.loading("İşleniyor...");
      // Helper to calculate the next occurrence of the selected day
      const getNextOccurrence = (day) => {
        const targetDayIndex = daysOrder.indexOf(day);
        const now = new Date();

        // Get the difference in days from today
        const dayDiff = (targetDayIndex - now.getDay() + 7) % 7;

        // Calculate the next occurrence of the selected day
        const nextDate = new Date(now);
        nextDate.setDate(now.getDate() + dayDiff);
        nextDate.setHours(23, 59, 0, 0); // Set to end of the day

        return Timestamp.fromDate(nextDate);
      };

      // Helper function to set the time to 12:59 PM
      function setToLastHour(timestamp) {
        const date = timestamp.toDate(); // Convert Firestore Timestamp to JS Date
        date.setHours(23, 59, 0, 0); // Set time to 11:59 PM
        return Timestamp.fromDate(date); // Convert back to Firestore Timestamp
      }

      // Determine the timestamp for the selected day
      const selectedDayTimestamp =
        day === new Date().toLocaleString("en-US", { weekday: "short" })
          ? setToLastHour(Timestamp.now()) // If today, use current day at 12:59 PM
          : getNextOccurrence(day); // Otherwise, calculate the next occurrence

      // Clone current programs
      const updatedPrograms = { ...facilitiy.Programs };
      const updatedUsers = time?.Users ? time.Users : [];

      if (
        !time?.LastTaken ||
        Timestamp.now().seconds > time?.LastTaken?.seconds
      ) {
        // Override Users and set PastUsers
        updatedPrograms[day][index] = {
          ...time,
          PastUsers: updatedUsers,
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
            ...updatedUsers,
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
    } catch (err) {
      console.log(err);
      toast.dismiss(toastId.current);
      toast.error("Bir hata oluştu.");
      return;
    }
    setPopupContent(null);
    toast.dismiss(toastId.current);
    toast.success("Randevunuz başarıyla alınmıştır.");
  }

  function isTaken(time) {
    const isTimePassed = Timestamp.now().seconds > time?.LastTaken?.seconds;
    const withMinUsers =
      time?.Users?.length >= facilitiy.MinUsers ||
      time?.Users?.length == facilitiy.MaxUsers;
    const withOutMinUsers = time?.Users?.length >= facilitiy.MaxUsers;
    const isFull =
      (facilitiy.MinUsers != 0 ? withMinUsers : withOutMinUsers) &&
      !isTimePassed;
    const taken =
      time?.Users?.some((U) => U.UserId == user.Email) && !isTimePassed;
    return { isFull, taken };
  }

  function handleShowDetails(time) {
    if (user.Auth !== 0) return;
    const isTimePassed = Timestamp.now().seconds > time?.LastTaken?.seconds;
    if (!isTimePassed) {
      setPopupContent(<ShowDetails data={time} />);
    } else {
      setPopupContent(<ShowDetails data={{ Users: [] }} />);
    }
  }

  function handleCancel(day, index, time) {
    // Clone current programs
    const updatedPrograms = { ...facilitiy.Programs };
    const updatedUsers = time?.Users
      ? time.Users.filter((U) => U.StudentNumber !== user.IdNumber)
      : [];

    try {
      toast.dismiss();
      toastId.current = toast.loading("İşleniyor...");
      if (facilitiy.MinUsers > 1) {
        // Override Users and set PastUsers
        updatedPrograms[day][index] = {
          ...time,
          Users: [],
        };
      } else {
        // Override Users and set PastUsers
        updatedPrograms[day][index] = {
          ...time,
          Users: updatedUsers,
        };
      }

      // Apply updates
      updateFacility(updatedPrograms);
    } catch (err) {
      console.log(err);
      toast.dismiss(toastId.current);
      toast.error("Bir hata oluştu.");
      return;
    }

    toast.dismiss(toastId.current);
    toast.success("Randevunuz başarıyla iptal edilmiştır.");
  }

  return (
    <main className="overflow-x-auto" key={facilitiy.id}>
      <div className="w-max p-4 relative shadow-lg border-2 border-slate-300 sm:rounded-lg">
        <div className="flex text-sm justify-between gap-3 items-end max-w-4xl">
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

          <div className="flex flex-col gap-2">
            <p>
              <span className="font-bold">Bir Kullanıcı Günde:</span>{" "}
              {facilitiy.UserPerDay}
            </p>
            <p>
              <span className="font-bold">Bir Kullanıcı Haftada:</span>{" "}
              {facilitiy.UserPerWeek}
            </p>
          </div>

          {user?.Auth === 0 && (
            <div>
              <EditFacility facilitiy={facilitiy} />
            </div>
          )}
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
                    className={`border rounded-md overflow-clip cursor-pointer ${
                      user.Auth !== 0 &&
                      time.Gender !== user.Gender &&
                      facilitiy.IsGenderDifferent &&
                      "hidden"
                    }
                    ${
                      isTaken(time).taken &&
                      "border-green-700 dark:border-green-600"
                    }`}
                  >
                    <div
                      className={`w-32 py-1.5 mb-1 ${
                        isTaken(time).taken
                          ? "bg-green-700 dark:bg-green-600 text-white"
                          : "bg-slate-400/30"
                      }`}
                      onClick={() => handleShowDetails(time)}
                    >
                      {facilitiy.IsGenderDifferent && (
                        <p>{time.Gender == 0 ? "Kadın" : "Erkek"}</p>
                      )}
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
                    <button
                      onClick={() => {
                        !isTaken(time).taken
                          ? handleTakeReservation(
                              sortedPrograms[index],
                              i,
                              time
                            )
                          : handleCancel(sortedPrograms[index], i, time);
                      }}
                      disabled={isTaken(time).isFull}
                      className={`w-full text-white rounded-sm text-sm py-1.5 ${
                        isTaken(time).taken
                          ? "bg-red-500 dark:bg-red-700"
                          : isTaken(time).isFull
                          ? "bg-red-700 dark:bg-red-600"
                          : "bg-blue-700 dark:bg-blue-600"
                      }`}
                    >
                      {isTaken(time).taken
                        ? "İptal Et"
                        : isTaken(time).isFull
                        ? "Dolu"
                        : "Reservasyon al"}
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
