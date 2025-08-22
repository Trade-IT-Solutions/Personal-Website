
import PropTypes from "prop-types";
import "./GridABOUT.css";

const Grid = ({ className = "" }) => {
  return (
    <div className={`grid10 ${className}`}>
      <div className="project-in-mind-parent">
        <h1 className="lets-make-your">Hello there...</h1>
        <h3 className="premium-web-design">
          Premium services to help your business stand out.
        </h3>
      </div>
      <button className="button2">
        <div className="button3">Get in touch</div>
      </button>
    </div>
  );
};

Grid.propTypes = {
  className: PropTypes.string,
};

export default Grid;
