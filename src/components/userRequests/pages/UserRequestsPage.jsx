import toast from "react-hot-toast";
import { useAppContext } from "../../../context/AppContext";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import AddRequest from "../actions/AddRequest";

const UserRequestsPage = () => {
  const { user } = useAuth();
  const { userRequests, setUserRequests } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete(msgIndex, docId) {
    setIsLoading(true);
    const toastId = toast.loading("İşleniyor...");

    try {
      const requestsRef = doc(db, "UserRequests", docId);

      // Find the document and remove the specific message
      const updatedRequests = userRequests.map((request) => {
        if (request.id === docId) {
          return {
            ...request,
            Messages: request.Messages.filter((_, index) => index !== msgIndex),
          };
        }
        return request;
      });

      // Update the document in Firestore
      await updateDoc(requestsRef, {
        Messages: updatedRequests.find((request) => request.id === docId)
          ?.Messages,
      });

      // Update the local state
      setIsLoading(false);
      setUserRequests(updatedRequests);

      toast.success("Mesaj başarıyla silindi!", { id: toastId });
    } catch (error) {
      console.error("Error deleting message: ", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.", { id: toastId });
    }
  }

  return (
    <section className="md:ml-64 pt-20 px-[4%] bg-gray-100 dark:bg-gray-700 min-h-screen">
      <div className="w-full flex justify-between py-6 text-gray-900 dark:text-white">
        <h1 className="font-bold text-2xl">Talep-İstek</h1>
        {user?.Auth !== 0 && (
          <div>
            <AddRequest />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 py-5 px-3 text-sm relative shadow-md sm:rounded-lg">
        {userRequests &&
          userRequests
            .filter((R) => user.Auth === 0 || R.id === user.Email)
            .map((R) =>
              R.Messages.map((msg, i) => (
                <main key={i} className="flex justify-between">
                  <div>
                    {user?.Auth === 0 && <p>Ad Soyad: {msg.FullName}</p>}
                    <p>İstek: {msg.Message}</p>
                  </div>
                  {user?.Auth === 0 && (
                    <div>
                      <button
                        disabled={isLoading}
                        onClick={() => handleDelete(i, R.id)}
                        className="rounded-md text-white bg-red-600 px-4 py-1"
                      >
                        Sil
                      </button>
                    </div>
                  )}
                </main>
              ))
            )}
      </div>
    </section>
  );
};

export default UserRequestsPage;
