import Badge from "./BadgeABOUT.jsx";
import PropTypes from "prop-types";
import "./MainABOUT.css";

const Main = ({ className = "" }) => {
  return (
    <div className={`main ${className}`}>
      <img
        className="grid-icon"
        loading="lazy"
        alt=""
        src="/IMG_5643.png"
        style={{ marginTop: "100px" }}
      />
      <div className="right-column">
        <div className="profile">
          <div className="grid">
            <div className="grid1">
              <h1 className="kelly-ohgee">
                <p className="kelly">Kelly </p>
                <p className="kelly">Ohgee</p>
              </h1>
              <h2
                className="my-mission-is"
                style={{
                  lineHeight: "1.6",
                  wordSpacing: "-3px", // Reduce space between words
                }}
              >
                My mission is to revolutionize the way we perceive education,
                empowering future generations to thrive. Your growth, your
                progress, and your achievement, my concern.
              </h2>
            </div>
            <div className="grid2">
              <Badge
                size="Default"
                style="Default"
                pharrowDownLight="/pharrowdownlight.svg"
              />
              <div className="about-me">About Me</div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Cards Moved Below Video ✅ */}
      <div className="cards">
        <div className="small-card-grid">
          <div className="card small-card">
            <h2>Background</h2>
            <p>
              Kelly Ohgee is a 23-year-old entrepreneur, philanthropist,
              speaker, and digital media force. Born on March 1, 2002, with deep
              Nigerian roots, she is one of four siblings and a passionate
              builder of ideas that empower. Her mission centers on helping
              people unlock clarity, live with purpose, and use their gifts to
              create generational impact. Whether through education, content, or
              community, Kelly brings a heart-led yet highly strategic approach
              to every endeavor.
            </p>
          </div>

          <div className="card small-card">
            <h2>Career Beginnings</h2>
            <p>
              Kelly’s professional journey began in the trading industry, where
              she quickly distinguished herself as a sharp thinker and an early
              disruptor. After achieving success in the stock market, she
              channeled her knowledge into founding Cash Capital Investment
              Group, a pioneering e-learning platform that reached over 50,000
              traders worldwide. As her influence and vision grew, she launched
              TradeIT Solutions, a modern financial education company built for
              the next generation. TradeIT merges practical trading skills with
              intentional learning and real-world strategy offering an
              exclusive, high-performance residency that helps people not only
              trade better, but live better. It now stands at the intersection
              of fintech, education, and impact.
            </p>
          </div>

          <div className="card small-card">
            <h2>CREATIVE & CONTENT WORK</h2>
            <p>
              In addition to her work in finance and education, Kelly is a
              multifaceted creator and brand strategist. As the founder of Naza
              Haus, a creative strategy agency, she helps public figures,
              influencers, and purpose-driven brands scale their voice, visuals,
              and value with integrity. Her personal content spans YouTube,
              Instagram, and Patreon, where she believes in the power of sharing
              her learned lessons and behind-the-scenes of brand building. Every
              piece of content is built to educate, entertain, or empower the
              soul.
            </p>
          </div>

          <div className="card small-card">
            <h2>PERSONAL DEVELOPMENT & PHILOSOPHY</h2>
            <p>
              Driven by a desire to create lasting change, Kelly integrates
              faith, stewardship, and personal growth into everything she
              builds. She believes financial success means little if it isn’t
              used to uplift others and that real impact starts with inner
              alignment. Through her platforms, she teaches not just how to
              build wealth, but how to build character, vision, and a life that
              gives back. She champions a holistic approach that prioritizes
              resilience, integrity, and community, helping others see that it’s
              possible to grow your income and your impact at the same time.
            </p>
          </div>

          <div className="card small-card">
            <h2>Vision and Impact</h2>
            <p>
              Kelly’s content and platforms have touched over 20 million people,
              making her one of the most authentic voices in digital education,
              entrepreneurship, and personal transformation today. But her goal
              isn’t fame. It’s freedom for herself and others. Her long-term
              mission is to rebuild trust in education, especially in the
              financial space, by setting new standards of clarity, ethics, and
              excellence. She’s currently leading the launch of TradeIT’s
              Ivy-League-style residency, releasing a viral docuseries on the
              broken state of the trading industry, and producing purpose-driven
              content to reach new generations with truth, strategy, and grace.
              <br />
              <br />
              She remains deeply committed to building a world where:
              <ul>
                <li>
                  Wealth is measured by what we give, not just what we keep
                </li>
                <li>Growth is both purpose-driven and strategic</li>
                <li>Success uplifts more than just ourselves</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

Main.propTypes = {
  className: PropTypes.string,
};

export default Main;
