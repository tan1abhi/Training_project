import React from "react";
import {
  Box,
  Typography
} from "@mui/material";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const WeightVsRiskGraph = ({ perAssetRisk }) => {
  const data = perAssetRisk.map(a => ({
    ticker: a.ticker,
    company: a.company || a.ticker,
    weight: +(a.weight * 100).toFixed(2),
    risk: +(a.risk_contribution * 100).toFixed(2)
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const d = payload[0].payload;

    return (
      <Box
        sx={{
          p: 1,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1
        }}
      >
        <Typography variant="subtitle2" fontWeight={600}>
          {d.company}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {d.ticker}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Weight: {d.weight}%
        </Typography>
        <Typography variant="body2">
          Risk Contribution: {d.risk}%
        </Typography>
      </Box>
    );
  };

  return (
    <>
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
              unit="%"
              name="Portfolio Weight"
            />
            <YAxis
              type="number"
              dataKey="risk"
              unit="%"
              name="Risk Contribution"
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={data} fill="#1976d2" />
          </ScatterChart>
        </ResponsiveContainer>
      </Box>
    </>
  );
};

export default WeightVsRiskGraph;
