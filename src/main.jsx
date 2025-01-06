import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { PopupProvider } from "./context/PopupContext.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <AppContextProvider>
        <PopupProvider>
          <App />
        </PopupProvider>
      </AppContextProvider>
    </AuthProvider>
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 5000,
        className: "",
        style: {
          border: "1px solid #713200",
          padding: "10px",
          color: "#713200",
        },
      }}
    />
  </BrowserRouter>
);
