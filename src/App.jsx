import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./config/ProtectedRoute";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import RegisterPage from "./pages/Register";
import VerifyPage from "./pages/Verify";
import ForgetPasswordPage from "./pages/ForgetPassword";
import Popup from "./components/common/Popup";

function App() {
  document.addEventListener(
    "wheel",
    function (event) {
      if (document.activeElement.type === "number") {
        event.preventDefault();
      }
    },
    { passive: false }
  );

  return (
    <>
      <Popup />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
