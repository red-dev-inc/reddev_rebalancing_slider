import React from 'react';
// import './App.css';
import {ReddevSlider} from './dist';

import {useState} from "react";




//configure slider

const sliders = [{
    name: "NGO",
    color: "primary",
    defaultValue: 40,
    min: 10
}, {
    name: "Artist",
    color: "secondary",
    defaultValue: 30,
    min: 2
}, {
    name: "SiteOwner",
    color: "primary",
    defaultValue: 20,
    min: 1
}, {
    name: "Seller",
    color: "secondary",
    defaultValue: 10,
    min: 2
}, ]

function App() {
    
    //state to share slider value across all sliders
    const [slider, setSlider] = useState(sliders.map(a => a.defaultValue));
    
    return ( 
        <div className = "App" >
            <ReddevSlider sliders= {sliders} slider={slider} />
                                
        </div>
    );
}

export default App;
