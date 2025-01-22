import { useState } from "react";
import { CloseI } from "../../../assets/icons";
import { usePopup } from "../../../context/PopupContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import toast from "react-hot-toast";

const EditUser = ({ user, setOpen, onSuccess }) => {
  const { setPopupContent } = usePopup();

  function handleClick() {
    setOpen(null);
    setPopupContent(<EditUserPopup user={user} onSuccess={onSuccess} />);
  }
  return (
    <li
      className="block px-4 py-2 whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
      onClick={handleClick}
    >
      Kullanıcı Düzenle
    </li>
  );
};

export default EditUser;

//
//POPUP
function EditUserPopup({ user }) {
  const { setPopupContent } = usePopup();

  const [isLoading, setIsLoading] = useState(false);
  const {
    Auth,
    FirstName,
    LastName,
    PhoneNumber,
    IdType, //student
    IdNumber,
    Email,
    Department,
    Gender,
    id,
  } = user;

  const [userData, setUserData] = useState({
    Auth,
    FirstName,
    LastName,
    PhoneNumber,
    IdType, //student
    IdNumber,
    Email,
    Department,
    Gender,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(false);
    toast.loading("İşleniyor...");
    try {
      // Update user data in Firestore
      await updateDoc(doc(db, "Users", id), userData);
      toast.dismiss();
      setIsLoading(false);
      setPopupContent(null);
      toast.success("Kullanıcı başarıyla düzenlendi.");
    } catch (error) {
      setIsLoading(false);
      toast.dismiss();
      toast.error("Bir hata oluştu. Lütfen tekrar deneyiniz");
      console.error("Error updating user data:", error);
    }
  }

  return (
    <div className="py-8 px-4 max-h-[50rem] overflow-y-auto relative">
      <h1 className="text-center font-bold text-2xl">Kullanıcı Düzenle</h1>
      <button
        type="button"
        className="absolute top-8 right-8"
        onClick={() => setPopupContent(null)}
      >
        <CloseI />
      </button>
      <div className="relative w-full max-w-2xl max-h-full">
        <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="firstname"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Ad
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              value={userData.FirstName}
              onChange={(e) =>
                setUserData((prev) => {
                  return {
                    ...prev,
                    FirstName: e.target.value,
                  };
                })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Ad"
              required
            />
          </div>

          <div>
            <label
              htmlFor="lastname"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Soyad
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              value={userData.LastName}
              onChange={(e) =>
                setUserData((prev) => {
                  return {
                    ...prev,
                    LastName: e.target.value,
                  };
                })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Ad"
              required
            />
          </div>

          <div>
            <label
              htmlFor="tel"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Telefon
            </label>
            <input
              type="number"
              name="tel"
              id="tel"
              value={userData.PhoneNumber}
              onChange={(e) =>
                setUserData((prev) => {
                  return {
                    ...prev,
                    PhoneNumber: e.target.value,
                  };
                })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Tel"
              required
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Bölüm
            </label>
            <input
              type="text"
              name="department"
              id="department"
              value={userData.Department}
              onChange={(e) =>
                setUserData((prev) => {
                  return {
                    ...prev,
                    Department: e.target.value,
                  };
                })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Bölüm"
              required
            />
          </div>

          <div>
            <label htmlFor="#" className="block pb-2">
              Cinsiyet
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() =>
                  setUserData((prev) => {
                    return {
                      ...prev,
                      Gender: 1,
                    };
                  })
                }
                className={`${
                  userData.Gender == 1
                    ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-7 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    : "py-2.5 px-7 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                }`}
              >
                Erkek
              </button>
              <button
                type="button"
                onClick={() =>
                  setUserData((prev) => {
                    return {
                      ...prev,
                      Gender: 0,
                    };
                  })
                }
                className={`${
                  userData.Gender == 0
                    ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    : "py-2.5 px-10 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                }`}
              >
                Kız
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() =>
                setUserData((prev) => {
                  return {
                    ...prev,
                    IdType: 0,
                    Email: "",
                    IdNumber: "",
                  };
                })
              }
              className={`${
                userData.IdType == 0
                  ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  : "py-2.5 px-5 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              }`}
            >
              Öğrenci
            </button>
            <button
              type="button"
              onClick={() =>
                setUserData((prev) => {
                  return {
                    ...prev,
                    IdType: 1,
                    Email: "",
                    IdNumber: "",
                  };
                })
              }
              className={`${
                userData.IdType == 1
                  ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  : "py-2.5 px-5 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              }`}
            >
              Personel
            </button>
          </div>

          <div>
            <label htmlFor="#" className="block pb-2">
              Rol
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() =>
                  setUserData((prev) => {
                    return {
                      ...prev,
                      Auth: 1,
                    };
                  })
                }
                className={`${
                  userData.Auth == 1
                    ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    : "py-2.5 px-5 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                }`}
              >
                Kullanıcı
              </button>
              <button
                type="button"
                onClick={() =>
                  setUserData((prev) => {
                    return {
                      ...prev,
                      Auth: 0,
                    };
                  })
                }
                className={`${
                  userData.Auth == 0
                    ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    : "py-2.5 px-5 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                }`}
              >
                Yetkılı
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {userData.IdType == 0 ? "Öğrenci Numara" : "Okul E-Posta"}
            </label>
            <input
              type={`${userData.IdType == 0 ? "number" : "email"}`}
              name="email"
              id="email"
              value={userData.IdType == 0 ? userData.IdNumber : userData.Email}
              onChange={(e) =>
                setUserData((prev) => {
                  if (userData.IdType == 0) {
                    return {
                      ...prev,
                      Email: `${e.target.value}@samsun.edu.tr`,
                      IdNumber: e.target.value,
                    };
                  } else {
                    return {
                      ...prev,
                      Email: e.target.value,
                    };
                  }
                })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={`${
                userData.IdType == 0
                  ? "numara@samsun.edu.tr"
                  : "name@samsun.edu.tr"
              }`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}
