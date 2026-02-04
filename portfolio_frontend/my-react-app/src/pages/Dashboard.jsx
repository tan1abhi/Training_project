import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  Stack,
  Button
} from '@mui/material';
import { api } from '../services/api'; 

const filterFields = [
  { label: 'All', value: 'all' },
  { label: 'Ticker', value: 'ticker' },
  { label: 'Sector', value: 'sector' },
  { label: 'Type', value: 'type' },
  { label: 'Risk', value: 'risk' },
  { label: 'Currency', value: 'curr' }
];

const endpointMap = {
  all: () => api.getInvestments(),
  ticker: (v) => api.getInvestmentsByTicker(v),
  sector: (v) => api.getInvestmentsBySector(v),
  type: (v) => api.getInvestmentsByType(v),
  risk: (v) => api.getInvestmentsByRisk(v),
  curr: (v) => api.getInvestmentsByCurr(v)
};

const Dashboard = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [allInvestments, setAllInvestments] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [filterField, setFilterField] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filterOptions, setFilterOptions] = useState([]);
  const [error, setError] = useState(null);
  const [sellingId, setSellingId] = useState(null);


  
  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const response = await api.getInvestments();
      setInvestments(response.data);
    } catch (error) {
      console.error("Failed to fetch investments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const removeInvestmentFromState = (id, soldQty) => {
  setFilteredInvestments((prev) =>
    prev
      .map((inv) =>
        inv.id === id
          ? { ...inv, quantity: inv.quantity - soldQty }
          : inv
      )
      .filter((inv) => inv.quantity > 0)
  );
};


  const handleSell = async (id, ticker, maxQuantity) => {
  if (sellingId === id) return;

  const quantity = window.prompt(
    `Enter quantity to sell (max ${maxQuantity}):`,
    maxQuantity
  );

  if (!quantity) return;

  const qty = Number(quantity);

  if (!Number.isInteger(qty) || qty <= 0 || qty > maxQuantity) {
    alert('Invalid quantity');
    return;
  }

  const confirmSell = window.confirm(
    `Are you sure you want to sell ${qty} shares of ${ticker} at current market price?`
  );

  if (!confirmSell) return;

  try {
    setSellingId(id);

    const response = await api.sellStock(id, qty);

    const { sellValue, profitPercentage } = response.data || {};
    console.log('Sell response data:', response.data);

    removeInvestmentFromState(id, qty);

    window.dispatchEvent(new Event('balanceUpdated'));

    alert(
      `Transaction Successful!\n` +
      `Sold: ${ticker}\n` +
      `Quantity: ${qty}\n` +
      `Received: $${Number(sellValue).toFixed(2)}\n` +
      `Profit/Loss: ${Number(profitPercentage).toFixed(2)}%`
    );
  } catch (error) {
    console.error('Sell error:', error);

    if (error.response) {
      alert(error.response.data || 'Sell failed');
    } else {
      alert('Sell request is taking longer than usual. Please wait and refresh.');
    }
  } finally {
    setSellingId(null);
  }
};

const handleSeeGraph = (id, ticker) => {
  alert(`Graph feature coming soon for ${ticker} (ID: ${id})!`);
}


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


  return (
  <Box sx={{ height: '100%', width: '100%', p: 3 }}>
    <Grid container spacing={3} sx={{ height: '100%' }}>
      
      <Grid item xs={12} md={4} sx={{ width: "35%"}}>
        <Paper
          elevation={1}
          sx={{
            height: '100%',
            p: 2,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          
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

         
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {loading && (
              <Stack alignItems="center" mt={3}>
                <CircularProgress size={24} />
              </Stack>
            )}

            {error && (
              <Typography color="error">{error}</Typography>
            )}

            {!loading &&
              filteredInvestments.map((inv) => (
                <Paper
                  key={inv.id}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  {/* LEFT INFO */}
                  <Box>
                    <Typography variant="subtitle2">
                      {inv.ticker} ({inv.assetType})
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Qty: {inv.quantity} | {inv.currency} | Risk: {inv.riskLabel}
                    </Typography>
                  </Box>

                  
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleSell(inv.id, inv.ticker, inv.quantity)}
                  >
                    Sell
                  </Button>


                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleSeeGraph(inv.id, inv.ticker)}
                  >
                    seeGraph
                  </Button>
                </Paper>
              ))}
          </Box>
        </Paper>
      </Grid>

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