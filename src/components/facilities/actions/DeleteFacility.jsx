import { useState } from "react";
import toast from "react-hot-toast";
import { db } from "../../../firebase";
import { CloseI } from "../../../assets/icons";
import { deleteDoc, doc } from "firebase/firestore";
import { usePopup } from "../../../context/PopupContext";

const DeleteFacility = ({ facility }) => {
  const { setPopupContent } = usePopup();

  function handleClick() {
    setPopupContent(<DeleteFacilityPopup facility={facility} />);
  }
  return (
    <button
      onClick={handleClick}
      type="button"
      className="max-h-min text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-5 py-2 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
    >
      Tesisi Sil
    </button>
  );
};

export default DeleteFacility;

//
//POPUP
function DeleteFacilityPopup({ facility }) {
  const { setPopupContent } = usePopup();

  const [isLoading, setIsLoading] = useState(false);
  async function handleDelete() {
    if (!facility?.id) return toast.error("Geçersiz tesis bilgisi!");

    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "Facilities", facility.id));
      toast.success("Tesis başarıyla silindi!");
      setPopupContent(null);
    } catch (error) {
      console.error("Silme hatası:", error);
      toast.error("Tesis silinirken hata oluştu!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="py-8 px-4 max-h-[95vh] overflow-y-auto relative text-gray-900 dark:text-white">
      <h1 className="text-center font-bold text-2xl">
        Tesisi Silmek istediğinizden emin misiniz ?
      </h1>
      <button
        type="button"
        className="absolute top-8 right-8"
        onClick={() => setPopupContent(null)}
      >
        <CloseI />
      </button>

      <div className="relative w-full max-w-2xl max-h-full">
        <div className="flex flex-col gap-2 my-10">
          <p>
            <span className="font-bold">Ad:</span> {facility.Name}
          </p>
          <p>
            <span className="font-bold">Açıklama:</span> {facility.Description}
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-10 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            Eminim Sil
          </button>
        </div>
      </div>
    </div>
  );
}
