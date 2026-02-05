import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioPieChart({ data }) {
  if (!data || data.length === 0) return null;

  const values = data.map((entry) => entry.amount);
  const total = values.reduce((sum, v) => sum + v, 0);

  const chartData = {
    labels: data.map((entry) => entry.stock),
    datasets: [
      {
        data: values,
       backgroundColor: [
  "#34a853", // balanced green
  "#4f7cff", // balanced blue
  "#e6a23c", // balanced amber
  "#e5533d", // balanced red
  "#7b6ef6", // balanced violet
  "#ec6aa0", // balanced rose
  "#2fb9a3", // balanced teal
  "#5a67d8"  // balanced indigo
]

,
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
        display: false // remove labels below
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
