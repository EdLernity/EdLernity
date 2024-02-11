import React from "react";
import { useCountries } from "use-react-countries";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import "./InputButton.css";
 

function TeleDropdown({ isFocused,isValue }) {
  const { countries } = useCountries();
  const [country, setCountry] = React.useState(221);
  const { name, flags, countryCallingCode } = countries[country];
 
  return (
    <div className={`telDropDown relative flex max-w-[24rem] ${
      (isFocused && isValue) || isFocused
        ? "focused"
        : isValue
        ? "valuecontained"
        : ""
    }`}>
      <Menu placement="bottom-start">
        <MenuHandler>
          <Button
            ripple={false}
            variant="text"
            color="blue-gray"
            className="flex items-center gap-2 rounded-r-none pl-3 focus:border-[#1539cf]"
          >
            <img
              src={flags.svg}
              alt={name}
              className="h-4 w-4 rounded-full object-cover"
            />
            {countryCallingCode}
          </Button>
        </MenuHandler>
        <MenuList className="max-h-[20rem] max-w-[18rem]">
          {countries.map(({ name, flags, countryCallingCode }, index) => {
            return (
              <MenuItem
                key={name}
                value={name}
                className="flex items-center gap-2"
                onClick={() => setCountry(index)}
              >
                <img
                  src={flags.svg}
                  alt={name}
                  className="h-5 w-5 rounded-full object-cover"
                />
                {name} <span className="ml-auto">{countryCallingCode}</span>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </div>
  );
}

export default TeleDropdown;