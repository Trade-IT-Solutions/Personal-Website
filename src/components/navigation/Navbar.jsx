import { Link, NavLink } from "react-router-dom";
import { FiHome, FiUser, FiCalendar, FiMail, FiBook, FiVideo } from "react-icons/fi";
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
    label: "resources",
    href: "/resources",
    mobileIcon: <FiBook size={20} />,
  },
  {
    label: "talk",
    href: "/talk-with-kelly",
    mobileIcon: <FiVideo size={20} />,
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
      setIsScrollingDown(true);
    }
    if (isScrollingDown === true && window.scrollY < lastScrollY) {
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
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (isScrollingDown === false && window.scrollY > lastScrollY) {
      setIsScrollingDown(true);
    }
    if (isScrollingDown === true && window.scrollY < lastScrollY) {
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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

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
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        className={styles.hamburgerButton}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? (
          <IoClose className={styles.closeIcon} />
        ) : (
          <div className={styles.hamburgerIcon}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={closeMenu}>
          <nav
            ref={menuRef}
            id="mobile-menu"
            className={`${styles.dropdownMenu} ${isOpen ? styles.open : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Link to="/" className={styles.logoLink} onClick={closeMenu}>
              <img
                src="/kelly-logo-11@2x.png"
                alt="Kelly Logo"
                className={styles.kellyLogo}
              />
            </Link>
            <ul className={styles.navList}>
              {pages.map((page) => (
                <li key={page.label}>
                  <NavLink
                    to={page.href}
                    className={({ isActive }) =>
                      isActive
                        ? `active ${styles.navbarLinks}`
                        : `${styles.navbarLinks}`
                    }
                    onClick={closeMenu}
                  >
                    {page.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
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