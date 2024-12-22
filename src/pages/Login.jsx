import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore";

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    Email: "",
    Password: "",
  });

  useEffect(() => {
    if (user && user?.emailVerified) {
      navigate("/");
    }
  }, [user, navigate]);

  //SET STATE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  //LOGIN
  async function handleLogin(e) {
    e.preventDefault();
    const { Email, Password } = userData;

    if (!Email.includes("samsun.edu.tr")) {
      toast.error("Lütfen okul epostanızı giriniz.");
      return;
    }

    if (Password.length < 6) {
      toast.error("Şifreniz en az 6 karakter olmalı.");
      return;
    }

    toast.loading("İşleniyor...");
    setIsLoading(true);
    try {
      // Step 1: Check if user exists in Firestore
      const userDocRef = doc(db, "Users", Email);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        // User not found in Firestore
        toast.dismiss();
        setIsLoading(false);
        toast.error("Kullanıcı bulunamadı. Lütfen kaydolun.");
        return;
      }

      // Step 2: Check if user exists in Firebase Auth
      if (userSnap.data().Password) {
        // User not found in Firebase Auth, create the user
        console.log("User not found in Firebase Auth, creating the user...");
        try {
          const newUserCredential = await createUserWithEmailAndPassword(
            auth,
            Email,
            userSnap.data().Password
          );
          const newUser = newUserCredential.user;
          await updateDoc(userDocRef, {
            Password: deleteField(), // This will delete the 'Password' field
          });

          // Send email verification
          await sendEmailVerification(newUser, {
            url: `${import.meta.env.VITE_FRONTEND_URL}/`,
          });

          toast.dismiss();
          setIsLoading(false);
          navigate("/verify-email");
          toast.success(
            "E-posta doğrulama linki gönderildi. E-posta adresinizi doğrulayınız"
          );
          return;
        } catch (createError) {
          console.error("Error creating user:", createError);
          toast.dismiss();
          toast.error("Kullanıcı oluşturulurken bir hata oluştu.");
          setIsLoading(false);
        }
      }

      // Step 3: If the user exists in Firebase Auth, sign in
      try {
        // Sign in the user with email and password
        const userCredential = await signInWithEmailAndPassword(
          auth,
          Email,
          Password
        );

        // Check if the user's email is verified
        const user = userCredential.user;

        if (!user.emailVerified) {
          toast.error("E-posta adresinizi doğrulamanız gerekiyor.");

          // Send verification email again
          await sendEmailVerification(user, {
            url: `${import.meta.env.VITE_FRONTEND_URL}/`,
          });

          toast.dismiss();
          setIsLoading(false);
          navigate("/verify-email");
          toast.success(
            "E-posta doğrulama linki gönderildi. E-posta adresinizi doğrulayınız"
          );
          return;
        }

        // If the email is verified, proceed to the main page
        navigate("/");
        toast.dismiss();
        setIsLoading(false);
        toast.success("Başarıyla giriş yaptınız");
        console.log("User logged in successfully:", userCredential.user);
      } catch (error) {
        if (error.code === "auth/invalid-credential") {
          toast.dismiss();
          toast.error("Lütfen bilgilerinizi kontrol ediniz.");
        } else {
          toast.dismiss();
          toast.error("Bir hata oluştu. Lütfen tekrar deneyiniz");
        }
        setIsLoading(false);
        console.log(error.code);
      }
    } catch (error) {
      toast.dismiss();
      console.log(error);
      setIsLoading(false);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyiniz");
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
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
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
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@samsun.edu.tr"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Şifre
                </label>
                <input
                  type="text"
                  name="Password"
                  id="password"
                  onChange={handleChange}
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
                Giriş Yap
              </button>
              <div className="flex justify-between">
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Hesabınız Yok Mu?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Kayıt ol
                  </Link>
                </p>

                <p>
                  <Link
                    to="/forget-password"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Şifremi unuttum?
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
