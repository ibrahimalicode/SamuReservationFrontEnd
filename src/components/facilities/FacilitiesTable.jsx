import DaysEnums from "../../enums/daysEnums";
import EditFacility from "./actions/EditFacility";

const FacilitiesTable = ({ facilitiy, onSuccess }) => {
  // Days in proper order
  const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get current day index
  const currentDayIndex = new Date().getDay();

  // Rearrange the programs starting from the current day
  const sortedPrograms = daysOrder
    .slice(currentDayIndex)
    .concat(daysOrder.slice(0, currentDayIndex))
    .filter((day) => Object.keys(facilitiy.Programs).includes(day));

  function handleTakeReservation(time) {
    console.log(time);
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
              <div className="w-full flex text-sm text-center">
                {facilitiy.Programs[sortedPrograms[index]].map((time, i) => (
                  <div
                    key={i}
                    className="border rounded-md overflow-clip cursor-pointer"
                    onClick={() =>
                      handleTakeReservation({
                        ...time,
                        date: sortedPrograms[index],
                      })
                    }
                  >
                    <div className="bg-slate-400/30 w-32 py-1.5 mb-1">
                      <p>{time.Gender == 0 ? "Kız" : "Erkek"}</p>
                      <p>Alan Kişi: {time?.Users?.length || 0}</p>
                    </div>
                    <p className="py-2.5">
                      {time.StartTime}-{time.EndTime}
                    </p>
                    {/* {time.Users.map((user) => (
                    <div key={user.UserId}>{user.FullName}</div>
                  ))} */}
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
