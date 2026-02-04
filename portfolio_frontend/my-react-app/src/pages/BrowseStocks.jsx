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
  TextField
} from '@mui/material';

import { api } from '../services/api'; 

const BrowseStocks = () => {
  const [search, setSearch] = useState('');
  const [buyLoading, setBuyLoading] = useState(false);

  const [investments, setInvestments] = useState([]);
  const [allInvestments, setAllInvestments] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);

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

  const handleQuickBuyClick = (ticker) => {
    setBuyForm((prev) => ({
      ...prev,
      ticker: ticker.toUpperCase()
    }));
  };

  const handleBuyStock = async () => {
    if (!buyForm.ticker || !buyForm.quantity) {
      alert('Ticker and Quantity are required');
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

      alert(`Successfully bought ${payload.quantity} shares of ${payload.ticker}`);

      setBuyForm({
        ticker: '',
        quantity: '',
        targetSellPrice: '',
        notes: ''
      });

      loadPortfolio();
    } catch (error) {
      console.error('Buy error:', error);
      alert(error.response?.data?.message || 'Failed to buy stock');
    } finally {
      setBuyLoading(false);
    }
  };

  const filteredStocks = mockStocks.filter(
    (stock) =>
      stock.companyName.toLowerCase().includes(search.toLowerCase()) ||
      stock.ticker.toLowerCase().includes(search.toLowerCase())
  );
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
    
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <Paper
            elevation={1}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
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

                {mockStocks.map((stock) => (
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
      variant="outlined"
      color="primary"
      onClick={() => handleQuickBuyClick(stock.ticker)}
    >
      Buy
    </Button>
  </ListItem>
))}

                </List>
              </Box>  
          </Paper>
        </Grid>
  
    <Grid item xs={12} md={8} sx={{ height: '100%' , width : '45%' }}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
       
      <Paper
        elevation={1}
        sx={{
        flexGrow: 7,
        p: 2,
        display: 'flex',
        flexDirection: 'column'
        }}
        >
        <Typography variant="h6" gutterBottom>
        Buy / Add Stock
        </Typography>

        <Box
        sx={{
          mt: 2,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2
        }}
        >
        {/* TICKER */}
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

        
        <Box sx={{ gridColumn: '1 / -1', textAlign: 'right', mt: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBuyStock}
            disabled={buyLoading}
          >
            {buyLoading ? 'Buying...' : 'Buy Stock'}
          </Button>
        </Box>
        </Box>
      </Paper>



        <Paper
          elevation={1}
          sx={{
            flexGrow: 3,
            p: 2
          }}
        >
          <Typography variant="h6" gutterBottom>
            remove stocks
          </Typography>
        </Paper>
      </Box>
    </Grid>
  </Grid>
</Box>

  );
};

export default BrowseStocks;