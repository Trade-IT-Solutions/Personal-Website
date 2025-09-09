


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./SectionProcess1.module.css";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", delay },
  }),
};

const SectionProcess1 = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className={styles.sectionProcess}>
      <div className={styles.container}>
        {[
          { id: "01", title: "FINANCIAL EDUCATION", text: "Through her online platforms, Kelly places an emphasis on breaking down the often overlooked truths about business, life, and mindset. Her goal is to provide real, honest insights aimed at changing the way you think, succeed, and prosper financially." },
          { id: "02", title: "CINEMA-BASED LESSONS", text: "Through her main YouTube channel, Kelly turns life’s toughest situations into powerful, motivational mini-movies with a goal to inspire, teach, and remind us all that growth comes from helping others." },
          { id: "03", title: "UNIFIED PRIVATE COMMUNITY", text: "The Ohgee Family is a tight-knit, exclusive space where people passionate about finance, business, and personal growth come together to learn, share, and support each other on their journeys." },
          { id: "04", title: "SOCIAL MEDIA", text: "On Instagram and X (Twitter), Kelly shares her unfiltered thoughts, daily life, and advice, always with the goal of helping YOU grow and succeed." },
          { id: "05", title: "The BIG THING", text: " Finding her first major success in the trading industry, Kelly has dedicated her time and resources to revolutionizing its education. She’s now building an innovative EdTech company, called TradeIT Solutions, to make that transformation sustainable and accessible for all." }
        ].map((block, index) => (
          <motion.div
            key={block.id}
            className={`${styles.grid} ${isMobile ? styles.mobileGrid : ""}`}
            initial="hidden"
            whileInView="visible"
            custom={index * 0.3}
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <div className={styles.badge}>{block.id}</div>
            <div className={`${styles.card} ${isMobile ? styles.mobileCard : index % 2 === 0 ? styles.cardLeft : styles.cardRight}`}>
              <h2 className={styles.title}>{block.title}</h2>
              <p className={styles.text}>{block.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SectionProcess1;
