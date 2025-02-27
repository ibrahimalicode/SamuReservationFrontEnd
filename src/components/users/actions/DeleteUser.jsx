import { useState } from "react";
import toast from "react-hot-toast";
import { db } from "../../../firebase";
import { CloseI } from "../../../assets/icons";
import { deleteDoc, doc } from "firebase/firestore";
import { usePopup } from "../../../context/PopupContext";
import { useAuth } from "../../../context/AuthContext";

const DeleteUser = ({ user, setOpen }) => {
  const { setPopupContent } = usePopup();
  const { user: userData } = useAuth();

  function handleClick() {
    setOpen(null);
    setPopupContent(<DeleteUserPopup user={user} />);
  }

  return (
    <button
      onClick={handleClick}
      disabled={user.Email == userData.Email}
      className="w-full text-left block px-4 py-2 whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
    >
      Kullanıcı Sil
    </button>
  );
};

export default DeleteUser;

//
//POPUP
function DeleteUserPopup({ user }) {
  const { setPopupContent } = usePopup();

  const [isLoading, setIsLoading] = useState(false);
  async function handleDelete() {
    if (!user?.Email) return toast.error("Geçersiz kullanıcı bilgisi!");

    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "Users", user.Email));
      toast.success("Kullanıcı başarıyla silindi!");
      setPopupContent(null);
    } catch (error) {
      console.error("Silme hatası:", error);
      toast.error("Kullanıcı silinirken hata oluştu!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="py-8 px-4 max-h-[95vh] overflow-y-auto relative text-gray-900 dark:text-white">
      <h1 className="text-center font-bold text-2xl mt-2">
        Kullanıcıyı Silmek istediğinizden emin misiniz ?
      </h1>
      <button
        type="button"
        className="absolute top-4 right-8"
        onClick={() => setPopupContent(null)}
      >
        <CloseI />
      </button>

      <div className="relative w-full max-w-2xl max-h-full">
        <div className="flex flex-col gap-2 my-10">
          <p>
            <span className="font-bold">Ad Soyad:</span> {user.FirstName}{" "}
            {user.LastName}
          </p>
          <p>
            <span className="font-bold">E-Posta:</span> {user.Email}
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
