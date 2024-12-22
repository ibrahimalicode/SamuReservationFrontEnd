import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
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
