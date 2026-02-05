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
  ResponsiveContainer
} from "recharts";

const AssetRiskContributionGraph = ({ perAssetRisk }) => {
  const data = [...perAssetRisk]
    .sort((a, b) => b.risk_contribution - a.risk_contribution)
    .map(a => ({
      ticker: a.ticker,
      risk: +(a.risk_contribution * 100).toFixed(2)
    }));

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Asset-wise Risk Contribution (%)
      </Typography>

      <Box sx={{ height: 360 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
    </>
  );
};

export default AssetRiskContributionGraph;
