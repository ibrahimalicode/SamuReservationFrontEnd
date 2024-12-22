import { Route, Routes } from "react-router-dom";
import FacilitiesPage from "../components/facilities/pages/FacilitiesPage";

const Facilities = () => {
  return (
    <Routes>
      <Route path="/" element={<FacilitiesPage />} />
    </Routes>
  );
};

export default Facilities;
