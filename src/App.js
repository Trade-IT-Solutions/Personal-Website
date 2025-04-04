import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigationType,
  useLocation
} from "react-router-dom";

import Frontpage from "./pages/Frontpage.js";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.js";

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  // Scroll to top on navigation (except for back button)
  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  // Set dynamic page titles and meta descriptions
  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "Home - Kelly Website";
        metaDescription = "Welcome to the home page of Kelly Website.";
        break;
      case "/contact":
        title = "Contact - Kelly Website";
        metaDescription = "Get in touch with us.";
        break;
      case "/about":
        title = "About - Kelly Website";
        metaDescription = "Learn more about Kelly and the mission.";
        break;
      default:
        title = "Kelly Website";
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Frontpage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />

      {/* Redirect all other paths to the frontpage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
