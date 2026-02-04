import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function StockPriceChart({ data }) {
  const chartData = {
    labels: data.map((entry) => entry.time),
    datasets: [
      {
        label: "Stock Price",
        data: data.map((entry) => entry.close),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true, 
      },
    ],
  };

  return (
    <div style={{ height: "100%" }}>
      <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  );
}
