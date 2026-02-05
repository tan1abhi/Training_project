import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function StockValueBarChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const labels = data.map((i) => i.ticker);
  const values = data.map((i) => i.quantity * i.buyPrice);

  return (
    <div style={{ height: 300 }}>
      <Bar
        data={{
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: "#3b82f6"
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `$${ctx.raw.toFixed(2)}`
              }
            }
          },
          scales: {
            y: {
              ticks: {
                callback: (v) => `$${v}`
              }
            }
          }
        }}
      />
    </div>
  );
}
