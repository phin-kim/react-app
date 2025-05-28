function MyTables({
    monthSelect,
    handleMonthSelect,
    months,
    selectedMonth,
    allRows,
    inputStyles,
    handleRowChange,
    incomeBudget,
    incomeActual,
    billsBudget,
    billsActual,
    expensesBudget,
    expensesActual,
    savingsBudget,
    savingsActual,
    grandBudgetTotal,
    grandActualTotal,
    incomeLeft,
    incomeSpent,
    savingsActual: savingsActualNav,
}){
    return(
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
                                value={selectedMonth}
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
                    {/*<tr>
                        <td className="subHeading">Start on Day</td>
                        <td><input className="startingDay" name="startingDay" placeholder="Enter day"></input></td>
                    </tr>*/}
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
                                placeholder="Income"
                                style={inputStyles}
                                name="incomeSource"
                                value={incomeRow.col1}
                                onChange={(e)=>handleRowChange("income",index,"col1",e.target.value)} 
                            />
                        </td>
                        <td><input 
                                type="number"
                                placeholder="Budgeted"
                                style={inputStyles}
                                name="incomeBudget"
                                value={incomeRow.col2}
                                onChange={(e)=>handleRowChange("income",index,"col2",e.target.value)}
                                />
                        </td>
                        <td><input 
                                type="text"
                                placeholder="Actual"
                                style={inputStyles}
                                name="incomeActual"
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
                                placeholder="Bills"
                                value={billRow.col1} 
                                name="billsSource"
                                style={inputStyles}
                                onChange={(e)=>handleRowChange("bills",index,"col1",e.target.value)}
                            />
                        </td>
                        <td>
                            <input 
                                type="number"
                                placeholder=" Budgeted"
                                value={billRow.col2}
                                name="billBudget"
                                style={inputStyles}
                                onChange={(e)=>handleRowChange("bills",index,"col2",e.target.value)} 
                            />
                        </td>
                        <td>
                            <input 
                                type="number" 
                                placeholder=" Actual"
                                value={billRow.col3}
                                name="billActual"
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
                                placeholder="Expenses"
                                value={expensesRow.col1} 
                                style={inputStyles}
                                name="expensesSource"
                                onChange={(e)=>handleRowChange("expenses",index,"col1",e.target.value)}
                            />
                        </td>
                        <td>
                            <input 
                                type="number"
                                placeholder="Budgeted"
                                value={expensesRow.col2}
                                style={inputStyles}
                                name="expenseBudget"
                                onChange={(e)=>handleRowChange("expenses",index,"col2",e.target.value)} 
                            />
                        </td>
                        <td>
                            <input 
                                type="number" 
                                placeholder="Actual"
                                value={expensesRow.col3}
                                style={inputStyles}
                                name="expenseActual"
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
                                placeholder="Savings"
                                value={savingsRow.col1} 
                                name="savingSource"
                                style={inputStyles}
                                onChange={(e)=>handleRowChange("savings",index,"col1",e.target.value)}
                            />
                        </td>
                        <td>
                            <input 
                                type="number"
                                placeholder="Budgeted"
                                value={savingsRow.col2}
                                style={inputStyles}
                                name="savingBudget"
                                onChange={(e)=>handleRowChange("savings",index,"col2",e.target.value)} 
                            />
                        </td>
                        <td>
                            <input 
                                type="number" 
                                placeholder="Actual"
                                value={savingsRow.col3}
                                style={inputStyles}
                                name="savingActual"
                                onChange={(e)=>handleRowChange("savings",index,"col3",e.target.value)} 
                            />
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            </div>
    );
}
export default MyTables