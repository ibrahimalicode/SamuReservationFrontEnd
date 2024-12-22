import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { PopupProvider } from "./context/PopupContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PopupProvider>
          <App />
        </PopupProvider>
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
  </StrictMode>
);
