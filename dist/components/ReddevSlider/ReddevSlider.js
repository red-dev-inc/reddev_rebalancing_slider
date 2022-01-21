"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.reduce.js");

var _react = _interopRequireWildcard(require("react"));

var _CustomSlider = _interopRequireDefault(require("../CustomSlider"));

var _styles = require("@mui/material/styles");

var _react2 = require("@emotion/react");

require("./ReddevSlider.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const theme = (0, _styles.createTheme)({
  status: {
    danger: '#e53e3e'
  },
  palette: {
    red: {
      main: '#F46534',
      darker: '#053e85'
    }
  }
});

function ReddevSlider(props) {
  const sliders = props.sliders; //state to manage all sliders

  const [sliderValue, setSliderValue] = (0, _react.useState)(0); //state to share slider value across all sliders

  const [slider, setSlider] = (0, _react.useState)(props.slider); //state to track which slider is moved

  const [sliderNumber, setSliderNumber] = (0, _react.useState)(0); //state for the above sliders

  const [pointer, setPointer] = (0, _react.useState)(1); //Manage only on updates to avoid intial load update

  const isInitialMount = (0, _react.useRef)(true);
  let minimumTotal = sliders.reduce(function (a, b) {
    return a + b.min;
  }, 0);
  const totalValue = 100;

  const handleChange = (sliderNumber, e) => {
    setSliderNumber(sliderNumber);

    if (e.target.value < totalValue - (minimumTotal - sliders[sliderNumber].min) && e.target.value > sliders[sliderNumber].min) {
      setSliderValue(e.target.value);
    } else if (e.target.value >= totalValue - (minimumTotal - sliders[sliderNumber].min)) {
      let v = totalValue - (minimumTotal - sliders[sliderNumber].min);
      setSliderValue(v);
    } else if (e.target.value <= sliders[sliderNumber].min) {
      setSliderValue(sliders[sliderNumber].min);
    }
  };

  const handleChangeCommited = () => {
    let finalSlider = slider.map(item => Math.round(item));
    let total = finalSlider.reduce((a, b) => a + b, 0);

    if (total > 100) {
      let extra = total - 100;

      for (let i = finalSlider.length - 1; i >= 0; i--) {
        if (i !== sliderNumber) {
          if (finalSlider[i] > sliders[i].min) {
            if (finalSlider[i] - extra < sliders[i].min) {
              let remain = finalSlider[i] - sliders[i].min;

              if (remain <= extra) {
                finalSlider[i] -= remain;
                extra -= remain;
              }
            } else {
              finalSlider[i] -= extra;
              break;
            }
          }
        } else {
          continue;
        }
      }
    }

    setSlider(finalSlider);
  };

  (0, _react.useEffect)(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      //previous value of selected slider
      let prevValue = slider[sliderNumber];
      let prevSlider = slider;
      let newSlider = [...prevSlider];
      newSlider[sliderNumber] = sliderValue; //Set p to pointer

      let p = pointer;
      let difference = Math.abs(prevValue - sliderValue);
      let belowCurrentTotal = Math.round(slider.slice(Number(sliderNumber + 1), slider.length).reduce((a, b) => a + b, 0));
      let belowMinimumTotal = Math.round(sliders.slice(Number(sliderNumber + 1), sliders.length).reduce((a, b) => a + b.min, 0));

      if (belowCurrentTotal < belowMinimumTotal) {
        belowCurrentTotal = belowMinimumTotal;
      } //Decrease


      if (sliderValue < prevValue) {
        if (sliderNumber !== slider.length - 1) {
          if (sliderNumber > 0) {
            for (let i = 0; i < sliderNumber; i++) {
              newSlider[i] = slider[i];
            }
          }

          for (let i = sliderNumber + 1; i < slider.length; i++) {
            if (belowCurrentTotal === 0) {
              belowCurrentTotal = 1;
            }

            if (slider[i] === 0) {
              newSlider[i] = 1;
            }

            newSlider[i] = newSlider[i] + prevSlider[i] / belowCurrentTotal * difference;
          }
        } else {
          //If just the above slider is not reached its minimum value then set pointer to 1
          if (sliderNumber > 0 && newSlider[sliderNumber - 1] !== sliders[sliderNumber - 1].min) {
            p = 1;
          }

          if (sliderNumber - p >= 0) {
            newSlider[sliderNumber - p] = slider[sliderNumber - p] + difference;

            for (let i = 0; i < sliderNumber - p; i++) {
              newSlider[i] = slider[i];
            }

            for (let i = sliderNumber + p; i < slider.length; i++) {
              newSlider[i] = slider[i];
            }
          }

          if (sliderNumber - p >= 0 && newSlider[sliderNumber - p] < sliders[sliderNumber - p].min) {
            newSlider[sliderNumber - p] = sliders[sliderNumber - p].min;
          }

          if (sliderNumber - p > 0 && newSlider[sliderNumber - p] === sliders[sliderNumber - p].min) {
            p = p + 1;
          }
        }
      } else {
        //Below sliders move until value reaches to min
        if (belowCurrentTotal > belowMinimumTotal) {
          if (sliderNumber > 0) {
            for (let i = 0; i < sliderNumber; i++) {
              newSlider[i] = slider[i];
            }
          }

          for (let i = sliderNumber + 1; i < slider.length; i++) {
            newSlider[i] = newSlider[i] - prevSlider[i] / belowCurrentTotal * difference;

            if (newSlider[i] <= sliders[i].min) {
              newSlider[i] = sliders[i].min;
            }
          }
        } //Above sliders start moving


        if (belowCurrentTotal === belowMinimumTotal && sliderNumber !== 0) {
          if (sliderNumber > 0 && newSlider[sliderNumber - 1] !== sliders[sliderNumber - 1].min) {
            p = 1;
          }

          if (sliderNumber - p >= 0) {
            newSlider[sliderNumber - p] = slider[sliderNumber - p] - difference;

            for (let i = 0; i < sliderNumber - p; i++) {
              newSlider[i] = slider[i];
            }

            for (let i = sliderNumber + p; i < slider.length; i++) {
              newSlider[i] = slider[i];
            }
          }

          if (sliderNumber - p >= 0 && newSlider[sliderNumber - p] < sliders[sliderNumber - p].min) {
            newSlider[sliderNumber - p] = sliders[sliderNumber - p].min;
          }

          if (sliderNumber - p > 0 && newSlider[sliderNumber - p] === sliders[sliderNumber - p].min) {
            p = p + 1;
          }
        }
      }

      setSlider(newSlider);
      setPointer(p);
    }
  }, [sliderValue, sliderNumber]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "cont"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "sliders"
  }, /*#__PURE__*/_react.default.createElement(_react2.ThemeProvider, {
    theme: theme
  }, " ", (() => {
    return sliders.map((eachSlider, index) => {
      return /*#__PURE__*/_react.default.createElement(_CustomSlider.default, {
        key: index,
        color: eachSlider.color,
        value: slider[index] === undefined ? 0 : slider[index],
        defaultValue: eachSlider.defaultValue,
        handleChange: handleChange.bind(this, index),
        handleChangeCommited: handleChangeCommited.bind()
      });
    });
  })(), " "), "  "), " ");
}

;
var _default = ReddevSlider;
exports.default = _default;