import React,{useState,useEffect, useRef,} from "react";
import MyCharts from "./charts";
import MyTables from "./tables";
import { db }  from "./firebase";
import Animation from "./animationTest";
import { collection, addDoc, getDocs,deleteDoc,doc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

function FinanceTracker({isDark,onToggleTheme,...props}){
    //USE STATES
    const [searchDisplayed,setSearchDisplayed] = useState(false);
    const [cartDisplayed,setCartDisplay] = useState(false);
    const [selectedMonth,setSelectedMonth] = useState("");
    const [allRows,setAllRows] = useState({
            income:   [{col1: "", col2: "", col3: ""}],
            bills:    [{col1: "", col2: "", col3: ""}],
            expenses: [{col1: "", col2: "", col3: ""}],
            savings:  [{col1: "", col2: "", col3: ""}],
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
    const [savedStatus,setStatusSaved] = useState("");    
    const [loadData,setLoadData] = useState("");
    const [allSavedData,setAllSavedData] = useState([]);
    //USE REF
    const searchRef = useRef(null);
    const cartRef = useRef(null);
    const monthSelect = useRef(null);
    const tableRef = useRef([]);
    
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

    useEffect(()=>{
        const timeout =  setTimeout(() => {
        calculateBudgetTotals()
        }, 1000);
        return ()=>clearTimeout(timeout);
    },[allRows]);
    useEffect(()=>{
        const observer = new window.IntersectionObserver((entries)=>{
            entries.forEach((entry)=>{
                if(entry.isIntersecting){
                    entry.target.classList.remove("fadeOut");
                }else{
                    entry.target.classList.add("fadeOut");
                }
            });
        },{
            root:document.querySelector(".cartTableContainer"),
            threshold:0.15,
        });
        tableRef.current.forEach((ref)=>{
            if(ref) observer.observe(ref);
        });
        return()=> observer.disconnect();
    },[allSavedData])
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
    const handleDetailSave = async ()=>{
        try{
            await addDoc(collection(db,"userinputs"),{
                allRows,
                grandActualTotal,
                grandBudgetTotal,
                incomeBudget,
                incomeActual,
                billsBudget,
                billsActual,
                savingsBudget,
                savingsActual,
                expensesBudget,
                expensesActual,
                selectedMonth,
                timestamp:serverTimestamp()
            });
            setStatusSaved("Data saved !");
            setTimeout(() => setStatusSaved(""),2000 );
        }
            catch (e){
                alert("error in saving data"+e.message);
                setTimeout(() => setStatusSaved(""),3000 );
            }
    }
    const fetchData =async ()=>{
        try{
            const querySnapshot = await getDocs(collection(db,"userinputs"));
            const data = [];
            querySnapshot.forEach((doc)=>{
                data.push({id:doc.id,...doc.data()});
            });
            setAllSavedData(data);
            if(data.length > 0){
                const latest = data
                    .filter(doc=> doc.timestamp)
                    .sort((a,b)=>{
                        const aTime = a.timestamp.toDate ? a.timestamp.toDate().getTime() : new Date(a.timestamp).getTime();
                        const bTime = b.timestamp.toDate ? b.timestamp.toDate().getTime() : new Date(b.timestamp).getTime();
                        return bTime - aTime;
                    })[0];
            setAllRows(latest.allRows)
            setSelectedMonth(latest.selectedMonth);
            setLoadData(latest)
            }
            return data;
        }
        catch(e){
            alert("error fetching data", + e.message);
        }
    }
    const handleDelete=()=>{
        setAllRows({
            income:   [{col1: "", col2: "", col3: ""}],
            bills:    [{col1: "", col2: "", col3: ""}],
            expenses: [{col1: "", col2: "", col3: ""}],
            savings:  [{col1: "", col2: "", col3: ""}],
        });
        setSelectedMonth("")
    };
    const deleteTable =async (id)=>{
        try{
            if(!id) return;
            await deleteDoc(doc(db,"userinputs",id));
            setAllSavedData(prev => prev.filter(entry => entry.id !==id));
        }
        catch(e){
            alert("error deleting data" + e.message);
        }
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
            <h1 className="title">  Money Map</h1>
            <div className="menu">
                <h2>Menu</h2>
                <img className="searchIconSmall" src="../src/assets/search.png" alt="search icon"onClick={handleSearchDisplay} />
                <img className="cartSmall" src="../src/assets/shopping.png" alt="shopping cart icon" onClick={handleCartDisplay} />
                <button className={`toggleThemeSmall`} onClick={onToggleTheme}>{isDark ? "Dark" : "Light"}</button>
            </div>
            <button 
                
                className={`toggleTheme`} 
                onClick={onToggleTheme}>
                
                {isDark ? "Dark Mode" : "Light Mode"}
                
            </button>
            <img className="searchIcon" src="../src/assets/search.png" alt="search icon"onClick={handleSearchDisplay} />
            {searchDisplayed 
            &&(
            <div className={`searchContainer `} ref={searchRef}  >
                <img className="searchInputIcon" src="../src/assets/search.png" alt="search icon" />
                <input className="searchInput" type="search" placeholder="Search"  />
                <img className="cancelInputIcon" src="../src/assets/cancel.png" alt="" />
            </div>
            )}
            
            <img className="cart" src="../src/assets/shopping.png" alt="shopping cart icon" onClick={handleCartDisplay} />
            {cartDisplayed &&(
                <div className={`cartDisplay `} ref={cartRef}>
                    <div className="cartIconContainer">
                        <h1>History</h1>
                        <img className="cancelCartIcon" src="../src/assets/cross2.png" alt="" onClick={()=>setCartDisplay(false)}/>
                        <button onClick={fetchData}>Load Data</button>
                    </div>
                        {/*allSavedData.length === 0 ? (<h2>Your cart is empty</h2>):(<h2></h2>)*/}
                        {allSavedData.length > 0 &&(
                            <div className="cartTableContainer">
                                {allSavedData.map((entry,index)=>(
                                    <table key={entry.id} 
                                        className="summary" 
                                        ref={el => (tableRef.current[index] = el)} >
                                        <thead>
                                            <tr>
                                                <th colSpan={3}>{entry.selectedMonth}  Summary {new Date().getFullYear()}</th>
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
                                                <td>{entry.incomeBudget}</td>
                                                <td>{entry.incomeActual}</td>
                                            </tr>
                                            <tr>
                                                <td>Bills</td>
                                                <td>{entry.billsBudget}</td>
                                                <td>{entry.billsActual}</td>
                                            </tr>
                                            <tr>
                                                <td>Expenses</td>
                                                <td>{entry.expensesBudget}</td>
                                                <td>{entry.expensesActual}</td>
                                            </tr>
                                            <tr>
                                                <td>Savings</td>
                                                <td>{entry.savingsBudget}</td>
                                                <td>{entry.savingsActual}</td>
                                            </tr>
                                            <tr>
                                                <td>Sum</td>
                                                <td>{entry.grandBudgetTotal}</td>
                                                <td>{entry.grandActualTotal}</td>
                                            </tr>
                                            <tr>
                                                <td>Time saved:</td>
                                                <td>{entry.timestamp && entry.timestamp.toDate
                                                    ? entry.timestamp.toDate().toLocaleString()
                                                    : new Date(entry.timestamp).toLocaleString()}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3}>
                                                    <button className="deleteTableButton" onClick={()=>deleteTable(entry.id)}>Delete</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ))}
                            </div>
                        )}
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
                <p>Income Spent<span className="incomeSpent"><b>{incomeSpent}</b></span></p>
                <progress className="myProgress" value="50" max="100"></progress>
                <p>Savings<span className="incomeSaved"><b>{savingsActual}</b></span></p>
                <p>Income Leftover <span className="incomeLeftover"><b>{incomeLeft}</b></span></p>
            </nav>
            <MyTables
                monthSelect={monthSelect}
                handleMonthSelect={handleMonthSelect}
                months={months}
                selectedMonth={selectedMonth}
                allRows={allRows}
                inputStyles={inputStyles}
                handleRowChange={handleRowChange}
                incomeBudget={incomeBudget}
                incomeActual={incomeActual}
                billsBudget={billsBudget}
                billsActual={billsActual}
                expensesBudget={expensesBudget}
                expensesActual={expensesActual}
                savingsBudget={savingsBudget}
                savingsActual={savingsActual}
                grandBudgetTotal={grandBudgetTotal}
                grandActualTotal={grandActualTotal}
                incomeLeft={incomeLeft}
                incomeSpent={incomeSpent}
                savingsActualNav={savingsActual}
            />
            <button className="saveButton" type="button" onClick={handleDetailSave}>Save</button>
            <button className="deleteButton" onClick={handleDelete} type="button">Delete</button>
            {savedStatus && 
                <div className="savedStatus">
                    <h2>Storage Message</h2>
                    <p>{savedStatus}</p>
                </div>}
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
                isDark={isDark}
            />

        </main>
        <Animation />

        </div>
    );
}
export default FinanceTracker