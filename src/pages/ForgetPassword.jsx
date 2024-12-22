import { useState } from "react";
import toast from "react-hot-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

const ForgetPasswordPage = () => {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!Email.includes("samsun.edu.tr")) {
      toast.error("Lütfen okul epostanızı giriniz.");
      return;
    }

    setIsLoading(true);
    toast.loading("İşleniyor...");

    try {
      const userQuery = await getDoc(doc(db, "Users", Email));
      if (!userQuery.exists()) {
        toast.dismiss();
        toast.error("Kullanıcı Bulunamadı");
        setIsLoading(false);
      }

      await sendPasswordResetEmail(auth, Email, {
        url: `${import.meta.env.VITE_FRONTEND_URL}/`,
      });
      navigate("/login");
      toast.dismiss();
      toast.success(
        "Şifrenizi sıfırlamak için bir e-posta gönderildi. Lütfen e-postanızı kontrol edin."
      );
    } catch (error) {
      toast.dismiss();
      toast.success("Bir hata oluştu. Lütfen e-posta adresinizi kontrol edin.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Giriş Yap
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  E-Posta (samsun.edu.tr)
                </label>
                <input
                  type="email"
                  name="Email"
                  id="email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@samsun.edu.tr"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Giriş Yap
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgetPasswordPage;
