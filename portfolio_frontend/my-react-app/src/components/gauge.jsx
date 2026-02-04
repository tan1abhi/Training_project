import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { Box, Typography } from '@mui/material';

const MAX_BALANCE = 10000;

const getColor = (balance) => {
  if (balance >= 7000) return '#2e7d32';
  if (balance >= 3000) return '#f9a825';
  return '#c62828';
};

const BalanceGauge = ({ balance = 0 }) => {
  const safeBalance = Math.max(0, Math.min(balance, MAX_BALANCE));

  const data = [
    { value: safeBalance },
    { value: MAX_BALANCE - safeBalance }
  ];

  return (
    <Box sx={{ textAlign: 'center' }}>
      <PieChart width={220} height={120}>
        <Pie
          data={data}
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={90}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={index === 0 ? getColor(safeBalance) : '#e0e0e0'}
            />
          ))}
        </Pie>
      </PieChart>

      <Typography variant="h6">
        ${safeBalance.toFixed(2)}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        Available Balance
      </Typography>
    </Box>
  );
};

export default BalanceGauge;
