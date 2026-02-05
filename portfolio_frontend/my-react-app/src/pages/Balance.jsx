import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Stack,
    Grid,
    Divider,
    CircularProgress
} from '@mui/material';
import { api } from '../services/api';
import BalanceGauge from '../components/gauge';

const Balance = () => {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [loading, setLoading] = useState(false);

    const [news, setNews] = useState([]);
    const [newsLoading, setNewsLoading] = useState(true);

    const [investments, setInvestments] = useState([]);


    const fetchCurrentBalance = useCallback(async () => {
        try {
            const response = await api.getBalance();
            setBalance(response.data);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    }, []);

    useEffect(() => {
        fetchCurrentBalance();
        window.addEventListener('balanceUpdated', fetchCurrentBalance);

        const interval = setInterval(fetchCurrentBalance, 15000);

        return () => {
            window.removeEventListener('balanceUpdated', fetchCurrentBalance);
            clearInterval(interval);
        };
    }, [fetchCurrentBalance]);

    useEffect(() => {
    const fetchInvestments = async () => {
            try {
                const res = await api.getInvestments();
                setInvestments(res.data);
            } catch (err) {
                console.error('Failed to fetch investments', err);
            }
        };

        fetchInvestments();
    }, []);


    const tickers = Array.from(
        new Set(investments.map(inv => inv.ticker))
    ).join(',');

    useEffect(() => {
    if (!tickers) return;

    const fetchNews = async () => {
        try {
            setNewsLoading(true);

            const url = `https://api.marketaux.com/v1/news/all?symbols=${tickers}&filter_entities=true&language=en&limit=10&api_token=${process.env.REACT_APP_MARKETAUX_API_KEY3}`;

            const res = await fetch(url);
            const json = await res.json();

            const parsed = json.data.slice(0, 6).map(item => ({
                title: item.title,
                link: item.url,
                source: item.source,
                publishedAt: item.published_at
            }));

            setNews(parsed);
        } catch (err) {
            console.error('Failed to fetch portfolio news', err);
        } finally {
            setNewsLoading(false);
        }
    };

    fetchNews();
}, [tickers]);


    const handleAddBalance = async () => {
        if (!amount || Number(amount) <= 0) {
            alert('Enter a valid amount');
            return;
        }

        try {
            setLoading(true);
            await api.updateBalance(Number(amount));
            setAmount('');
            setShowAdd(false);
            fetchCurrentBalance();
        } catch (err) {
            console.error('Failed to add balance', err);
            alert('Failed to update balance');
        } finally {
            setLoading(false);
        }
    };

    return (
    <Grid container minHeight="100vh" spacing={3} p={3}>
  <Grid item xs={12} md={6} display="flex" justifyContent="center">
    <Card
      elevation={1}
      sx={{
        width: 420,
        borderRadius: 2
      }}
    >
      <CardContent
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
       
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, letterSpacing: 0.4 }}
        >
          Available Balance
        </Typography>

        <Box sx={{ width: '100%', mb: 2 }}>
          <BalanceGauge balance={balance} />
        </Box>

        <Typography variant="h4" fontWeight={600} sx={{ mb: 2 }}>
          ${balance.toFixed(2)}
        </Typography>

        {!showAdd && (
          <Button
            variant="contained"
            size="small"
            onClick={() => setShowAdd(true)}
          >
            Add Balance
          </Button>
        )}

        {showAdd && (
          <Stack spacing={2} mt={2} width="100%">
            <TextField
              label="Amount"
              type="number"
              size="small"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputProps={{ min: 1 }}
              fullWidth
            />

            <Stack direction="row" spacing={1} justifyContent="center">
              <Button
                variant="contained"
                size="small"
                onClick={handleAddBalance}
                disabled={loading}
              >
                {loading ? 'Adding…' : 'Confirm'}
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setShowAdd(false);
                  setAmount('');
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  </Grid>

 
  <Grid item xs={12} md={6} display="flex" justifyContent="center" sx={{ width: '50%' }}>
    <Card
      elevation={1}
      sx={{
        width: '100%',
        maxWidth: 520,
        borderRadius: 2
      }}
    >
      <CardContent sx={{ p: 3 }}>
       
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Market News
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Latest updates related to your portfolio
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {newsLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Stack spacing={2}>
            {news.map((item, idx) => (
              <Box key={idx}>
                <Typography
                  variant="body2"
                  component="a"
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    textDecoration: 'none',
                    color: 'text.primary',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.3, display: 'block' }}
                >
                  {item.source} ·{' '}
                  {new Date(item.publishedAt).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  </Grid>
</Grid>

    );
};

export default Balance;
