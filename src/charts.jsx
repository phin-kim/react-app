import {Pie,Bar,Line,Doughnut} from "react-chartjs-2";
import { Chart as ChartJS,ArcElement,Tooltip,Legend,CategoryScale,LinearScale,BarElement,PointElement,LineElement, scales } from "chart.js";
import { tooltip } from "leaflet";
ChartJS.register(
    ArcElement,Tooltip,Legend,
    CategoryScale,LinearScale,BarElement,
    PointElement,LineElement
);

function MyCharts({ isDark,incomeActual, billsActual, expensesActual, savingsActual,incomeBudget, billsBudget, expensesBudget, savingsBudget,incomeSpent}){
    const axisColor = isDark ?"#f0f0f0" : "#222";

    const pieData = {
        labels:["income","bills","expenses","savings"],
        datasets:[
            {
                data: [incomeActual, billsActual, expensesActual, savingsActual],
                backgroundColor: ["#038828", "#eb0808", "#f66f1b", "#1e40ff"],
            },
        ],
    };
    const myPieOpt={
        responsive:true,
        plugins:{
            legend:{
                position:"top",
                labels:{
                    color:axisColor,
                }
            },
        }
    }; 
    const barData = {
        labels:["income","bills","expenses","savings"],
        datasets:[
            {
                label:"Budget",
                data:[incomeBudget, billsBudget, expensesBudget, savingsBudget],
                barThickness:40,
                backgroundColor:"#ec7a34",
            },
            {
                label:"Actual",
                data:[incomeActual, billsActual, expensesActual, savingsActual],
                backgroundColor: "#01d93e",
                barThickness:40,
            },
        ],
    };
    const barOpt = {
        responsive:true,
        plugins:{
            legend:{
                position:"top",
                labels:{
                    color:axisColor,
                }
            },
        },
        scales:{
            x:{
                stacked:false,
                categoryPercentage:0.6,
                barPercentage:0.6,
                ticks:{
                    color:axisColor,
                }
            },
            y:{
                beginAtZero:true,
                ticks:{
                    color:axisColor,
                }
            },
        },
    };
    const spent = incomeSpent;
    const total = incomeActual || 1;
    const spentPercentage = Math.min((spent / total)* 100,100);
    const doughnutData ={
        labels:["Spent","Left"],
        datasets:[
            {
                data:[spent,total - spent],
                backgroundColor: ["#eb0808", "#36A2EB"],
                borderWidth: 1,
            },
        ],
    };
    const doughnutOpt = {
        cutout:"70%",
        responsive:true,
        plugins:{
            legend:{display:false},
            tooltip:{enabled:false},
        },
    };
    const doughnutStyles = {
        position: "relative",
        top: "-90px",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "1.2em"
    }
    return(
        
            <section className="myCharts">
                    <div className="remainder">
                    <h4>INCOME SPENT</h4>
                    <Doughnut data={doughnutData} options={doughnutOpt}/>
                    {Math.round(spentPercentage)}%
                    </div>
                    <div className="comparison">
                        <h4>BUDGET VS ACTUAL</h4>
                        <Bar data={barData} options={barOpt}/>
                    </div>
                    <div className="analysis">
                        <h4>FINANCIAL DISTRIBUTION</h4>
                        <Pie data={pieData} options={myPieOpt} />
                    </div>
            </section>
    );
}
export default MyCharts;