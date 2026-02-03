import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Calendar from "../components/Calendar";

const CalendarPage = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);

  return (
    <div className="min-h-screen overflow-y-scroll no-scrollbar dark:bg-[#0a1216]">
      <Navbar setNavbarHeight={setNavbarHeight} />
      <div style={{ marginTop: `${navbarHeight - 10}px` }}>
        <Calendar />
        <Footer />
      </div>
    </div>
  );
};

export default CalendarPage;