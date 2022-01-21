# REDDEV REBALANCING SLIDERS SPECIFICATION

Rebalancing Slider is an ordered group of (n) Slider controls where n >= 1.

Each Slider has 0 or more Sliders above it and 0 or more Sliders below it, according to its order in the Rebalancing Slider.

Each Slider will always have an integer value between 0 and 100

Invariant: At all times, the total value of all the Sliders in a Rebalancing Slider is 100

When the user adjusts the value of a Slider, the values of the other Sliders in the Rebalancing Slider are adjusted according the the following business rules.

Changes are always made to the Sliders below first (i+1, i+2, ... up to n), and then when no more changes are possible, changes are then made to the Sliders above (i-1, i-2, ... down to 1).

## SLIDERS BELOW

If the user decreases Slider(i), each Slider below is increased proportionally to its current value as related to the values of the other Sliders below. If the user increases the Slider, the Sliders below are decreased.

    Example: If the Slider is increased by 10, and two sliders below, Slider(i+1) and Slider(i+2) have values of 5 and 10, they are reduced as follows. Slider(i+1) will be reduced by 5/15 = 1/3. 1/3 * 10 = 10/3, or rounded to the nearest integer, 3, so it will have a new value of 5 - 3 = 2. Slider(i+2) will be reduced by 10/15 = 2/3. 2/3 * 10 = 20/3, or rounded, 7, so it will have a new value of 10 - 7 = 3.

The bottom-most slider, Slider(n), can be computed using the invariant that all sliders must sum to 100, thus taking care of any integer rounding off-by-one errors.

Once a Slider below reaches 0 (in the case of the user increasing the Slider) or 100 (in the case of the user decreasing the slider), it is no longer included in the reduction or increase calculation.

Once all Sliders below reach their extreme, only then do then the Sliders above move.

Note that if the user reverses direction as they move Slider(i), the values of all Sliders remain, but the algo starts again with the Sliders below affected first.

## SLIDERS ABOVE

Once the Sliders below have reached their extreme, then the Sliders are above adjust.

If the Slider that the user is moving is Slider(i, then Slider(i-1) is adjusted first until it reaches its exteme. Only then Slider(i-2) is adjusted, and this continues until Slider(1).

Note again that if the user reverses direction as they move the slider, the algo starts again with the Sliders below affected first, but the changes thus far to the Sliders above remain.

## INSTALLATION & USAGE

Install with npm

        npm i reddev-rebalancing-slider

Add the following lines to your App.js:

```javascript
import './App.css';
import {ReddevSlider} from 'reddev-rebalancing-slider'
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
```
