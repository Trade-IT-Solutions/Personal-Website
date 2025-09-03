import { Link } from "react-router-dom";
import { FiHome, FiUser, FiCalendar, FiMail } from "react-icons/fi";
import styles from "./Navbar.module.css";
import { useEffect, useState } from "react";

const pages = [
  {
    label: "home",
    href: "/",
    mobileIcon: <FiHome size={20} />,
  },
  {
    label: "about",
    href: "/about",
    mobileIcon: <FiUser size={20} />,
  },
  {
    label: "contact",
    href: "/contact",
    mobileIcon: <FiMail size={20} />,
  },
  {
    label: "bookings",
    href: "/bookings",
    mobileIcon: <FiCalendar size={20} />,
  },
];

function NavbarDesktop() {
  return (
    // <div className={styles.container}>
    <header className={`${styles.navbarDesktopHeader}`}>
      <Link to="/" className={styles.logoContainer}>
        <img
          className={styles.kellyLogo1}
          alt="Kelly Logo"
          src="/kelly-logo-11@2x.png"
          loading="lazy"
        />
      </Link>
      <nav className={styles.navbarDesktop}>
        <div className={styles.navbarDesktopMenu}>
          {pages.map((page) => {
            return (
              <Link
                to={page.href}
                className={styles.navbarDesktopLinks}
                key={page.label}
              >
                {page.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
    // </div>
  );
}

function NavbarTablet() {
  return (
    <>
      <nav
        className={`${styles.topNav} 
        `}
      >
        {pages.map((page) => {
          return (
            <Link to={page.href} className={styles.topNavItem} key={page.label}>
              {page.mobileIcon}
              <span>{page.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function NavbarMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest("[data-navbar]")) {
        setIsOpen(false);
      }
    };

    const handleNavClick = (item, event) => {
      event.preventDefault();
      //   onNavClick(item);
      setIsOpen(false);
    };

    const toggleMobileMenu = () => {
      setIsOpen(!isOpen);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);
  return <>MOBILE</>;
}

function Navbar() {
  const [screenSize, setScreenSize] = useState();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {screenSize === "mobile" && <NavbarMobile />}
      {screenSize === "tablet" && <NavbarTablet />}
      {screenSize === "desktop" && <NavbarDesktop />}
    </>
  );
}

export default Navbar;
