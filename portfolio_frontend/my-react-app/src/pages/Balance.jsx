import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Stack, 
    Grid
} from '@mui/material';
import { api } from '../services/api';
import BalanceGauge from '../components/gauge';
const Balance = () => {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchCurrentBalance = useCallback(async () => {
        try {
            const response = await api.getBalance();
            setBalance(response.data);
        } catch (error) {
            console.error("Error fetching balance:", error);
        } finally {
            setLoading(false);
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

    const handler = () => fetchCurrentBalance();
    window.addEventListener('balanceUpdated', handler);


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
        <Grid container minHeight="100vh">
            {/* LEFT: Balance Section */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    display: 'flex',
                    borderRight: '1px solid #e0e0e0',
                    mr: 2
                }}
            >
                <Card elevation={3} sx={{ width: 420 }}>
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <Box sx={{ width: '100%', mb: 2 }}>
                            <BalanceGauge balance={balance} />
                        </Box>

                        <Typography variant="h4" sx={{ mt: 1, mb: 2 }}>
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


            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    display: 'flex',
                    width: '60%',
                }}
            >
                <Card elevation={2} sx={{ width: "100%" }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Profit & Loss
                        </Typography>

                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Today's P&L
                                </Typography>
                                <Typography variant="h6" color="success.main">
                                    +$1,245.50
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Unrealized P&L
                                </Typography>
                                <Typography variant="h6" color="error.main">
                                    -$320.75
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Total Return
                                </Typography>
                                <Typography variant="h6">
                                    +$924.75
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Balance;
