import DaysEnums from "../../enums/daysEnums";
import EditFacility from "./actions/EditFacility";

const FacilitiesTable = ({ facilitiy, onSuccess }) => {
  return (
    <main
      className="p-4 relative shadow-lg border-2 border-slate-300 sm:rounded-lg"
      key={facilitiy.id}
    >
      <div className="flex text-sm justify-between items-end max-w-4xl">
        <div className="flex flex-col gap-2">
          <p>
            <span className="font-bold">Ad:</span> {facilitiy.Name}
          </p>
          <p>
            <span className="font-bold">Açıklama:</span> {facilitiy.Description}
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
          <EditFacility facility={facilitiy} onSuccess={onSuccess} />
          <p>
            <span className="font-bold">Bir Kullanıcı Haftada:</span> 3
          </p>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-lg mt-3">Programlar:</h1>
        {Object.keys(facilitiy.Programs).map((prg, index) => (
          <div key={index} className="border-b-2 mb-2">
            <h1 className="font-bold mb-2">
              {DaysEnums.filter((en) => en.id == prg)[0].label}
            </h1>
            <div className="flex text-sm text-center">
              {facilitiy.Programs[prg].map((time, i) => (
                <div key={i}>
                  <p className="bg-slate-400/30 px-10 py-1.5 mb-1">
                    {time.Gender == 0 ? "Kız" : "Erkek"}
                  </p>
                  <p className="py-1">
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
    </main>
  );
};

export default FacilitiesTable;
