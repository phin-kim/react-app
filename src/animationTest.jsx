import { easeInOut, motion,MotionConfig,useInView,useScroll, useSpring, useTransform } from "framer-motion";
import { useState,useRef,useEffect } from "react";
function Animation (){
    const divStyle={
        display:"grid",
        placeContent:"center",
        marginTop:"10em",
    }
    const inputStyles={
        outline:"none",
        border:"none",
    }
    const initial = {
        x:"-300px",
        opacity:0,
    }
    const animate = {
        x:"0px",
        opacity:1
    }
    const  transform={
        duration:2,
        ease:"backInOut"
    }
    const{opacity} = initial;
    const initial2 ={
        x:"300px",
        opacity,
        
    }
    const animate2 ={
        x:"0px",
        opacity:1
    }
    const tap = {
        rotate:"-40deg"
    }
    return(
        <div style={divStyle}>
            <MotionConfig transition={transform}>
                <motion.table 
                    className="income" border={1}
                    initial={initial}
                    animate={animate}
                >
                    <thead>
                        <tr>
                            <th colSpan={3}>INCOME</th>
                        </tr>
                        <tr>
                            <td>Name</td>
                            <td>Budget</td>
                            <td>Actual</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr >
                            <td><input 
                                    style={inputStyles}
                                />
                            </td>
                            <td><input 
                                    style={inputStyles}
                                    />
                            </td>
                            <td><input 
                                    style={inputStyles}
                                />
                            </td>
                        </tr>
                    </tbody>
                </motion.table>
                <motion.table 
                    className="income" border={1}
                    initial={ initial2 }
                    animate={animate2}
                >
                    <thead>
                        <tr>
                            <th colSpan={3}>INCOME</th>
                        </tr>
                        <tr>
                            <td>Name</td>
                            <td>Budget</td>
                            <td>Actual</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr >
                            <td><input 
                                    style={inputStyles}
                                />
                            </td>
                            <td><input 
                                    style={inputStyles}
                                    />
                            </td>
                            <td><input 
                                    style={inputStyles}
                                />
                            </td>
                        </tr>
                    </tbody>
                </motion.table>
            </MotionConfig>
            <motion.button whileTap={tap}>click me</motion.button>
            
        </div>
    );
}
export default Animation