import { CloseI } from "../../../assets/icons";
import { usePopup } from "../../../context/PopupContext";

const ShowDetails = ({ data }) => {
  const { setPopupContent } = usePopup();
  return (
    <main className="py-8 px-4 max-h-[50rem] overflow-y-auto relative dark:text-white">
      <h1 className="text-center font-bold text-2xl">Randevu Detayı</h1>
      <button
        type="button"
        className="absolute top-8 right-8"
        onClick={() => setPopupContent(null)}
      >
        <CloseI />
      </button>
      <div className="overflow-x-auto mt-8">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="">
              <th className="border border-gray-300 px-4 py-2 text-left">Ad</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Öğrenci Numarası
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.Users?.map((user, i) => (
              <tr key={i}>
                <td className="border border-gray-300 px-4 py-2">
                  {user.FullName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
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
