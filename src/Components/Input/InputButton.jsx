import { React, useState } from "react";
import "./InputButton.css";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import TeleDropdown from "./TeleDropdown"

function InputButton({
  type,
  label,
  id,
  value,
  name,
  placeholder,
  error,
  disabled,
  onChange,
  text,
  required=false,
  fullWidth = false,
  multiple = false,
  hint
}) {
  const [inputType, setInputType] = useState(type);
  const [icon, setIcon] = useState(eyeOff);
  const [isFocused, setIsFocused] = useState(false);
  const [isValue, setIsValue] = useState(false);
  const [isTeleDropdownFocused, setIsTeleDropdownFocused] = useState(false);
  const [isTeleDropdownValue, setIsTeleDropdownValue] = useState(false);

  const handleToggle = () => {
    setInputType((prevType) => (prevType === "password" ? "text" : "password"));
    setIcon((prevIcon) => (prevIcon === eyeOff ? eye : eyeOff));
  };

  const widthStyle = {
    width: fullWidth ? '100%' : 'auto'
  }

  const checkboxStyle = {
    borderShadow : "none",
    left : "20px",
    top: "-4px"
  }

  const phoneStyle = {
    left : '72px',
  }

  const phoneInputStyle = {
    paddingLeft: '2px',
    borderLeft : 'none',
    borderRadius: '0px 5px 5px 0px'
  }

  const handleFocus = () => {
    setIsFocused(true);
    setIsTeleDropdownFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsTeleDropdownFocused(false);
  };


const onChangeT = (e) => {
  let isValueContained = e.target.value;
  if (isValueContained) {
    setIsValue(true);
    setIsTeleDropdownValue(true)
  } else {
    setIsValue(false);
    setIsTeleDropdownValue(false)
  }
  // You can also call the original onChange prop if needed
  onChange(e);
};



  return (
    <>
      {error && (type !== "password" && type !== "Confirm password") &&(
        <p className="flex text-red-800 text-sm font-normal mt-1 ml-3 px-2 justify-end mb-2">
          <span>{error}</span>
        </p>
      )}
      <div
        className={`inputbtn ${
          (((isFocused && isValue) || isFocused) && type !== "checkbox") || type === "file"
            ? "focused"
            : isValue
            ? "valuecontained"
            : ""
        } flex`}
        style={widthStyle}
      >
        <label htmlFor={id} style={type === "tel" ? phoneStyle : type === "checkbox" ? {...checkboxStyle} : {}}>
          {label}
        </label>
        {type === "tel" ? <TeleDropdown isFocused={isTeleDropdownFocused} isValue={isTeleDropdownValue} /> : ""}
        <input
          style={type === "tel" ? { ...phoneInputStyle, ...widthStyle } : widthStyle}
          type={inputType}
          id={id}
          name={name}
          value={value}
          text={text}
          required={required}
          multiple={multiple}
          placeholder={placeholder}
          error={error}
          disabled={disabled}
          onChange={onChangeT}
          onFocus={handleFocus}
          onBlur={handleBlur}
          labelprops={{
            className: "before:content-none after:content-none",
          }}
          containerprops={{
            className: "min-w-0",
          }}
        />
        {hint ? <span className="text-[#808080] ml-1">{hint}</span> : null}
        {type === "password" && label !== "Confirm password" ? (<span className="flex justify-around items-center" onClick={handleToggle}>
        <Icon className="block absolute mr-10" icon={icon} size={20} /> </span> ) : ( <span className="hidden"></span> )}
      </div>
      {error && (type === "password" || type === "Confirm password") ? (
        <p className="flex text-red-800 text-sm font-normal mt-1 ml-1 justify-end">
          <span>{error}</span>
        </p>
      ) : ""}
    </>
  );
}

export default InputButton;
