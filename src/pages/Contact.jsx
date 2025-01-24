import { Route, Routes } from "react-router-dom";
import ContactPage from "../components/contact/pages/ContactPage";

const Contact = () => {
  return (
    <Routes>
      <Route path="/" element={<ContactPage />} />
    </Routes>
  );
};

export default Contact;
