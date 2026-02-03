import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  Chip,
  Stack
} from '@mui/material';

const RiskEngine = () => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
  const fetchRiskData = () => {
    fetch('http://localhost:4000/api/portfolio/risk')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch risk data');
        return res.json();
      })
      .then((data) => {
        setRiskData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  fetchRiskData();
  const intervalId = setInterval(fetchRiskData, 60000);

  return () => clearInterval(intervalId);
}, []);

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        p: 3,
        boxSizing: 'border-box'
      }}
    >
      <Grid container spacing={3} sx={{ height: '100%', width: '100%' }}>
        {/* LEFT SECTION — 30% */}
        <Grid item xs={12} md={4} sx={{ height: '90%', width: '25%' }}>
          <Paper
            elevation={1}
            sx={{
              height: '100%',
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Filter */}
            <TextField
              select
              fullWidth
              size="small"
              label="Filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="low">Low Risk</MenuItem>
              <MenuItem value="medium">Medium Risk</MenuItem>
              <MenuItem value="high">High Risk</MenuItem>
            </TextField>

            {/* List */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {loading && (
                <Stack alignItems="center" mt={4}>
                  <CircularProgress size={28} />
                </Stack>
              )}

              {error && (
                <Typography color="error">
                  {error}
                </Typography>
              )}

              {riskData && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Portfolio Assets
                  </Typography>

                  <Stack spacing={1}>
                    {riskData.assets.map((symbol) => (
                      <Paper
                        key={symbol}
                        variant="outlined"
                        sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}
                      >
                        <Typography>{symbol}</Typography>
                        <Chip
                          label={riskData.risk}
                          size="small"
                          color={
                            riskData.risk === 'HIGH'
                              ? 'error'
                              : riskData.risk === 'MEDIUM'
                              ? 'warning'
                              : 'success'
                          }
                        />
                      </Paper>
                    ))}
                  </Stack>
                </>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT SECTION — 70% */}
        <Grid item xs={12} md={8} sx={{ height: '90%', width: '65%' }}>
          <Paper
            elevation={1}
            sx={{
              height: '100%',
              width: '100%',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {loading && <CircularProgress />}

            {riskData && (
              <>
                <Typography variant="h4" gutterBottom>
                  Portfolio Risk
                </Typography>

                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    color:
                      riskData.risk === 'HIGH'
                        ? 'error.main'
                        : riskData.risk === 'MEDIUM'
                        ? 'warning.main'
                        : 'success.main'
                  }}
                >
                  {riskData.risk}
                </Typography>

                <Typography variant="body1" color="text.secondary" mt={2}>
                  Volatility Ratio: <strong>{riskData.volatility_ratio}</strong>
                </Typography>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RiskEngine;
