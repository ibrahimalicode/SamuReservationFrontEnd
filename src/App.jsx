import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./config/ProtectedRoute";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import RegisterPage from "./pages/Register";

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
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
