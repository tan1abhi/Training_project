import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SectorAllocationChart({ data }) {
  console.log("SectorAllocationChart received:", data);

  if (!Array.isArray(data) || data.length === 0) return null;

  const values = data.map((entry) => entry.amount);
  const total = values.reduce((sum, v) => sum + v, 0);

  const chartData = {
    labels: data.map((entry) => entry.stock),
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#ec4899",
          "#14b8a6",
          "#6366f1",
          "#64748b"
        ],
        borderWidth: 1,
        cutout: "65%"
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = total
              ? ((value / total) * 100).toFixed(1)
              : 0;

            return `${context.label}: ${percentage}%`;
          }
        }
      }
    }
  };

  return (
    <div
      style={{
        height: 200,
        width: "100%",
        position: "relative"
      }}
    >
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
