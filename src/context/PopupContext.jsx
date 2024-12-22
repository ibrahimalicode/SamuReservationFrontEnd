import { createContext, useState, useContext, useEffect } from "react";

const PopupContext = createContext();

export const usePopup = () => useContext(PopupContext);

export const PopupProvider = ({ children }) => {
  const [popupContent, setPopupContent] = useState(null);
  const [contentRef, setContentRef] = useState([]);

  const handleClickOutside = (event) => {
    if (contentRef.length > 0) {
      contentRef.forEach((content) => {
        if (content.ref.current) {
          if (content.outRef?.current) {
            if (
              !content.ref.current.contains(event.target) &&
              !content.outRef.current.contains(event.target)
            ) {
              content.callback();
            }
          } else {
            if (!content.ref.current.contains(event.target)) {
              content.callback();
            }
          }
        }
      });
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [contentRef]);

  return (
    <PopupContext.Provider
      value={{
        popupContent,
        setPopupContent,
        contentRef,
        setContentRef,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};
