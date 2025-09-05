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
import Bookings from "./pages/Bookings.jsx";

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
        title = "Kelly Ohgee | Empowerment Through Education";
        metaDescription = "Kelly Ohgee is a visionary speaker and entrepreneur reshaping the future of education. Empowering the next generation through purpose-driven learning and personal growth.";
        break;
      case "/contact":
        title = "Contact - Kelly Ohgee | Empowerment Through Education";
        metaDescription = "Get in touch with Kelly.";
        break;
      case "/about":
        title = "About - Kelly Ohgee | Empowerment Through Education";
        metaDescription = "Learn more about Kelly and Her mission.";
        break;
      case "/bookings":
        title = "Book Kelly to Speak - Kelly Ohgee | Empowerment Through Education";
        metaDescription = "Book Kelly Ohgee for keynotes, panels, workshops, podcasts and speaking engagements. Transform your event with purpose-driven education and inspiration.";
        break;
      default:
        title = "Kelly Ohgee | Empowerment Through Education";
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
      <Route path="/bookings" element={<Bookings />} />

      {/* Redirect all other paths to the frontpage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;