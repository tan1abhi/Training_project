import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioPieChart({ data }) {
  const chartData = {
    labels: data.map((entry) => entry.stock), 
    datasets: [
      {
        data: data.map((entry) => entry.amount), 
        backgroundColor: [
          "#22c55e", 
          "#3b82f6", 
          "#f59e0b",
          "#ef4444", 
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ height: "100%" }}>
      <Pie data={chartData} options={{ responsive: true }} />
    </div>
  );
}
