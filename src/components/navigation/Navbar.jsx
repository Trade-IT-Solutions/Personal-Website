import { Link, NavLink } from "react-router-dom";
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
  {
    label: "test",
    href: "/test",
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
        <div>
          <div className={styles.navbarDesktopMenu}>
            {pages.map((page) => {
              return (
                <NavLink
                  to={page.href}
                  className={styles.navbarDesktopLinks}
                  key={page.label}
                >
                  {page.label}
                </NavLink>
              );
            })}
          </div>
        </div>
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
      console.log("Scrolling down");
      setIsScrollingDown(true);
    }
    if (isScrollingDown === true && window.scrollY < lastScrollY) {
      // Scrolling up → show navbar
      console.log("Scrolling up");
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
              className={styles.topNavItem}
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
