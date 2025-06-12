import React,{useState,useEffect} from "react";
import { MapContainer,TileLayer,Marker,Popup } from "react-leaflet";
import"leaflet/dist/leaflet.css";
function WeatherApp(){
    
    //USE CASES
    const [location,setLocation] =useState("naivasha");
    const [weather,setWeather]=useState(null);
    const [currentTime,setCurrentTime] = useState(
        new Date().toLocaleTimeString([],{
            hour:"2-digit",
            minute:"2-digit",
            })
    );
    const [darkMode,setDarkMode] =useState(true);
    const[degreeUnit,setDegreeunit] = useState(true);
    const [isVisible,setIsVisible] =useState(true);
    const [futureWeather,setFutureWeather] = useState(null);

    //FUNCTIONS
    function handleDarkMode (){
        setDarkMode(prev =>!prev)
    }
    function handleDegreeUnit(){
        setDegreeunit(prev=>!prev);
    }
    function handleVisibility(){
        setIsVisible(prev=>!prev)
    }
    function handleLocation(event){
        setLocation(event.target.value);
    }
    const handleKeyDown=(e)=>{
        if(e.key ==="Enter"){
            handleSearch();
        }
    }
    const handleSearch= async()=>{
        const apiKey = "5610e85f44ac464e92c111204251005";
        const url=`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;
        if(!location) return;
        try{
            const res = await fetch(url);
            const data = await res.json();
            setWeather(data);
            
        }catch(err){
            console.log("error in fetching weather",err);
        }
    }
    const handleFuturePrediction =async ()=>{
        const apiKey = "5610e85f44ac464e92c111204251005";
        const url=`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=4`;
        if(!location)return;
        try{
            const res = await fetch(url);
            const data = await res.json();
            setFutureWeather(data);
            console.log(data);
        }catch(err){
            console.log("unable to predict",err);

        }
    }

    //USEEFFECT
    useEffect(()=>{
        handleSearch();
    },[location]);
    useEffect(()=>{
        if(!weather || !weather.location) return;
        const weatherTimezone = weather.location.tz_id;
        const interval = setInterval(() => {
            setCurrentTime(
                new Date().toLocaleTimeString([],{
                    timeZone:weatherTimezone,
                    hour:"2-digit",
                    minute:"2-digit",
                })
            );
        }, 60000);
        return ()=> clearInterval(interval);
    },[weather]);
    useEffect(()=>{
        if(!weather || !weather.location) return;
        handleFuturePrediction();
    },[weather]);
    
    //IN-STYLES
    const degreeStyles= {
        position:"absolute",
        fontSize:"2rem",
        top:"0.5em",
    };
    const mapStyles={
        position:"absolute",
        height:"25em",
        width:"40em",
        left:"80%",
        borderRadius:"30px",
        top:"15em",
        transform: "translateX(-50%)",
    };
    return(
        <div className={`weatherApp ${darkMode ? "dark": "light"}`}>
            <section className={`headerSection ${darkMode ? "dark" : "light"}`}>
                <input
                    className="searchLocation" 
                    type="search" 
                    placeholder="Enter Location"
                    value={location}
                    onKeyDown={handleKeyDown}
                    onChange={handleLocation}
                 />
                <img 
                    className="searchIcon" 
                    src="../src/assets/search.png" 
                    alt="search icon" 
                    onClick={handleSearch}
                />
                {weather&& weather.location && weather.current &&(
                    <div className="currentLocation">
                       <span className="locationName">{weather.location.name} </span>  
                        <span className="locationTemperature"> {weather.current.temp_c}&deg;</span>
                        <img className="topWeatherIcon" src={weather.current.condition.icon} alt="weather condition" />
                    </div>
                )}
                <div className="toggleTheme" onClick={handleDarkMode}>{darkMode?"Dark Mode" : "Light Mode"} </div>   
                <div className="unitConverter" onClick={handleVisibility}>
                    {degreeUnit?"°C" : "°F"}  {isVisible ? "▲" : "▼"}
                    <div 
                        className={`temperatureAdjust ${darkMode ? "dark" : "light"}`} 
                        style={{display:`${isVisible? "none" : "inline-block"}`}}
                        onClick={handleDegreeUnit}
                    >
                        <p><b>farenheight &deg;F</b></p>
                        <p><b>celcius &deg;C</b></p>
                    </div>
                </div>   
            </section>
            <main className="weatherDisplay">
                {weather && weather.location && weather.current &&(
                    <>
                        <h3 className="weather">Current Weather</h3>
                        <p className="currentTime">{currentTime}</p>
                        <img 
                            className="currentWeatherImage" 
                            src={weather.current.condition.icon} 
                            alt="cureent weather icon" 
                        />
                        <span className="currentTemperature">
                            {degreeUnit 
                                ? (
                                <>
                                    <span>{weather.current.temp_c}°</span>
                                    <span style={degreeStyles}>C</span>
                                </>
                                ) :(
                                    <>
                                        <span>{weather.current.temp_f}°</span>
                                        <span style={degreeStyles}>F</span>
                                    </>
                                ) 
                            }
                        </span>
                        <span className="weatherStatus">
                            {weather.current.condition.text}
                        </span>
                        <span className="estimatedWeather">
                             Feels like {weather.current.feelslike_c}&deg;C
                        </span>
                        <span className="weatherStatement">
                            {futureWeather && futureWeather.forecast && (
                                <p>
                                    The lowest will be{" "}
                                    {Math.round(
                                    Math.min(...futureWeather.forecast.forecastday.map(day => day.day.mintemp_c))
                                    )}
                                    °C.
                                </p>
                                )}

                        </span>
                    </>
                )}
                <div className="weatherCondition">
                    {weather && weather.location && weather.current && (
                        <>
                            <p>Wind <span className="wind">{weather.current.wind_kph}kph</span> </p>
                            <p>Humidity <span className="humidity">{weather.current.humidity}%</span></p>
                            <p>Visibility <span className="visibility">{weather.current.vis_km} Km</span></p>
                            <p>Pressure <span className="pressure">{weather.current.pressure_mb} mb</span></p>
                        </>
                    )}
                </div>
            </main>
            <MapContainer center={[-0.7167, 36.4333]} zoom={10} style={mapStyles}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                
            </MapContainer>

            <footer>
                {futureWeather && futureWeather.location && futureWeather.forecast && (
                    <>
                    {futureWeather.forecast.forecastday.map((day,index)=>(
                         <div className="futurePredictions" key={index}>
                            <span className="date">{new Date(day.date).getDate()}</span>
                            <span className="day">{new Date(day.date).toLocaleDateString("en-US",{weekday:"short"})}</span>
                            <span className="weatherPredictionIcon"><img src={day.day.condition.icon} alt={day.day.condition.text} /></span>
                            <span className="predictionTemperature">{degreeUnit?`${Math.round(day.day.avgtemp_c)}°`:`${Math.round(day.day.avgtemp_f)}°`}
                                </span>
                        </div>
                    ))}
                    </>
                )}
                
                
                
                
            </footer>
        </div>
    );
}
export default WeatherApp;