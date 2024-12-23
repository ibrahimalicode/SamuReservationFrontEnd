const FacilitiesTable = ({ facilitiy }) => {
  return (
    <main className="p-4" key={facilitiy.id}>
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

        <div className="flex flex-col gap-2">
          <p>
            <span className="font-bold">Bir Kullanıcı Haftada:</span> 3
          </p>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-lg mt-3">Programlar:</h1>
        {Object.keys(facilitiy.Programs).map((prg) => (
          <div key={prg} className="border-b-2 mb-2">
            <h1 className="font-bold mb-1">{prg}</h1>
            <div className="flex gap-4 text-sm">
              {facilitiy.Programs[prg].map((time, i) => (
                <div key={i}>
                  <p>{time.Gender == 0 ? "Kız" : "Erkek"}</p>
                  <p>
                    {time.StartTime}-{time.EndTime}
                  </p>
                  {time.Users.map((user) => (
                    <div key={user.UserId}>{user.FullName}</div>
                  ))}
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
