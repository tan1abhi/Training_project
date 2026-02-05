import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Added Filler for the 'fill: true' background
} from "chart.js";

// Register all necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function StockPriceChart({ data }) {
  // 1. Safety check for data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8' }}>
        <p>No historical data available for this ticker</p>
      </div>
    );
  }

  // 2. Prepare the data structure
  const chartData = {
    labels: data.map((entry) => entry.time),
    datasets: [
      {
        label: "Close Price",
        data: data.map((entry) => entry.close),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.3, // Makes the line slightly curved
        pointRadius: 2,
      },
    ],
  };

  // 3. Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: "white" }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { display: false }
      },
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(255, 255, 255, 0.1)" }
      }
    }
  };

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}