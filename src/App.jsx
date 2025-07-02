//import MyComponent from"./Learn.jsx"
import FinanceTracker from "./FinanceTracker";
import Animation from "./animationTest";
import React,{useState} from "react";
function App() {
  const [isDark,setIsDark] = useState(false);
  function handleDarkMode(){
    setIsDark(prev=>!prev);
  }
  return(
    <>
      <FinanceTracker isDark = {isDark} onToggleTheme = {handleDarkMode}/>
    </>
  );
  
} 

export default App
