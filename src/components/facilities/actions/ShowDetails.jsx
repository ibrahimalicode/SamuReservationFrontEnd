import { CloseI } from "../../../assets/icons";
import { usePopup } from "../../../context/PopupContext";

const ShowDetails = ({ data }) => {
  const { setPopupContent } = usePopup();

  return (
    <main className="py-8 px-4 max-h-[95vh] overflow-y-auto relative dark:text-white">
      <h1 className="text-center font-bold text-2xl">Randevu Detayı</h1>
      <button
        type="button"
        className="absolute top-8 right-8"
        onClick={() => setPopupContent(null)}
      >
        <CloseI />
      </button>

      <div className="overflow-x-auto mt-8">
        <div className="flex gap-3 mb-3">
          <p className="font-bold">Malzeme:</p>
          <p>{data.Additional || "Istemiyoruz"}</p>
        </div>
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="">
              <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">
                Ad
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">
                Öğrenci Numarası
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.Users?.map((user, i) => (
              <tr key={i}>
                <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                  {user.FullName}
                </td>
                <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                  {user.StudentNumber}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default ShowDetails;
