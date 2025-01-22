import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { usePopup } from "../../context/PopupContext";
import { CloseI } from "../../assets/icons";

const ShowNotification = () => {
  const { setPopupContent } = usePopup();
  const { settingsData } = useAppContext();

  useEffect(() => {
    if (settingsData?.ShowNotifications) {
      const html = (
        <main className="text-gray-900 dark:text-white pb-4">
          <div className="py-8 px-4 max-h-[95vh] overflow-y-auto relative">
            <h1 className="text-center font-bold text-2xl">Duyuru</h1>
            <button
              type="button"
              className="absolute top-8 right-8 hover:text-red-600 border rounded-full p-2 hover:border-red-600"
              onClick={() => setPopupContent(null)}
            >
              <CloseI />
            </button>
          </div>
          <div className="text-center">{settingsData.Notifications}</div>
        </main>
      );
      setPopupContent(html);
    }
  }, [
    settingsData?.ShowNotifications,
    settingsData?.Notifications,
    setPopupContent,
  ]);

  return;
};

export default ShowNotification;
