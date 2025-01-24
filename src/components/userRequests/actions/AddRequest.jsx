import { useState } from "react";
import { CloseI } from "../../../assets/icons";
import { useAuth } from "../../../context/AuthContext";
import { usePopup } from "../../../context/PopupContext";
import toast from "react-hot-toast";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const AddRequest = () => {
  const { setPopupContent } = usePopup();

  function handleClick() {
    setPopupContent(<AddRequestPopup />);
  }
  return (
    <button
      onClick={handleClick}
      type="button"
      className="text-xs text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      Talep-İstek Oluştur
    </button>
  );
};

export default AddRequest;

const AddRequestPopup = () => {
  const { user } = useAuth();
  const { setPopupContent } = usePopup();

  const [isLoading, setIsLoading] = useState(false);
  const [messageData, setMessageData] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);
    const toastId = toast.loading("İşleniyor...");

    try {
      const { FirstName, Email } = user;
      const reqRef = doc(db, "UserRequests", Email);
      const reqSnap = await getDoc(reqRef);

      if (reqSnap.exists()) {
        // Update the existing document with the new message
        await updateDoc(reqRef, {
          Messages: arrayUnion({
            FullName: FirstName,
            Message: messageData,
            Date: new Date().toISOString(),
          }),
        });
      } else {
        // Create a new document if it doesn't exist
        await setDoc(reqRef, {
          Messages: [
            {
              FullName: FirstName,
              Message: messageData,
              Date: new Date().toISOString(),
            },
          ],
        });
      }

      toast.success("Talep başarıyla eklendi!", { id: toastId });
      setPopupContent(null);
    } catch (error) {
      console.error("Error adding request: ", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="py-8 px-4 max-h-[95vh] overflow-y-auto relative">
      <h1 className="text-center font-bold text-2xl">Talep-İstek Oluştur</h1>
      <button
        type="button"
        className="absolute top-8 right-8"
        onClick={() => setPopupContent(null)}
      >
        <CloseI />
      </button>
      <div className="relative w-full max-w-2xl max-h-full">
        <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit}>
          <div className="text-sm">
            <label
              htmlFor="Message"
              className="block mb-2 font-medium text-gray-900 dark:text-white"
            >
              Talep-İstek
            </label>
            <textarea
              type="text"
              name="Message"
              id="Message"
              value={messageData}
              onChange={(e) => setMessageData(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Talep-İstek"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
};
