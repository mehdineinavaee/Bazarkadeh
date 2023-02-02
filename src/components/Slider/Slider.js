import React, { useState } from "react";
import { Range, getTrackBackground } from "react-range";
import classNames from "classnames";

import "./style.css";

const SliderTrack = ({ props, children, min, max, values }) => {
  const colors = ["#eee", "#60babe", "#eee"];
  const background = getTrackBackground({
    values,
    min,
    max,
    colors,
  });

  return (
    <div
      className="slider-track-container"
      onMouseDown={props.onMouseDown}
      onTouchStart={props.onTouchStart}
      style={{ ...props.style, background }}
    >
      <div className="slider-track" ref={props.ref}>
        {children}
      </div>
    </div>
  );
};

const SliderThumb = ({ props, isDragged, index }) => {
  return (
    <div className="slider-thumb-container" style={props.style} {...props}>
      <div
        className={classNames("slider-thumb", { "is-dragged": isDragged })}
      />
    </div>
  );
};

const DistanceSlider = ({ min, max, handlePrice }) => {
  const [values, setValues] = useState([min, max]);

  const handleChange = (values) => {
    handlePrice(values);
    setValues(values);
  };

  const renderTrack = (props) => {
    return <SliderTrack {...props} min={min} max={max} values={values} />;
  };
  const toman = `تومان`;
  const beyn = `بین`;
  const ta = `تا`;
  return (
    <>
      <Range
        allowOverlap
        values={values}
        step={1}
        min={min}
        max={max}
        onChange={handleChange}
        renderTrack={renderTrack}
        renderThumb={SliderThumb}
      />
      <div
        style={{
          position: "absolute",
          left: "0",
          top: "80%",
          fontSize: "13px",
        }}
      >
        ارزان ترین
      </div>
      <div
        style={{
          position: "absolute",
          right: "0",
          top: "80%",
          fontSize: "13px",
        }}
      >
        گران ترین
      </div>
      <output
        style={{
          position: "absolute",
          top: "200%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          textAlign: "right",
          direction: "rtl",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        {beyn}
        {"  "}
        {values[0].toLocaleString("fa-IR")} {ta}{" "}
        {values[1].toLocaleString("fa-IR")} {toman}
      </output>
    </>
  );
};

export default function Slider({ min, max, handlePrice }) {
  return <DistanceSlider min={min} max={max} handlePrice={handlePrice} />;
}
