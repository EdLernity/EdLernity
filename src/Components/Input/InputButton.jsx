import { React } from "react";
import "./InputButton.css";
import { useState } from "react";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

function InputButton({
  type,
  label,
  value,
  name,
  placeholder,
  error,
  disabled,
  onChange,
  text,
  fullWidth = false,
}) {
  const [onChanges, setOnChanges] = useState(onChange);
  const [inputType, setInputType] = useState(type);
  const [icon, setIcon] = useState(eyeOff);

  const handleToggle = () => {
    setInputType((prevType) => (prevType === "password" ? "text" : "password"));
    setIcon((prevIcon) => (prevIcon === eyeOff ? eye : eyeOff));
  };

  const widthStyle = {
    width: fullWidth ? '100%' : 'auto'
  }
  const [isFocused, setIsFocused] = useState(false);
  const [isValue, setIsValue] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const onChangeT = (e) => {
    let isValueContained = e.target.value;
    console.log(isValueContained);
    if (isValueContained) {
      setIsValue(true);
    } else {
      setIsValue(false);
    }
    return onChanges;
  };

  return (
    <>
      {error && (
        <p className="flex text-red-800 text-sm font-normal mt-1 ml-3 px-2 justify-end">
          <span>{error}</span>
        </p>
      )}
      <div
        className={`inputbtn ${
          (isFocused && isValue) || isFocused
            ? "focused"
            : isValue
            ? "valuecontained"
            : ""
        } flex`}
      >
        <label htmlFor={label} className={isFocused ? "focused-label" : ""}>
          {label}
        </label>
        <input
          style={widthStyle}
          type={inputType}
          id={label}
          name={name}
          value={value}
          text={text}
          placeholder={placeholder}
          error={error}
          disabled={disabled}
          onChange={onChangeT}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {type === "password" ? (
          <span
            className="flex justify-around items-center"
            onClick={handleToggle}
          >
            <Icon className="absolute mr-10" icon={icon} size={20} />
          </span>
        ) : (
          <span className="hidden"></span>
        )}
      </div>
    </>
  );
}

export default InputButton;
