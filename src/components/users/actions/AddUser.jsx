import { useState } from "react";
import { CloseI } from "../../../assets/icons";
import { usePopup } from "../../../context/PopupContext";
import toast from "react-hot-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const AddUser = () => {
  const { setPopupContent } = usePopup();

  function handleClick() {
    setPopupContent(<AddUserPopup />);
  }
  return (
    <button
      onClick={handleClick}
      type="button"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      Kullanıcı Ekle
    </button>
  );
};

export default AddUser;

//
//POPUP
function AddUserPopup() {
  const { setPopupContent } = usePopup();

  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    Auth: 1,
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
    IdType: 0, //student
    IdNumber: "",
    Email: "",
    Department: "",
    Gender: 1,
    Password: "",
    ConfirmPassword: "",
    SchoolYear: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const {
        Auth,
        Department,
        Email,
        FirstName,
        Gender,
        IdNumber,
        IdType,
        LastName,
        Password,
        ConfirmPassword,
        PhoneNumber,
      } = userData;

      if (Password !== ConfirmPassword) {
        toast.error("Şifreler aynı değil");
        return;
      }
      if (Password.length < 6) {
        toast.error("Şifreniz en az 6 karakter olmalı.");
        return;
      }

      setIsLoading(true);
      toast.loading("İşleniyor...");

      const userSnap = await getDoc(doc(db, "Users", Email));

      if (userSnap.exists()) {
        toast.dismiss();
        setIsLoading(false);
        toast.error(`${Email} E-Posta adresiyle Kullanıcı zaten var.`);
        return;
      }

      await setDoc(doc(db, "Users", Email), {
        Auth,
        Department,
        Email,
        FirstName,
        Gender,
        IdNumber,
        IdType,
        LastName,
        PhoneNumber,
        Password,
        createdAt: new Date(),
      });

      toast.dismiss();
      setIsLoading(false);
      setPopupContent(null);
      toast.success("Kullanıcı başarıyla eklendi.");
    } catch (error) {
      toast.dismiss();
      setIsLoading(false);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyiniz");
      console.error("Error during registration:", error.message);
    }
  }

  return (
    <div className="py-8 px-4 max-h-[50rem] overflow-y-auto relative">
      <h1 className="text-center font-bold text-2xl">Kullanıcı Ekle</h1>
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

          <div>
            <label
              htmlFor="confirm-password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Şifre
            </label>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              value={userData.Password}
              onChange={(e) =>
                setUserData((prev) => {
                  return {
                    ...prev,
                    Password: e.target.value,
                  };
                })
              }
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Şifre Tekrar
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={userData.ConfirmPassword}
              onChange={(e) =>
                setUserData((prev) => {
                  return {
                    ...prev,
                    ConfirmPassword: e.target.value,
                  };
                })
              }
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
