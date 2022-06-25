import React    from 'react'
import './App.css'
import {getMap} from "./getMap"

function App() {
    return (
        <div className="App" onLoad={() => getMap()}>
            <div id="myMap" style={{
                position: "relative",
                width: "100%",
                minWidth: "290px",
                height: "600px"
            }}></div>

            <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: '#fff',
                padding: '10px',
                borderRadius: '5px'
            }}>
                Match closest by: <br /><br />
                <input type="button" value="Straight line distances" onClick={() => getMap()} /><br />
            </div>

            <fieldset style={{width: 'calc(100% - 30px)', minWidth: '290px', marginTop: '10px'}}>
                <legend>Calculate nearest locations</legend>
                This sample shows how to do a spatial join between two sets of points based on the shortest stright line
                distance or travel time along roads using the route matrix service.
                In this case, the origins are fire stations, and the destinations are schools (blue dots). This analysis
                shows
                us which fire station is closest to which school.
                A straight line distance is a fast and simple calculation, however, in many cases travel time is more
                important
                than a straight line distance.
                With the Azure Maps route matrix service, additional route options can be specified, such as the travel
                mode,
                future travel times, vehicle dimensions, and much more.
            </fieldset>
        </div>
    )
}

export default App
