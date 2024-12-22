import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const VerifyPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user?.emailVerified) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Hesabınızı doğrulayınız
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            E-Posta adresinize doğrulama e-postası gönderdik. Lütfen E-Posta
            adresinizi kontrol edin ve hesabınızı doğrulayınız.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VerifyPage;
