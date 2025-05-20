import { Handler } from "leaflet";
import React,{useState,useEffect, useRef,} from "react";
import MyCharts from "./charts";
function FinanceTracker({isDark,onToggleTheme}){
    //USE STATES
    const [searchDisplayed,setSearchDisplayed] = useState(false);
    const [cartDisplayed,setCartDisplay] = useState(false);
    const [selectedMonth,setSelectedMonth] = useState("");
    //const [budget,setSum]=useState([{col1: "", col2: "", col3: ""},]);
    const [allRows,setAllRows] = useState({
            income:   [{col1: "", col2: "", col3: ""}],
            bills:    [{col1: "", col2: "", col3: ""}],
            expenses: [{col1: "", col2: "", col3: ""}],
            savings:  [{col1: "", col2: "", col3: ""}],
            //overflow: {col1: "", col2: "", col3: ""},
    });
    const [delayBudget,setBudgetDelay] = useState({
            incomeColumn2:0,
            billColumn2:0,
            expensesColumn2:0,
            savingsColumn2:0,
            incomeColumn3:0,
            billColumn3:0,
            expensesColumn3:0,
            savingsColumn3:0,
            
    });
    //const [isDark,setIsDark] = useState(false);
    
    //USE REF
    const searchRef = useRef(null);
    const cartRef = useRef(null);
    const monthSelect = useRef(null);
    
    //USE EFFECT
    useEffect(()=>{
        function hideDisplay(event){
            if(searchRef.current && !searchRef.current.contains(event.target)){
                setSearchDisplayed(false);
            }
            if(cartRef.current && !cartRef.current.contains(event.target)){
                setCartDisplay(false);
            }
        }
        document.addEventListener("mousedown",hideDisplay);
        return()=>{
            document.removeEventListener("mousedown",hideDisplay);
        };
    },[]);

    const getColumnSum = (tableName,colKey)=>{
        const rows = allRows[tableName] || [];
        return rows.reduce((acc,row)=>{
            const val = parseFloat(row[colKey]);
            return acc + (isNaN(val) ? 0 : val)
        },0);
    }
    const calculateBudgetTotals =()=>{
        setBudgetDelay({
            incomeColumn2 : getColumnSum("income","col2"),
            savingsColumn2 : getColumnSum("savings","col2"),
            billColumn2 : getColumnSum("bills","col2"),
            expensesColumn2 : getColumnSum("expenses","col2"),
            incomeColumn3 : getColumnSum("income","col3"),
            savingsColumn3 : getColumnSum("savings","col3"),
            billColumn3 : getColumnSum("bills","col3"),
            expensesColumn3 : getColumnSum("expenses","col3"),
        });
    };
    const incomeBudget = delayBudget.incomeColumn2;
    const incomeActual = delayBudget.incomeColumn3;
    const billsBudget = delayBudget.billColumn2;
    const billsActual = delayBudget.billColumn3;
    const savingsBudget = delayBudget.savingsColumn2;
    const savingsActual = delayBudget.savingsColumn3;
    const expensesBudget = delayBudget.expensesColumn2;
    const expensesActual = delayBudget.expensesColumn3;
    
    const grandBudgetTotal = incomeBudget + billsBudget + savingsBudget + expensesBudget;
    const grandActualTotal = incomeActual  + billsActual + savingsActual + expensesActual;

    const incomeLeft = incomeActual - billsActual - expensesActual - savingsActual;
    const incomeSpent = incomeActual - incomeLeft;

   // const [budgetDelay,setBudgetDelays] = useState(0);
    //const [actualDelay,setActualDelays] = useState(0);
    useEffect(()=>{
        const timeout =  setTimeout(() => {
        calculateBudgetTotals()
        }, 1000);
        return ()=>clearTimeout(timeout);
    },[allRows]);
    
    /*useEffect(()=>{
        const anyFieldFilled = Object.values(allRows).some(row=>Object.values(row).some(value=>value !==""&& value !== null &&value !== undefined));
        if(anyFieldFilled){
            const timeout = setTimeout(() => {
            calculateBudgetTotals();
            },2000 );
            return ()=>clearTimeout(timeout);
        }
    },[allRows.overflow])*/
    //FUNCTIONS
    function handleSearchDisplay(){
        setSearchDisplayed(p=>!p);
    }
    function handleCartDisplay(){
        setCartDisplay(p=>!p);
    }
    function handleMonthSelect(){
        setSelectedMonth(monthSelect.current.value);
    }
    
    /*  function handleOverflowRows(index,column,value){
        const newRows = [...overflowRows];
        newRows[index][column] = value;
        setOverflowRows(newRows);
        const isLastRow= index === overflowRows.length - 1;
        const isAnyFieldFIlled = Object.values(newRows[index]).some(val=>val!=="");
        if(isAnyFieldFIlled && isLastRow){
            setOverflowRows([...newRows,{col1:"",col2:"",col3:""}])
        }
    }
    */
    function handleRowChange(rowType,index,column, value){
        const newData = [...allRows[rowType]];
        newData[index][column] =value;
        const isLastRow = index === newData.length - 1;
        const isAnyFieldFilled = Object.values(newData[index]).some(val=>val !== "");
        if(isAnyFieldFilled && isLastRow){
            newData.push({col1:"",col2:"",col3:""});
        }
        setAllRows(
            prev=>({
                ...prev,
                [rowType]:newData,
            })
        )
    }
    
    //OTHER VARIABLES
    const months =[
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const inputStyles={
        outline:"none",
        border:"none",
    }
    return(
        <div className= {`body ${isDark ? "dark" : ""}`}> 
        <header >
            <h3 className="selectCurrencies">
                <select className="currencyOptionsContainer" name="currency" id="currency">
                    <option className="currencyOptions" value="myCurrencies">UNITED STATES (USD $)</option>
                    <option value="myCurrencies">AUSTRALIA (AUD $)</option>
                    <option value="myCurrencies">CANADA (CAD $)</option>
                    <option value="myCurrencies">GERMANY (EUR)</option>
                    <option value="myCurrencies">IRELAND(EUR)</option>
                </select>
            </h3>
            <h1 className="title">Money Map</h1>
            <button className={`toggleTheme`} onClick={onToggleTheme}>{isDark ? "dark" : "light"}</button>
            <img className="searchIcon" src="../src/assets/search.png" alt="search icon"onClick={handleSearchDisplay} />
            {searchDisplayed 
            &&(
            <div className={`searchContainer `} ref={searchRef}  >
                <img className="searchInputIcon" src="../src/assets/search.png" alt="search icon" />
                <input className="searchInput" type="search" placeholder="Search"  />
                <img className="cancelInputIcon" src="../src/assets/cancel.png" alt="" />
            </div>
            )}
            
            <img className="cart" src="../src/assets/shopping-cart (1).png" alt="shopping cart icon" onClick={handleCartDisplay} />
            {cartDisplayed &&(
                <div className={`cartDisplay `} ref={cartRef}>
                        <h1>CART</h1>
                        <img className="cancelCartIcon" src="../src/assets/cancel.png" alt="" onClick={()=>setCartDisplay(false)}/>
                        <h2>Your cart is currently empty</h2>
                        <button>Return to Shop</button>
                </div>
            )}
            
        </header>

        <hr />

        <section className="text">
            <h2 className={`slogan ${isDark && "dark"}`}>Keep your money on a short leash</h2>
            <p className={`sloganText ${isDark && "dark"}`}>Track every coin. Grow every goal</p>
        </section>
        
        <main>
            <nav>
                <h2 className="month">{selectedMonth}</h2>
                <p>Budgeted Income <span className="budgeted"><b>{grandBudgetTotal}</b></span></p>
                <p>Actual Income<span className="leftToBudget"><b>{grandActualTotal}</b></span></p>
                <p>Income spent<span className="incomeSpent"><b>{incomeSpent}</b></span></p>
                <progress className="myProgress" value="50" max="100"></progress>
                <p>Savings<span className="incomeSaved"><b>{savingsActual}</b></span></p>
                <p>income leftover <span className="incomeLeftover"><b>{incomeLeft}</b></span></p>
            </nav>
            <div className="myTables">
                <table className="overview" border={1}>
                <thead >
                    <tr>
                        <th colSpan={2} className="heading">OVERVIEW</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="subHeading">Choose a Month</td>
                        <td>
                            <select 
                                className="monthSelect" 
                                name="months" 
                                id="months" 
                                ref={monthSelect} 
                                onChange={handleMonthSelect}>
                                <option value="">Select a month</option>
                                {
                                    months.map((month,i)=>(
                                        <option value={month} key={i}>{month}</option>
                                    ))
                                }
                                
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td className="subHeading">Choose a Year</td>
                        <td>
                            <select className="chooseYear" name="years" id="years">
                                <option value="1">2025</option>
                                <option value="2">2024</option>
                                <option value="3">2023</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td className="subHeading">Start on Day</td>
                        <td><input className="startingDay" placeholder="Enter day"></input></td>
                    </tr>
                </tbody>
            </table>
            <table className="overflow" border={1}>
                <thead>
                    <tr>
                        <th colSpan={3}>CASH OVERFLOW SUMMARY</th>
                    </tr>
                    <tr>
                        <td>Name</td>
                        <td>Budget</td>
                        <td>Actual</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Income</td>
                        <td>{incomeBudget}</td>
                        <td>{incomeActual}</td>
                    </tr>
                    <tr>
                        <td>Bills</td>
                        <td>{billsBudget}</td>
                        <td>{billsActual}</td>
                    </tr>
                    <tr>
                        <td>Expenses</td>
                        <td>{expensesBudget}</td>
                        <td>{expensesActual}</td>
                    </tr>  
                    <tr>
                        <td>Savings</td>
                        <td>{savingsBudget}</td>
                        <td>{savingsActual}</td>
                    </tr>
                    <tr>
                        <td>Sum</td>
                        <td>{grandBudgetTotal}</td>
                        <td>{grandActualTotal}</td>
                    </tr>
                </tbody>
            </table>
            <table className="income" border={1}>
                <thead>
                    <tr>
                        <th colSpan={3}>INCOME</th>
                    </tr>
                    <tr>
                        <td>Description</td>
                        <td>Budget</td>
                        <td>Actual</td>
                    </tr>
                </thead>
                <tbody>
                    {allRows.income.map((incomeRow,index)=>(
                    <tr key={index}>
                        <td><input 
                                type="text" 
                                placeholder="Input source of income"
                                style={inputStyles}
                                value={incomeRow.col1}
                                onChange={(e)=>handleRowChange("income",index,"col1",e.target.value)} 
                            />
                        </td>
                        <td><input 
                                type="number"
                                placeholder="Enter budgeted"
                                style={inputStyles}
                                value={incomeRow.col2}
                                onChange={(e)=>handleRowChange("income",index,"col2",e.target.value)}
                                />
                        </td>
                        <td><input 
                                type="text"
                                placeholder="Enter actual"
                                style={inputStyles}
                                value={incomeRow.col3}
                                onChange={(e)=>handleRowChange("income",index,"col3",e.target.value)} 
                            />
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <table className="bills" border="1">
                <thead>
                    <tr>
                        <th colSpan={3}>BILLS</th>
                    </tr>
                    <tr>
                        <td>Description</td>
                        <td>Budget</td>
                        <td>Actual</td>
                    </tr>
                </thead>
                <tbody>
                    {allRows.bills.map((billRow,index)=>(
                    <tr key={index}>
                        <td>
                            <input 
                                type="text" 
                                placeholder="Input bills"
                                value={billRow.col1} 
                                style={inputStyles}
                                onChange={(e)=>handleRowChange("bills",index,"col1",e.target.value)}
                            />
                        </td>
                        <td>
                            <input 
                                type="number"
                                placeholder="Enter budgeted"
                                value={billRow.col2}
                                style={inputStyles}
                                onChange={(e)=>handleRowChange("bills",index,"col2",e.target.value)} 
                            />
                        </td>
                        <td>
                            <input 
                                type="number" 
                                placeholder="Enter actual"
                                value={billRow.col3}
                                style={inputStyles}
                                onChange={(e)=>handleRowChange("bills",index,"col3",e.target.value)} 
                            />
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <table className="expenses" border="1">
                <thead>
                    <tr>
                        <th colSpan={3}>EXPENSES</th>
                    </tr>
                    <tr>
                        <td>Description</td>
                        <td>Budget</td>
                        <td>Actual</td>
                    </tr>
                </thead>
                <tbody>
                    {allRows.expenses.map((expensesRow,index)=>(
                    <tr key={index}>
                        <td>
                            <input 
                                type="text" 
                                placeholder="Input expenses"
                                value={expensesRow.col1} 
                                style={inputStyles}
                                onChange={(e)=>handleRowChange("expenses",index,"col1",e.target.value)}
                            />
                        </td>
                        <td>
                            <input 
                                type="number"
                                placeholder="Enter budgeted"
                                value={expensesRow.col2}
                                style={inputStyles}
                                onChange={(e)=>handleRowChange("expenses",index,"col2",e.target.value)} 
                            />
                        </td>
                        <td>
                            <input 
                                type="number" 
                                placeholder="Enter actual"
                                value={expensesRow.col3}
                                style={inputStyles}
                                onChange={(e)=>handleRowChange("expenses",index,"col3",e.target.value)} 
                            />
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <table className="savings" border="1">
                <thead>
                    <tr>
                        <th colSpan={3}>SAVINGS</th>
                    </tr>
                    <tr>
                        <td>Description</td>
                        <td>Budget</td>
                        <td>Actual</td>
                    </tr>
                </thead>
                <tbody>
                    {allRows.savings.map((savingsRow,index)=>(
                    <tr key={index}>
                        <td>
                            <input 
                                type="text" 
                                placeholder="Input savings"
                                value={savingsRow.col1} 
                                style={inputStyles}
                                onChange={(e)=>handleRowChange("savings",index,"col1",e.target.value)}
                            />
                        </td>
                        <td>
                            <input 
                                type="number"
                                placeholder="Enter budgeted"
                                value={savingsRow.col2}
                                style={inputStyles}
                                onChange={(e)=>handleRowChange("savings",index,"col2",e.target.value)} 
                            />
                        </td>
                        <td>
                            <input 
                                type="number" 
                                placeholder="Enter actual"
                                value={savingsRow.col3}
                                style={inputStyles}
                                onChange={(e)=>handleRowChange("savings",index,"col3",e.target.value)} 
                            />
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <button className="saveButton" type="submit">Save</button>
            <MyCharts
                incomeActual={incomeActual}
                billsActual={billsActual}
                expensesActual={expensesActual}
                savingsActual={savingsActual}
                incomeBudget={incomeBudget}
                billsBudget={billsBudget}
                expensesBudget={expensesBudget}
                savingsBudget={savingsBudget}
                incomeSpent={incomeSpent}
            />
        </main>
        </div>
    );
}
export default FinanceTracker