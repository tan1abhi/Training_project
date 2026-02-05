import React from "react";
import {
  Box,
  Typography
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const MonteCarloGraph = ({ monteCarlo }) => {
  const data = [
    {
      scenario: "Worst Case",
      value: +(monteCarlo.worst_case_return * 100).toFixed(2),
      color: "#d32f2f"
    },
    {
      scenario: "Expected",
      value: +(monteCarlo.expected_return * 100).toFixed(2),
      color: "#f9a825"
    },
    {
      scenario: "Best Case",
      value: +(monteCarlo.best_case_return * 100).toFixed(2),
      color: "#2e7d32"
    }
  ];

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Monte Carlo Return Scenarios (Next Month %)
      </Typography>

      <Box sx={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="scenario" />
            <YAxis unit="%" />
            <Tooltip />
            <Bar dataKey="value">
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </>
  );
};

export default MonteCarloGraph;
