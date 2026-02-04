import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  Stack
} from '@mui/material';
import { api } from '../services/api'; // adjust path if needed

// ==========================
// FILTER CONFIG
// ==========================
const filterFields = [
  { label: 'ID', value: 'id' },
  { label: 'Ticker', value: 'ticker' },
  { label: 'Sector', value: 'sector' },
  { label: 'Type', value: 'type' },
  { label: 'Risk', value: 'risk' },
  { label: 'Currency', value: 'curr' }
];

const endpointMap = {
  id: (v) => api.getInvestmentById(v),
  ticker: (v) => api.getInvestmentsByTicker(v),
  sector: (v) => api.getInvestmentsBySector(v),
  type: (v) => api.getInvestmentsByType(v),
  risk: (v) => api.getInvestmentsByRisk(v),
  curr: (v) => api.getInvestmentsByCurr(v)
};

const Dashboard = () => {
  // ==========================
  // STATE
  // ==========================
  const [allInvestments, setAllInvestments] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);

  const [filterField, setFilterField] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filterOptions, setFilterOptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================
  // INITIAL LOAD
  // ==========================
  useEffect(() => {
    api.getInvestments()
      .then((res) => {
        setAllInvestments(res.data);
        setFilteredInvestments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load investments');
        setLoading(false);
      });
  }, []);

  // ==========================
  // UPDATE FILTER VALUES
  // ==========================
  useEffect(() => {
    if (!filterField) {
      setFilterOptions([]);
      setFilterValue('');
      return;
    }

    const values = Array.from(
      new Set(
        allInvestments
          .map((inv) => {
            switch (filterField) {
              case 'id':
                return inv.id;
              case 'ticker':
                return inv.ticker;
              case 'sector':
                return inv.sector;
              case 'type':
                return inv.assetType;     // ✅ correct
              case 'risk':
                return inv.riskLabel;     // ✅ correct
              case 'curr':
                return inv.currency;      // ✅ correct
              default:
                return null;
            }
          })
          .filter((v) => v !== null && v !== undefined)
      )
    );

    setFilterOptions(values);
    setFilterValue('');
  }, [filterField, allInvestments]);

  // ==========================
  // APPLY FILTER
  // ==========================
  useEffect(() => {
    if (!filterField || !filterValue) {
      setFilteredInvestments(allInvestments);
      return;
    }

    endpointMap[filterField](filterValue)
      .then((res) => {
        setFilteredInvestments(
          Array.isArray(res.data) ? res.data : [res.data]
        );
      })
      .catch(() => {
        setError('Failed to apply filter');
      });
  }, [filterField, filterValue, allInvestments]);

  // ==========================
  // RENDER
  // ==========================
  return (
    <Box sx={{ height: '100%', width: '100%', p: 3 }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        {/* LEFT SECTION */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={1}
            sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column' }}
          >
            {/* FILTERS */}
            <Box sx={{ mb: 2, width: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Filter By"
                    value={filterField}
                    onChange={(e) => setFilterField(e.target.value)}
                  >
                    {filterFields.map((f) => (
                      <MenuItem key={f.value} value={f.value}>
                        {f.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Value"
                    value={filterValue}
                    disabled={!filterField}
                    onChange={(e) => setFilterValue(e.target.value)}
                  >
                    {filterOptions.map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Box>

            {/* LIST */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {loading && (
                <Stack alignItems="center" mt={3}>
                  <CircularProgress size={24} />
                </Stack>
              )}

              {error && (
                <Typography color="error">{error}</Typography>
              )}

              {!loading && filteredInvestments.map((inv) => (
                <Paper key={inv.id} variant="outlined" sx={{ p: 1, mb: 1 }}>
                  <Typography variant="subtitle2">
                    {inv.ticker} ({inv.assetType})
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Qty: {inv.quantity} | {inv.currency} | Risk: {inv.riskLabel}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT SECTION */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              height: '100%',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              backgroundColor: '#f9f9f9'
            }}
          >
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Portfolio Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (Interactive Graphs will load here based on your portfolio data)
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;