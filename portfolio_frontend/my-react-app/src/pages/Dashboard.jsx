import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress
} from '@mui/material';
import { api } from '../services/api';

const Dashboard = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  
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

  
  const handleSell = async (id, ticker) => {
    const confirmSell = window.confirm(`Are you sure you want to sell your ${ticker} shares at current market price?`);
    
    if (confirmSell) {
      try {
        const response = await api.sellStock(id);
        const { sellValue, profitPercentage } = response.data;
        
        alert(
          `Transaction Successful!\n` +
          `Sold: ${ticker}\n` +
          `Received: $${sellValue.toFixed(2)}\n` +
          `Profit/Loss: ${profitPercentage.toFixed(2)}%`
        );

        
        window.dispatchEvent(new Event('balanceUpdated'));
        
        
        loadPortfolio(); 
      } catch (error) {
        console.error("Sell error:", error);
        alert("Failed to complete the sale. Is the Python bridge running?");
      }
    }
  };

  
  const filteredInvestments = investments.filter(inv => {
    if (filter === 'all') return true;
   
    return inv.sector?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <Box
      sx={{
        height: '90vh',
        width: '100%',
        p: 3,
        mt: '10vh', 
        boxSizing: 'border-box'
      }}
    >
      <Grid container spacing={3} sx={{ height: '100%', width: '100%' }}>
        
        {}
        <Grid item xs={12} md={5} sx={{ height: '100%' }}>
          <Paper
            elevation={3}
            sx={{
              height: '100%',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              My Investments
            </Typography>

            <TextField
              select
              fullWidth
              size="small"
              label="Filter by Sector"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="all">All Sectors</MenuItem>
              <MenuItem value="technology">Technology</MenuItem>
              <MenuItem value="finance">Finance</MenuItem>
              <MenuItem value="healthcare">Healthcare</MenuItem>
            </TextField>

            <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticker</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Buy Price</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredInvestments.map((inv) => (
                      <TableRow key={inv.id} hover>
                        <TableCell sx={{ fontWeight: 'medium' }}>{inv.ticker}</TableCell>
                        <TableCell align="right">{inv.quantity}</TableCell>
                        <TableCell align="right">${inv.buyPrice.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleSell(inv.id, inv.ticker)}
                            sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                          >
                            Sell
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredInvestments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                          No investments found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Paper>
        </Grid>

        {}
        <Grid item xs={12} md={7} sx={{ height: '100%' }}>
          <Paper
            elevation={3}
            sx={{
              height: '100%',
              width: '100%',
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