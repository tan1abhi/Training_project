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

            const url = `https://api.marketaux.com/v1/news/all?symbols=${tickers}&filter_entities=true&language=en&limit=10&api_token=4XHx8I27cguuFpwgGHZqaFmpro5pUQ1Gj0EexSkf`;

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
        <Grid container minHeight="100vh" spacing={2} p={3}>
            {/* LEFT: BALANCE */}
            <Grid item xs={12} md={6} display="flex" justifyContent="center">
                <Card elevation={3} sx={{ width: 420 }}>
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <Box sx={{ width: '100%', mb: 2 }}>
                            <BalanceGauge balance={balance} />
                        </Box>

                        <Typography variant="h4" sx={{ mb: 2 }}>
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
                                        {loading ? 'Adding...' : 'Confirm'}
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

            {/* RIGHT: MARKET NEWS */}
            <Grid item xs={12} md={6} display="flex" justifyContent="center">
                <Card elevation={3} sx={{ width: '100%', maxWidth: 520 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Market News
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        {newsLoading ? (
                            <Box display="flex" justifyContent="center" py={3}>
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
                                                color: 'primary.main',
                                                fontWeight: 500,
                                                '&:hover': {
                                                    textDecoration: 'underline'
                                                }
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.source} ·{' '}
                                            {new Date(item.publishedAt).toLocaleString()}
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
