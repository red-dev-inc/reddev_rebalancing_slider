import React from 'react';
import CustomSlider from '../CustomSlider';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import { useState, useEffect, useRef } from "react";
import './ReddevSlider.css';

const theme = createTheme({
    status: {
        danger: '#e53e3e',
    },
    palette: {
        red: {
            main: '#F46534',
            darker: '#053e85',
        },
    },
});

function ReddevSlider(props) {
    const sliders = props.sliders;
    //state to manage all sliders
    const [sliderValue, setSliderValue] = useState(0);

    //state to share slider value across all sliders
    const [slider, setSlider] = useState(props.slider);
    //state to track which slider is moved
    const [sliderNumber, setSliderNumber] = useState(0);
    //state for the above sliders
    const [pointer, setPointer] = useState(1)
        //Manage only on updates to avoid intial load update
    const isInitialMount = useRef(true);

    let minimumTotal = sliders.reduce(function(a, b) { return a + b.min; }, 0)
    const totalValue = 100
    const handleChange = (sliderNumber, e) => {
        setSliderNumber(sliderNumber);
        if (e.target.value < (totalValue - (minimumTotal - sliders[sliderNumber].min)) && e.target.value > sliders[sliderNumber].min) {
            setSliderValue(e.target.value);
        } else if (e.target.value >= (totalValue - (minimumTotal - sliders[sliderNumber].min))) {
            let v = totalValue - (minimumTotal - sliders[sliderNumber].min)
            setSliderValue(v)
        } else if (e.target.value <= sliders[sliderNumber].min) {
            setSliderValue(sliders[sliderNumber].min)
        }
    }

    const handleChangeCommited = () => {
        let finalSlider = slider.map(item => Math.round(item));
        let total = finalSlider.reduce((a, b) => a + b, 0);

        if (total > 100) {
            let extra = total - 100
            for (let i = finalSlider.length - 1; i >= 0; i--) {
                if (i !== sliderNumber) {
                    if (finalSlider[i] > sliders[i].min) {
                        if ((finalSlider[i] - extra) < sliders[i].min) {
                            let remain = finalSlider[i] - sliders[i].min
                            if (remain <= extra) {
                                finalSlider[i] -= remain
                                extra -= remain
                            }
                        } else {
                            finalSlider[i] -= extra
                            break
                        }

                    }
                } else {
                    continue
                }
            }

        }
        setSlider(finalSlider)
    }

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {

            //previous value of selected slider
            let prevValue = slider[sliderNumber]
            let prevSlider = slider
            let newSlider = [...prevSlider]
            newSlider[sliderNumber] = sliderValue

            //Set p to pointer
            let p = pointer

            let difference = Math.abs(prevValue - sliderValue)
            let belowCurrentTotal = Math.round(slider.slice(Number(sliderNumber + 1), (slider.length)).reduce((a, b) => a + b, 0))
            let belowMinimumTotal = Math.round(sliders.slice(Number(sliderNumber + 1), (sliders.length)).reduce((a, b) => a + b.min, 0))

            if (belowCurrentTotal < belowMinimumTotal) {
                belowCurrentTotal = belowMinimumTotal
            }

            //Decrease
            if (sliderValue < prevValue) {
                if (sliderNumber !== slider.length - 1) {
                    if (sliderNumber > 0) {
                        for (let i = 0; i < sliderNumber; i++) {
                            newSlider[i] = slider[i]
                        }
                    }

                    for (let i = sliderNumber + 1; i < slider.length; i++) {
                        if (belowCurrentTotal === 0) {
                            belowCurrentTotal = 1
                        }
                        if (slider[i] === 0) {
                            newSlider[i] = 1
                        }
                        newSlider[i] = newSlider[i] + ((prevSlider[i] / belowCurrentTotal) * difference);

                    }
                } else {
                    //If just the above slider is not reached its minimum value then set pointer to 1
                    if (sliderNumber > 0 && newSlider[sliderNumber - 1] !== sliders[sliderNumber - 1].min) {
                        p = 1
                    }
                    if ((sliderNumber - p) >= 0) {
                        newSlider[sliderNumber - p] = slider[sliderNumber - p] + difference
                        for (let i = 0; i < (sliderNumber - p); i++) {
                            newSlider[i] = slider[i]
                        }

                        for (let i = sliderNumber + p; i < slider.length; i++) {
                            newSlider[i] = slider[i]
                        }
                    }

                    if ((sliderNumber - p) >= 0 && newSlider[sliderNumber - p] < sliders[sliderNumber - p].min) {
                        newSlider[sliderNumber - p] = sliders[sliderNumber - p].min
                    }

                    if ((sliderNumber - p) > 0 && newSlider[sliderNumber - p] === sliders[sliderNumber - p].min) {
                        p = p + 1
                    }
                }

            } else {

                //Below sliders move until value reaches to min
                if (belowCurrentTotal > belowMinimumTotal) {
                    if (sliderNumber > 0) {
                        for (let i = 0; i < sliderNumber; i++) {
                            newSlider[i] = slider[i]
                        }
                    }

                    for (let i = sliderNumber + 1; i < slider.length; i++) {
                        newSlider[i] = newSlider[i] - ((prevSlider[i] / belowCurrentTotal) * difference);
                        if (newSlider[i] <= sliders[i].min) {
                            newSlider[i] = sliders[i].min
                        }
                    }
                }

                //Above sliders start moving
                if (belowCurrentTotal === belowMinimumTotal && sliderNumber !== 0) {
                    if (sliderNumber > 0 && newSlider[sliderNumber - 1] !== sliders[sliderNumber - 1].min) {
                        p = 1
                    }
                    if ((sliderNumber - p) >= 0) {
                        newSlider[sliderNumber - p] = slider[sliderNumber - p] - difference
                        for (let i = 0; i < (sliderNumber - p); i++) {
                            newSlider[i] = slider[i]
                        }

                        for (let i = sliderNumber + p; i < slider.length; i++) {
                            newSlider[i] = slider[i]
                        }
                    }

                    if ((sliderNumber - p) >= 0 && newSlider[sliderNumber - p] < sliders[sliderNumber - p].min) {
                        newSlider[sliderNumber - p] = sliders[sliderNumber - p].min
                    }

                    if ((sliderNumber - p) > 0 && newSlider[sliderNumber - p] === sliders[sliderNumber - p].min) {
                        p = p + 1
                    }
                }
            }
            setSlider(newSlider);
            setPointer(p)
        }
    }, [sliderValue, sliderNumber])

    return (

        <
        div className = "cont" >
        <
        div className = "sliders" >
        <
        ThemeProvider theme = { theme } > {
            (() => {
                return sliders.map((eachSlider, index) => {
                    return ( <
                        CustomSlider key = { index }
                        color = { eachSlider.color }
                        value = { slider[index] === undefined ? 0 : slider[index] }
                        defaultValue = { eachSlider.defaultValue }
                        handleChange = { handleChange.bind(this, index) }
                        handleChangeCommited = { handleChangeCommited.bind() }
                        />
                    )
                })
            })()
        } <
        /ThemeProvider>  < /
        div > <
        /div> 

    );
};

export default ReddevSlider;