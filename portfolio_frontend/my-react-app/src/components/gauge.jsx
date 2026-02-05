import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { Box, Typography } from '@mui/material';

const MAX_BALANCE = 10000;

const getColor = (balance) => {
    if (balance >= 7000) return '#2e7d32'; // green
    if (balance >= 3000) return '#f9a825'; // amber
    return '#c62828'; // red
};

const BalanceGauge = ({ balance = 0 }) => {
    const safeBalance = Math.max(0, Math.min(balance, MAX_BALANCE));

    const data = [
        { value: safeBalance },
        { value: MAX_BALANCE - safeBalance },
    ];

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <PieChart width={320} height={180}>
                <Pie
                    data={data}
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    cx="50%"
                    cy="100%"
                    innerRadius={80}
                    outerRadius={120}
                    cornerRadius={8}
                    paddingAngle={2}
                >
                    {data.map((_, index) => (
                        <Cell
                            key={index}
                            fill={index === 0 ? getColor(safeBalance) : '#e0e0e0'}
                        />
                    ))}
                </Pie>
            </PieChart>

            <Typography variant="h5" sx={{ mt: -1 }}>
                ${safeBalance.toFixed(2)}
            </Typography>

            <Typography variant="caption" color="text.secondary">
                Available Balance
            </Typography>
        </Box>

    );
};

export default BalanceGauge;
