import { useState } from "react";
import toast from "react-hot-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAppContext } from "../../../context/AppContext";

const SettingsPage = () => {
  const { settingsData, setSettingsData } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(
    settingsData?.ShowNotifications
  );
  const [notification, setNotification] = useState(settingsData.Notifications);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettingsData((prev) => ({ ...prev, [name]: value }));
  };

  function handleAddSocial() {
    setSettingsData((prev) => {
      return {
        ...prev,
        SocialMediaLinks: [...prev.SocialMediaLinks, { Label: "", Link: "" }],
      };
    });
  }

  function handleRemoveSocial(index) {
    setSettingsData((prev) => {
      return {
        ...prev,
        SocialMediaLinks: prev.SocialMediaLinks.filter((_, i) => i !== index),
      };
    });
  }

  function handleInputChange(e, index, key) {
    setSettingsData((prev) => {
      const updatedLinks = [...prev.SocialMediaLinks];
      updatedLinks[index][key] = e.target.value;
      return { ...prev, SocialMediaLinks: updatedLinks };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setIsLoading(true);
      toast.loading("İşleniyor...");

      const settingsRef = doc(db, "SiteSettings", "data");

      await updateDoc(settingsRef, {
        ...settingsData,
        ShowNotifications: showNotifications,
        Notifications: notification,
        updatedAt: new Date(),
      });

      toast.dismiss();
      setIsLoading(false);
      toast.success("Ayarlar başarıyla güncelendi.");
    } catch (error) {
      toast.dismiss();
      setIsLoading(false);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyiniz");
      console.error("Error during registration:", error.message);
    }
  }

  return (
    <section className="md:ml-64 pt-20 px-[4%] bg-gray-100 dark:bg-gray-700 min-h-screen">
      <div className="w-full py-6">
        <h1 className="font-bold text-2xl mb-4 text-gray-900 dark:text-white">
          Ayarlar
        </h1>
        {settingsData && (
          <form
            className="space-y-4 md:space-y-6 max-w-3xl"
            onSubmit={handleSubmit}
          >
            <div className="flex">
              <div className="w-full">
                <label
                  htmlFor="Notifications"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Duyuru
                </label>
                <textarea
                  type="text"
                  name="Notifications"
                  id="Notifications"
                  value={notification}
                  onChange={(e) => setNotification(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full h-32 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <div className="whitespace-nowrap text-center">
                <label
                  htmlFor="ShowNotifications"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Duyuruyu Göster
                </label>
                <input
                  type="checkbox"
                  name="ShowNotifications"
                  checked={showNotifications}
                  onChange={() => setShowNotifications(!showNotifications)}
                  className="size-5 mx-3 mt-2"
                />
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="PrivacyText"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Taahhüt Metni
              </label>
              <textarea
                type="text"
                name="PrivacyText"
                id="PrivacyText"
                value={settingsData.PrivacyText}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full h-32 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="w-full flex justify-end pt-5">
              <button
                type="button"
                onClick={handleAddSocial}
                className="w-max text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Sosyal Medya Ekle
              </button>
            </div>
            {settingsData.SocialMediaLinks.map((link, i) => (
              <div className="w-full flex max-sm:flex-col gap-3" key={i}>
                <div className="w-full max-w-36">
                  <label
                    htmlFor={i}
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Sosyal Medya Adı
                  </label>
                  <input
                    type="text"
                    name={i}
                    id={i}
                    value={link.Label}
                    onChange={(e) => handleInputChange(e, i, "Label")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full px-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="flex w-full">
                  <div className="w-full">
                    <label
                      htmlFor={-i}
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Sosyal Medya Link
                    </label>
                    <input
                      type="text"
                      name={-i}
                      id={-i}
                      value={link.Link}
                      onChange={(e) => handleInputChange(e, i, "Link")}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full px-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSocial(i)}
                    className="mt-6 pl-3"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-max text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Kaydet
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default SettingsPage;
