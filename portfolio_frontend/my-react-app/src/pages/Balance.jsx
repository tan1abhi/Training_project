import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Stack
} from '@mui/material';
import { api } from '../services/api'; 
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
    <Card elevation={3} sx={{ maxWidth: 420 }}>
      <CardContent>
    
        <Typography variant="caption" color="text.secondary">
          Available Balance
        </Typography>

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
          <Stack spacing={2} mt={2}>
            <TextField
              label="Amount"
              type="number"
              size="small"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputProps={{ min: 1 }}
              fullWidth
            />

            <Stack direction="row" spacing={1}>
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
  );
};

export default Balance;
