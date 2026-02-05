import React,{useState , useEffect} from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  Button,
  Divider,
  TextField,
   Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Snackbar, Alert } from '@mui/material';


import { api } from '../services/api'; 

const BrowseStocks = () => {
  const [search, setSearch] = useState('');
  const [buyLoading, setBuyLoading] = useState(false);

  const [investments, setInvestments] = useState([]);
  const [allInvestments, setAllInvestments] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [openBuyDialog, setOpenBuyDialog] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [toast, setToast] = useState({
  open: false,
  message: '',
  severity: 'success'
});




  const [mockStocks, setMockStocks] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await api.getBrowseStocks();
        setMockStocks(res.data);
      } catch (error) {
        console.error('Failed to fetch stocks', error);
      }
    };

    fetchStocks();
  }, []);

  const [buyForm, setBuyForm] = useState({
    ticker: '',
    quantity: '',
    targetSellPrice: '',
    notes: ''
  });

  const handleBuyChange = (e) => {
    const { name, value } = e.target;
    setBuyForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const loadPortfolio = async () => {
    try {
      setBuyLoading(true);
      const response = await api.getInvestments();
      setInvestments(response.data);
      setAllInvestments(response.data);
      setFilteredInvestments(response.data);
    } catch (error) {
      console.error('Failed to fetch investments:', error);
    } finally {
      setBuyLoading(false);
    }
  };

  const handleQuickBuyClick = (ticker, price) => {
    setBuyForm((prev) => ({
      ...prev,
      ticker: ticker.toUpperCase()
    }));
    setSelectedPrice(price);
    setOpenBuyDialog(true);
  };


  const handleBuyStock = async () => {
    if (!buyForm.ticker || !buyForm.quantity) {
      setToast({
        open: true,
        severity: 'warning',
        message: 'Ticker and Quantity are required'
      });
      return;
    }

    const payload = {
      ticker: buyForm.ticker.toUpperCase(),
      quantity: Number(buyForm.quantity),
      targetSellPrice: buyForm.targetSellPrice
        ? Number(buyForm.targetSellPrice)
        : null,
      notes: buyForm.notes
    };

    try {
      setBuyLoading(true);
      await api.addInvestment(payload);

     setToast({
        open: true,
        severity: 'success',
        message: (
          <>
            <div><b>Purchase Successful</b></div>
            <div>Ticker: {payload.ticker}</div>
            <div>Quantity: {payload.quantity}</div>
          </>
        )
      });


      setBuyForm({
        ticker: '',
        quantity: '',
        targetSellPrice: '',
        notes: ''
      });

      loadPortfolio();
      setOpenBuyDialog(false);
    } catch (error) {
      console.error('Buy error:', error);
      setToast({
        open: true,
        severity: 'error',
        message: error.response?.data?.message || 'Failed to buy stock'
      });

    } finally {
      setBuyLoading(false);
    }
  };

  const filteredStocks = mockStocks.filter((stock) => {
  const q = search.trim().toLowerCase();
  if (!q) return true;

  return (
    stock.companyName.toLowerCase().includes(q) ||
    stock.ticker.toLowerCase().includes(q)
  );
});

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        p: 3,
        boxSizing: 'border-box'
      }}
    >
    <Grid container spacing={3} sx={{ height: '100%' }}>
    
        <Grid item xs={12} md={4} sx={{ height: '100%', width: '95%' }}>
          <Paper
            elevation={1}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              // backgroundColor: '#f5f7fa',
            }}
          >

            <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by company or ticker..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>

           
            <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
              <Typography variant="h6">
                Browse Stocks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Live market prices
              </Typography>
            </Box>

           
            <Box
              sx={{
                px: 2,
                py: 1,
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr',
                fontWeight: 600,
                fontSize: '0.75rem',
                color: 'text.secondary'
              }}
            >
              <span>Company</span>
              <span>Ticker</span>
              <span>Price</span>
              <span>Sector</span>
              <span></span>
            </Box>

            <Divider />

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <List disablePadding>
                {filteredStocks.length === 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ p: 2 }}
                  >
                    No stocks found
                  </Typography>
                )}

                {filteredStocks.map((stock) => (
                  <ListItem
                    key={stock.id}
                    sx={{
                      px: 2,
                      py: 1,
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="body2">
                      {stock.companyName}
                    </Typography>

                    <Typography variant="body2">
                      {stock.ticker}
                    </Typography>

                    <Typography variant="body2">
                      ${Number(stock.currentPrice).toFixed(2)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {stock.sector}
                    </Typography>

                    <Button
                      size="small"
                      color="primary"
                      variant="contained"

                      onClick={() => handleQuickBuyClick(stock.ticker,  stock.currentPrice)}
                    >
                      Buy
                    </Button>
                  </ListItem>
                ))}

                </List>
              </Box>  
          </Paper>
        </Grid>
    </Grid>

    <Dialog
    open={openBuyDialog}
    onClose={() => setOpenBuyDialog(false)}
    maxWidth="sm"
    fullWidth
  >
    <DialogTitle
    sx={{
      m: 0,
      p: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}
  >
    <Box>
      <Typography variant="h6">Buy Stock</Typography>
      {selectedPrice !== null && (
        <Typography variant="caption" color="text.secondary">
          Current Price: ${Number(selectedPrice).toFixed(2)}
        </Typography>
      )}
    </Box>

    <IconButton
      aria-label="close"
      onClick={() => setOpenBuyDialog(false)}
      sx={{ color: 'grey.500' }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

    <DialogContent dividers>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
          mt: 1
        }}
      >
        <TextField
          label="Ticker ID"
          name="ticker"
          size="small"
          fullWidth
          required
          value={buyForm.ticker}
          onChange={handleBuyChange}
        />

        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          size="small"
          fullWidth
          required
          inputProps={{ min: 1 }}
          value={buyForm.quantity}
          onChange={handleBuyChange}
        />

        <TextField
          label="Target Sell Price"
          name="targetSellPrice"
          type="number"
          size="small"
          fullWidth
          inputProps={{ min: 0 }}
          value={buyForm.targetSellPrice}
          onChange={handleBuyChange}
        />

        <TextField
          label="Notes"
          name="notes"
          size="small"
          fullWidth
          multiline
          rows={2}
          sx={{ gridColumn: '1 / -1' }}
          value={buyForm.notes}
          onChange={handleBuyChange}
        />
      </Box>
    </DialogContent>

    <DialogActions>
      <Button
        onClick={() => setOpenBuyDialog(false)}
        disabled={buyLoading}
      >
        Cancel
      </Button>

      <Button
        variant="contained"
        onClick={handleBuyStock}
        disabled={buyLoading}
      >
        {buyLoading ? 'Buying...' : 'Buy Stock'}
      </Button>
    </DialogActions>
  </Dialog>

  <Snackbar
  open={toast.open}
  autoHideDuration={4000}
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

export default BrowseStocks;