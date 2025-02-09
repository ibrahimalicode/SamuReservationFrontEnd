import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import Users from "./Users";
import Facilities from "./Facilities";
import Settings from "./Settings";
import ShowNotification from "../components/notification/ShowNotification";
import UserRequests from "./UserRequests";
import Contact from "./Contact";
import Dashboard from "./Dashboard";

const HomePage = () => {
  const [isSideOpen, setIsSideOpen] = useState(false);
  return (
    <>
      <ShowNotification />
      <Header isSideOpen={isSideOpen} setIsSideOpen={setIsSideOpen} />
      <Sidebar isSideOpen={isSideOpen} setIsSideOpen={setIsSideOpen} />
      <Routes>
        <Route path="/" element={<Navigate to="/facilities" />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/users/*" element={<Users />} />
        <Route path="/facilities/*" element={<Facilities />} />
        <Route path="/settings/*" element={<Settings />} />
        <Route path="/requests/*" element={<UserRequests />} />
        <Route path="/contact/*" element={<Contact />} />
      </Routes>
    </>
  );
};

export default HomePage;
