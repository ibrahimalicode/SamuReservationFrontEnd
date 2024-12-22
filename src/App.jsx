import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./config/ProtectedRoute";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import RegisterPage from "./pages/Register";
import VerifyPage from "./pages/Verify";

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
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
