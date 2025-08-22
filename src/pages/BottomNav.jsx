import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiUser, FiMail } from "react-icons/fi";
import styles from "./BottomNav.module.css";

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isVisible, setIsVisible] = useState(true);
  let inactivityTimer = null;

  // Function to handle user interaction and make the navbar visible
  const handleUserInteraction = () => {
    setIsVisible(true);
    
    // Clear any existing timer
    clearTimeout(inactivityTimer);
    
    // Set a new timer to hide the navbar after 3 seconds of inactivity
    inactivityTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // 3 seconds
  };

  // Set up event listeners for user interaction
  useEffect(() => {
    // Show navbar immediately when component mounts
    setIsVisible(true);
    
    // Start the initial timer
    inactivityTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    // Add event listeners for user interactions
    window.addEventListener("scroll", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);
    window.addEventListener("mousemove", handleUserInteraction);
    window.addEventListener("click", handleUserInteraction);
    
    // Clean up event listeners on component unmount
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("scroll", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("mousemove", handleUserInteraction);
      window.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  return (
    <nav className={`${styles.bottomNav} ${isVisible ? styles.visible : styles.hidden}`}>
      <Link 
        to="/" 
        className={`${styles.bottomNavItem} ${currentPath === "/" ? styles.active : ""}`}
      >
        <div className={styles.iconContainer}>
          <FiHome size={20} />
          {currentPath === "/" && <div className={styles.activeIndicator}></div>}
        </div>
        <span>Home</span>
      </Link>
      
      <Link 
        to="/about" 
        className={`${styles.bottomNavItem} ${currentPath === "/about" ? styles.active : ""}`}
      >
        <div className={styles.iconContainer}>
          <FiUser size={20} />
          {currentPath === "/about" && <div className={styles.activeIndicator}></div>}
        </div>
        <span>About</span>
      </Link>
      
      <Link 
        to="/contact" 
        className={`${styles.bottomNavItem} ${currentPath === "/contact" ? styles.active : ""}`}
      >
        <div className={styles.iconContainer}>
          <FiMail size={20} />
          {currentPath === "/contact" && <div className={styles.activeIndicator}></div>}
        </div>
        <span>Contact</span>
      </Link>
    </nav>
  );
};

export default BottomNav;