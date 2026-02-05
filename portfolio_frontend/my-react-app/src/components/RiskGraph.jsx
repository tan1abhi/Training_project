import React from "react";
import {
  Box,
  Typography,
  Divider
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell
} from "recharts";

const RiskGraph = ({ riskData }) => {
  if (!riskData) return null;

  const { per_asset_risk, portfolio_risk } = riskData;

  const riskContributionData = [...per_asset_risk]
    .sort((a, b) => b.risk_contribution - a.risk_contribution)
    .map(a => ({
      ticker: a.ticker,
      risk: +(a.risk_contribution * 100).toFixed(2)
    }));

  const weightVsRiskData = per_asset_risk.map(a => ({
    ticker: a.ticker,
    weight: +(a.weight * 100).toFixed(2),
    risk: +(a.risk_contribution * 100).toFixed(2)
  }));

  const monteCarloData = [
    {
      scenario: "Worst Case",
      value: +(portfolio_risk.monte_carlo.worst_case_return * 100).toFixed(2),
      color: "#d32f2f"
    },
    {
      scenario: "Expected",
      value: +(portfolio_risk.monte_carlo.expected_return * 100).toFixed(2),
      color: "#f9a825"
    },
    {
      scenario: "Best Case",
      value: +(portfolio_risk.monte_carlo.best_case_return * 100).toFixed(2),
      color: "#2e7d32"
    }
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: "75vh",
        overflowY: "auto",
        px: 2,
        pb: 4
      }}
    >

      
      <Typography variant="h6" gutterBottom>
        Asset-wise Risk Contribution (%)
      </Typography>

      <Box sx={{ height: 360 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={riskContributionData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="ticker" type="category" />
            <Tooltip />
            <Bar dataKey="risk" fill="#d32f2f" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Divider sx={{ my: 4 }} />

      
      <Typography variant="h6" gutterBottom>
        Portfolio Weight vs Risk Contribution
      </Typography>

      <Box sx={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="weight"
              name="Weight (%)"
              unit="%"
            />
            <YAxis
              type="number"
              dataKey="risk"
              name="Risk Contribution (%)"
              unit="%"
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter
              data={weightVsRiskData}
              fill="#1976d2"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </Box>

      <Divider sx={{ my: 4 }} />

      
      <Typography variant="h6" gutterBottom>
        Monte Carlo Return Scenarios (Next Month %)
      </Typography>

      <Box sx={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monteCarloData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="scenario" />
            <YAxis unit="%" />
            <Tooltip />
            <Bar dataKey="value">
              {monteCarloData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

    </Box>
  );
};

export default RiskGraph;
