import { Link, NavLink } from "react-router-dom";
import { FiHome, FiUser, FiCalendar, FiMail } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import styles from "./Navbar.module.css";
import { useEffect, useState, useRef } from "react";

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
        <ul className={styles.navbarDesktopMenu}>
          {pages.map((page) => (
            <li key={page.label} role="none">
              <NavLink
                to={page.href}
                className={({ isActive }) =>
                  isActive
                    ? `active ${styles.navbarLinks}`
                    : `${styles.navbarLinks}`
                }
                key={page.label}
              >
                {page.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function NavbarTablet() {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (isScrollingDown === false && window.scrollY > lastScrollY) {
      // Scrolling down → hide navbar
      setIsScrollingDown(true);
    }
    if (isScrollingDown === true && window.scrollY < lastScrollY) {
      // Scrolling up → show navbar
      setIsScrollingDown(false);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <header>
      <nav
        className={`${styles.topNav} ${
          isScrollingDown ? styles.hide : styles.show
        }`}
      >
        {pages.map((page) => {
          return (
            <NavLink
              to={page.href}
              className={({ isActive }) =>
                isActive
                  ? `active ${styles.topNavItem}`
                  : `${styles.topNavItem}`
              }
              key={page.label}
            >
              {page.mobileIcon}
              <span>{page.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}

const NavbarMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu
  const closeMenu = () => {
    setIsOpen(false);
  };

  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeMenu();
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    // Cleanup call back to reset styles when component unmounts
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTab = (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener("keydown", handleTab);
      firstElement?.focus();

      return () => document.removeEventListener("keydown", handleTab);
    }
  }, [isOpen]);

  return (
    <header>
      {/* Hamburger Button */}
      <button
        ref={buttonRef}
        className={styles.hamburgerButton}
        onClick={toggleMenu}
        aria-controls="mobile-menu"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? (
          <IoClose className={styles.closeIcon} />
        ) : (
          <div className={styles.hamburgerIcon}>
            {/* <span></span> */}
            <span></span>
            <span></span>
          </div>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Dropdown Menu */}
      <nav
        ref={menuRef}
        id="mobile-menu"
        className={`${styles.dropdownMenu} ${isOpen ? styles.open : ""}`}
        role="menu"
        aria-hidden={!isOpen}
      >
        {/* Logo */}
        <NavLink to="/" onClick={closeMenu} className={styles.logoLink}>
          <img
            className={styles.kellyLogo}
            alt="Kelly Logo"
            src="/kelly-logo-11@2x.png"
            loading="lazy"
            key={"logo"}
          />
        </NavLink>

        {/* Navigation Links */}
        <ul className={styles.navList}>
          {pages.map((page) => {
            return (
              <li key={page.label} role="none">
                <NavLink
                  to={page.href}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive
                      ? `active ${styles.navbarLinks}`
                      : `${styles.navbarLinks}`
                  }
                >
                  {page.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

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
