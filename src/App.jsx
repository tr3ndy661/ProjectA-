import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { isMobile } from "react-device-detect";
import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Main/Main";
import LandingPage from "./components/LandingPage/LandingPage";
import MobileLandingPage from "./components/mobile/MobileLandingPage";
import CustomCursor from "./components/CustomCursor/CustomCursor";

// Custom hook for mobile detection
function useIsMobile() {
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobileView(window.innerWidth <= 768 || isMobile);
      // Add or remove a class to the body based on mobile view
      if (window.innerWidth <= 768 || isMobile) {
        document.body.classList.add("mobile-view");
      } else {
        document.body.classList.remove("mobile-view");
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return isMobileView;
}

function test() {
  return (
    <>
      <Sidebar />
      <Main />
    </>
  );
}

const App = () => {
  const isMobileView = useIsMobile();

  return (
    <Router>
      {!isMobileView && <CustomCursor />}
      <Routes>
        <Route
          path="/"
          element={isMobileView ? <MobileLandingPage /> : <LandingPage />}
        />
        <Route path="/test" element={test()} />
        <Route
          path="/app"
          element={
            <>
              <Sidebar />
              <Main />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
