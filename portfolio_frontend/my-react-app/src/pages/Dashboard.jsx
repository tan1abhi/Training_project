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
  Button,
  Divider,
  Dialog, DialogTitle, DialogContent, IconButton
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import SectorAllocationChart from "../components/SectorAllocationChart";
import StockValueBarChart from "../components/StockValueBarChart";


import { api } from '../services/api';
import PortfolioPieChart from '../components/PortfolioPieChart';
import StockPriceChart from '../components/StockPriceChart';
import SellConfirmDialog from '../components/SellConfirmDialog';
import SellQuantityDialog from '../components/SellQuantityDialog';
import { Snackbar, Alert } from '@mui/material';


const filterFields = [
  { label: 'Ticker', value: 'ticker' },
  { label: 'Sector', value: 'sector' },
  { label: 'Type', value: 'type' },
  { label: 'Risk', value: 'risk' },
  { label: 'Currency', value: 'curr' }
];

const endpointMap = {
  ticker: (v) => api.getInvestmentsByTicker(v),
  sector: (v) => api.getInvestmentsBySector(v),
  type: (v) => api.getInvestmentsByType(v),
  risk: (v) => api.getInvestmentsByRisk(v),
  curr: (v) => api.getInvestmentsByCurr(v)
};

const Dashboard = () => {
  const [investments, setInvestments] = useState([]);
  const [allInvestments, setAllInvestments] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [filterField, setFilterField] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [filterOptions, setFilterOptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellingId, setSellingId] = useState(null);

  const [symbol, setSymbol] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);

  const [openChart, setOpenChart] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSell, setPendingSell] = useState(null);
  const [sectorData, setSectorData] = useState([]);
  const [riskData, setRiskData] = useState([]);

  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success'
  });




  const toggleGraphOn = (id, ticker) => {
    setSymbol(ticker);
    setOpenChart(true);
  };

  const toggleGraphOff = () => {
    setOpenChart(false);
    setSymbol(null);
  };



  const loadPortfolio = async () => {
    try {
      setLoading(true);

      const response = await api.getInvestments();
      const data = response.data;

      setInvestments(data);

     
      const stockData = data.map((item) => ({
        stock: item.ticker,
        amount: item.quantity * (item.buyPrice || 0),
      }));
      setPortfolioData(stockData);

   
      const sectorMap = {};
      data.forEach((item) => {
        const value = item.quantity * (item.buyPrice || 0);
        sectorMap[item.sector] = (sectorMap[item.sector] || 0) + value;
      });

      const formattedSectorData = Object.entries(sectorMap).map(
        ([sector, amount]) => ({
          stock: sector,
          amount,
        })
      );
      setSectorData(formattedSectorData);

     
      const riskMap = {};
      data.forEach((item) => {
        const value = item.quantity * (item.buyPrice || 0);
        riskMap[item.riskLabel] = (riskMap[item.riskLabel] || 0) + value;
      });

      const formattedRiskData = Object.entries(riskMap).map(
        ([risk, amount]) => ({
          stock: risk,
          amount,
        })
      );
      setRiskData(formattedRiskData);

    } catch (error) {
      console.error("Failed to fetch investments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

 
  useEffect(() => {
    const loadInvestments = async () => {
      try {
        const response = await api.getInvestments();
        setInvestments(response.data);
      } catch (error) {
        console.error('Investments fetch error:', error);
        setInvestments([]);
      }
    };

    loadInvestments();
  }, []);


  useEffect(() => {
    fetch(`http://localhost:8080/market/history/${symbol}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setStockData(data))
      .catch((err) => console.error("Stock data fetch error:", err));
  }, [symbol]);


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



  const handleSell = (id, ticker, maxQuantity) => {
    if (sellingId === id) return;

    setPendingSell({
      id,
      ticker,
      maxQuantity
    });

    setQuantityDialogOpen(true);
  };


  const handleQuantityNext = (qty) => {
    setPendingSell(prev => ({ ...prev, qty }));
    setQuantityDialogOpen(false);
    setConfirmOpen(true);
  };


  const confirmSell = async () => {
    const { id, ticker, qty } = pendingSell;

    setInvestments(prev =>
      prev
        .map(inv =>
          inv.id === id
            ? { ...inv, quantity: inv.quantity - qty }
            : inv
        )
        .filter(inv => inv.quantity > 0)
    );


    try {
      setSellingId(id);

      const response = await api.sellStock(id, qty);
      const { sellValue, profitPercentage } = response.data || {};

      removeInvestmentFromState(id, qty);
      window.dispatchEvent(new Event('balanceUpdated'));

      setToast({
        open: true,
        severity: 'success',
        message: (
          <>
            <div><b>Transaction Successful</b></div>
            <div>Sold: {ticker}</div>
            <div>Quantity: {qty}</div>
            <div>Received: ${Number(sellValue).toFixed(2)}</div>
            {/* <div>Profit/Loss: {Number(profitPercentage).toFixed(2)}%</div> */}
          </>
        )
      });

    } catch (error) {
      console.error('Sell error:', error);
      alert(error.response?.data || 'Sell failed');
    } finally {
      setSellingId(null);
      setConfirmOpen(false);
      setPendingSell(null);
    }
  };


  const handleSeeGraph = (ticker) => {
    setSymbol(ticker);
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getInvestments();
        if (!mounted) return;
        setAllInvestments(res.data || []);
        setFilteredInvestments(res.data || []);
      } catch (err) {
        console.error('Failed to load investments', err);
        if (!mounted) return;
        setError('Failed to load investments');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    
    setError(null);

    if (filterField === 'all') {
      setFilterOptions([]);
      setFilterValue('');
      return;
    }

   
    const values = Array.from(
      new Set(
        allInvestments
          .map((inv) => {
            switch (filterField) {
              case 'ticker':
                return inv.ticker;
              case 'sector':
                return inv.sector;
              case 'type':
                return inv.assetType;
              case 'risk':
                return inv.riskLabel;
              case 'curr':
                return inv.currency;
              default:
                return null;
            }
          })
          .filter(Boolean)
      )
    );

    setFilterOptions(values);
    setFilterValue(''); 
  }, [filterField, allInvestments]);

  useEffect(() => {
    let cancelled = false;
    let timer = null;

    const runFilter = async () => {
      setError(null);

      if (filterField === 'all') {
        setFilteredInvestments(allInvestments);
        return;
      }

     
      if (!filterValue) return;

      const apiFn = endpointMap[filterField];
      if (!apiFn) {
        console.warn('No API mapping for filterField:', filterField);
        return;
      }

      
      const normalizedValue =
        ['risk', 'type', 'curr', 'ticker'].includes(filterField)
          ? String(filterValue).toUpperCase()
          : filterValue;

      console.log('Applying filter', { filterField, filterValue, normalizedValue });

      setLoading(true);
      try {
        const res = await apiFn(normalizedValue);
        if (cancelled) return;
        const payload = res?.data;
        setFilteredInvestments(Array.isArray(payload) ? payload : [payload]);
        setError(null);
      } catch (err) {
        console.error('Filter error:', err);
        if (cancelled) return;
        setError('Failed to apply filter');
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };

   
    timer = setTimeout(runFilter, 200);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [filterField, filterValue, allInvestments]);

  const reloadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getInvestments();
      setAllInvestments(res.data || []);
      setFilteredInvestments(res.data || []);
    } catch (err) {
      console.error('Reload failed', err);
      setError('Failed to reload');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box sx={{ height: '100%', width: '100%', p: 3 }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>

        <Grid item xs={12} md={4} sx={{ width: "55%" }}>
          <Paper
            elevation={1}
            sx={{
              height: '100%',
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                maxHeight: '70vh',
                overflowY: 'auto',
                pr: 1,
                mt: 1
              }}
            >
        
              <Box
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  backgroundColor: 'background.paper',
                  pb: 1,
                  mb: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Your Investments
                </Typography>
              </Box>

         
              {loading && (
                <Stack alignItems="center" mt={4}>
                  <CircularProgress size={24} />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    mt={1}
                  >
                    Loading investments…
                  </Typography>
                </Stack>
              )}

             
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}

          
              {!loading && filteredInvestments.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  No investments found.
                </Typography>
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
                      alignItems: 'center',
                      borderRadius: 1
                    }}
                  >
               
                    <Box>
                      <Typography variant="subtitle2">
                        {inv.ticker} (${inv.buyPrice})
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Qty: {inv.quantity} • {inv.currency} • Risk: {inv.riskLabel}
                      </Typography>
                    </Box>

                   
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() =>
                          handleSell(inv.id, inv.ticker, inv.quantity)
                        }
                      >
                        Sell
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        onClick={() =>
                          toggleGraphOn(inv.id, inv.ticker)
                        }
                      >
                        Visualize
                      </Button>
                    </Stack>
                  </Paper>
                ))}
            </Box>


          </Paper>
        </Grid>

        <Grid item xs={12} md={8} sx={{ width: "35%", maxWidth: "35%" }}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "flex-start",
              borderRadius: 2,
              backgroundColor: "#f9f9f9",
              overflow: "hidden"
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
                mt: 1,
                flex: 1,
              }}
            >
              <Stack spacing={2}>
              
                <Paper sx={{ p: 1.5, height: 220 }}>
                  <Typography variant="subtitle2" align="center" gutterBottom>
                    Allocation by Stock
                  </Typography>
                  <PortfolioPieChart data={portfolioData} />
                </Paper>

               
                <Paper sx={{ p: 1.5, height: 220 }}>
                  <Typography variant="subtitle2" align="center" gutterBottom>
                    Allocation by Sector
                  </Typography>
                  <SectorAllocationChart data={sectorData} />
                </Paper>
              </Stack>



            </Box>

          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={openChart}
        onClose={toggleGraphOff}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          Stock Price Chart — {symbol}

          <IconButton onClick={toggleGraphOff}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {symbol && (
            <Box sx={{ height: 400 }}>
              <StockPriceChart data={stockData} ticker={symbol} />
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <SellQuantityDialog
        open={quantityDialogOpen}
        data={pendingSell}
        onClose={() => setQuantityDialogOpen(false)}
        onNext={handleQuantityNext}
      />


      <SellConfirmDialog
        open={confirmOpen}
        data={pendingSell}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmSell}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>



    </Box>
  );
};

export default Dashboard;