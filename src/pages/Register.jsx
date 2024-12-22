import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import verifyCode from "./Verify";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [Code, setCode] = useState("");
  const [toVerify, setToVerify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
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
      const { Email, Password, ConfirmPassword } = userData;
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

      const userQuery = await getDocs(
        query(collection(db, "Users"), where("Email", "==", Email))
      );

      if (!userQuery.empty) {
        toast.dismiss();
        setIsLoading(false);
        toast.error(`${Email} E-Posta adresiyle Kullanıcı zaten var.`);
        return;
      }

      //GENERATE A CODE
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      //SAVE THE CODE
      const verificationRef = doc(db, "EmailVerification", Email);
      await setDoc(verificationRef, {
        code: verificationCode,
        createdAt: new Date().toISOString(),
      });

      //SEND THE CODE
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const sendVerificationEmail = await fetch(`${baseUrl}/sendEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: Email,
          subject: "Hesabınızı Onaylayınız",
          body: `Onay Kodunuz: ${verificationCode}.`,
        }),
      });

      // CHECK IF EMAIL WAS SENT SUCCESSFULLY
      if (sendVerificationEmail.ok) {
        toast.dismiss();
        setIsLoading(false);
        toast.success(`Onay kodu ${Email} E-Posta adresinize gönderildi.`);
        setToVerify(true);
      } else {
        toast.dismiss();
        setIsLoading(false);
        toast.error("Bir hata oluştu. Lütfen tekrar deneyiniz");
        const errorResponse = await sendVerificationEmail.json();
        console.error("Failed to send email:", errorResponse.message);
      }
    } catch (error) {
      console.error("Error sending the code", error.message);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const {
        Department,
        Email,
        FirstName,
        Gender,
        IdNumber,
        IdType,
        LastName,
        Password,
        PhoneNumber,
        // SchoolYear,
      } = userData;

      setIsLoading(true);
      toast.loading("İşleniyor...");
      if (await verifyCode(Email, Code)) {
        let userCredential;
        try {
          userCredential = await createUserWithEmailAndPassword(
            auth,
            Email,
            Password
          );
        } catch (error) {
          toast.dismiss();
          setIsLoading(false);
          toast.error("Bir hata oluştu. Lütfen tekrar deneyiniz");
          console.log(error);
          throw new Error(error);
        }

        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          Auth: 1,
          Department,
          Email,
          FirstName,
          Gender,
          IdNumber,
          IdType,
          LastName,
          PhoneNumber,
          // SchoolYear,
          createdAt: new Date(),
        });
        verifyCode(Email, Code, true); //DELETE THE CODE
        toast.dismiss();
        setIsLoading(false);
        toast.success("Hesabınız başarıyla oluşturulmuştur.");
        navigate("login");
      } else {
        toast.dismiss();
        setIsLoading(false);
        toast.error("Yanlış Kod. Tekrar deneyiniz");
      }
    } catch (error) {
      toast.dismiss();
      setIsLoading(false);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyiniz");
      console.error("Error during registration:", error.message);
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-8 max-h-screen overflow-auto">
      {!toVerify ? (
        <div className="flex flex-col items-center justify-center px-6 py-4 mx-auto lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:px-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                Kayıt Ol
              </h1>

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
                    value={
                      userData.IdType == 0 ? userData.IdNumber : userData.Email
                    }
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
                  Kayıt ol
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Hesabınız Var Mı?{" "}
                  <a
                    href="login"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Giriş Yap
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-4 mx-auto lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:px-8">
              <button
                type="button"
                onClick={() => setToVerify(false)}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="rotate-180 w-3.5 h-3.5 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
                Geri
              </button>
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                Onayla
              </h1>

              <div>
                <span className="text-blue-600">{userData.Email}</span> E-Posta
                adresinize onay kodu gönderdik. Lütfen hesabınızı onaylayın.
              </div>

              <form onSubmit={handleRegister}>
                <div>
                  <label
                    htmlFor="code"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Onay Kodu
                  </label>
                  <input
                    type="text"
                    name="code"
                    id="code"
                    value={Code}
                    onChange={(e) => setCode(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Kod"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Onayla
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RegisterPage;
