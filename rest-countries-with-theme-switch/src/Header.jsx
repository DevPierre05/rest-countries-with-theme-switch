import { IoMoonOutline, IoMoon } from "react-icons/io5";

const Header = function (props) {
  return (
    <div className="flex justify-between items-center py-5 ">
      <h1 className="font-extrabold text-lg dark:text-white">
        Where in the World?
      </h1>
      <div className="flex items-center gap-2">
        {props.theme ? (
          <IoMoon onClick={props.handleSwitch} className="w-5 text-white" />
        ) : (
          <IoMoonOutline onClick={props.handleSwitch} className="w-5" />
        )}
        <p className="text-md font-bold dark:text-[#fafafa">
          {props.theme ? "Light" : "Dark"} Mode
        </p>
      </div>
    </div>
  );
};

export default Header;
