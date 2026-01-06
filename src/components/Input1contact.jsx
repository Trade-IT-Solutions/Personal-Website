

import React from "react";

import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./Input1contact.module.css";

const Input1 = ({
  className = "",
  style = "Default",
  inputHeight = "50px",
  name1,
  nameWidth,
  nameDisplay,
  value,
  onChange,
  type = "text",
  name,
  maxLength,
  isTextArea = false,
}) => {
  const inputStyle = useMemo(() => {
    return {
      height: isTextArea ? "150px" : inputHeight,
    };
  }, [inputHeight, isTextArea]);

  const nameStyle = useMemo(() => {
    return {
      width: nameWidth,
      display: nameDisplay,
    };
  }, [nameWidth, nameDisplay]);

  return (
    <>
      {isTextArea ? (
        <div className={styles.textAreaContainer}>
          <label className={styles.textAreaLabel}>{name1}</label>
          <textarea
            className={styles.textAreaField}
            name={name}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
          />
        </div>
      ) : (
        <div className={[styles.input, className].join(" ")} data-style={style} style={inputStyle}>
          <label className={styles.name} style={nameStyle}>
            {name1}
          </label>
          <input
            className={styles.inputField}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
          />
        </div>
      )}
    </>
  );
};

Input1.propTypes = {
  className: PropTypes.string,
  name1: PropTypes.string,
  style: PropTypes.string,
  inputHeight: PropTypes.string,
  nameWidth: PropTypes.string,
  nameDisplay: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  isTextArea: PropTypes.bool,
};

export default Input1;
