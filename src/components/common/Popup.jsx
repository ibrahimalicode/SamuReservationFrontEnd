import { usePopup } from "../../context/PopupContext";

const Popup = () => {
  const { popupContent } = usePopup();
  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center transition-colors p-[2%] z-[999] ${
        popupContent ? "visible bg-black/20" : "invisible"
      }`}
    >
      <div
        className={`bg-gray-50 dark:bg-gray-700 w-full max-w-[45rem] rounded-xl transition-all ${
          popupContent ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        {popupContent}
      </div>
    </div>
  );
};

export default Popup;
