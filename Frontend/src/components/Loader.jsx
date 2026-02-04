import React from "react";
import { Cardio } from "ldrs/react";
import "ldrs/react/Cardio.css";

const Loader = ({
  size = "40",
  className = "loaderWrapper",
  color = "var(--primary)",
  speed = "1.75",
  stroke = "5",
  height = "100%",
  width = "100%",
  style = {},
}) => {
  return (
    <div className={className} style={{ height, width, ...style }}>
      <Cardio size={size} speed={speed} stroke={stroke} color={color} />
    </div>
  );
};

export default Loader;
