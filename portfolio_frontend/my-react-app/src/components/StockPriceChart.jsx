import React, { useMemo, useState } from "react";
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
  Filler
} from "chart.js";
import { Box, Typography, Button, ButtonGroup } from "@mui/material";

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

const RANGES = {
  "5D": 5,
  "10D": 10,
  "15D": 15,
  "30D": 30,
  "3M": 90
};

export default function StockPriceChart({ data }) {
  const [range, setRange] = useState("30D");

  const normalizeDate = (d) => new Date(d + "T00:00:00");

  
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sortedData = [...data].sort(
      (a, b) => normalizeDate(a.time) - normalizeDate(b.time)
    );

    const latestDate = normalizeDate(
      sortedData[sortedData.length - 1].time
    );

    const cutoff = new Date(latestDate);
    cutoff.setDate(cutoff.getDate() - RANGES[range]);

    return sortedData.filter(
      (entry) => normalizeDate(entry.time) >= cutoff
    );
  }, [data, range]);

 
  const trend = useMemo(() => {
    if (filteredData.length < 2) {
      return {
        line: "#64748b",
        fill: "rgba(100,116,139,0.2)"
      };
    }

    const first = filteredData[0].close;
    const last = filteredData[filteredData.length - 1].close;

    return last >= first
      ? {
          line: "#34a853",
          fill: "rgba(52,168,83,0.25)"
        }
      : {
          line: "#e5533d",
          fill: "rgba(229,83,61,0.25)"
        };
  }, [filteredData]);

  
  const prices = filteredData.map(d => d.close);
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 0;
  const padding = (max - min) * 0.1 || 1;

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8"
        }}
      >
        No historical data available for this ticker
      </Box>
    );
  }

 
  const chartData = {
    labels: filteredData.map(entry => entry.time),
    datasets: [
      {
        label: "Close Price",
        data: filteredData.map(entry => entry.close),
        borderColor: trend.line,
        backgroundColor: trend.fill,
        fill: true,
        tension: 0.35,
        pointRadius: 2,
        pointBackgroundColor: trend.line
      }
    ]
  };

 
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#e5e7eb" }
      },
      tooltip: {
        mode: "index",
        intersect: false
      }
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { display: false }
      },
      y: {
        min: min - padding,
        max: max + padding,
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(255,255,255,0.08)" }
      }
    }
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Typography variant="h6" align="center" sx={{ mb: 1 }}>
        Price History
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <ButtonGroup size="small">
          {Object.keys(RANGES).map((key) => (
            <Button
              key={key}
              variant={range === key ? "contained" : "outlined"}
              onClick={() => setRange(key)}
            >
              {key}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      <Box sx={{ height: 320 }}>
        <Line
          key={`${range}-${filteredData.length}`}
          data={chartData}
          options={options}
        />
      </Box>
    </Box>
  );
}
