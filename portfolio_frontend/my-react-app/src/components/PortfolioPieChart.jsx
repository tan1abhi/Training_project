import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioPieChart({ data }) {
  // Safety check
  if (!data || data.length === 0) return null;

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
          "#8b5cf6",
          "#ec4899",
          "#14b8a6",
          "#6366f1"
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",     
      align: "start",         
      maxWidth: 220,         
      labels: {
        boxWidth: 12,
        boxHeight: 12,
        padding: 12,
        color: "#333",
        usePointStyle: true
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.raw;
          return `${context.label}: ${(value * 100).toFixed(1)}%`;
        }
      }
    }
  }
};


  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Pie chart area */}
      <div style={{ flex: 1, minHeight: 260 }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}
