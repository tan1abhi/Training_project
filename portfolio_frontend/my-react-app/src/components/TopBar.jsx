import React, { useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CircularProgress,
  Divider
} from '@mui/material';
import { api } from '../services/api';

const TopBar = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentBalance = useCallback(async () => {
    try {
      const response = await api.getBalance();
      setBalance(response.data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentBalance();
    window.addEventListener('balanceUpdated', fetchCurrentBalance);
    const interval = setInterval(fetchCurrentBalance, 500);

    return () => {
      window.removeEventListener('balanceUpdated', fetchCurrentBalance);
      clearInterval(interval);
    };
  }, [fetchCurrentBalance]);

  const balanceColor =
    balance > 0 ? 'success.main' : 'error.main';

  return (
 <AppBar
  position="fixed"
  elevation={0}
  sx={{
    height: 72,
    justifyContent: 'center',
    zIndex: (theme) => theme.zIndex.drawer + 1,

    
    backgroundColor: '#4f83cc',
    color: '#ffffff',

    borderBottom: '1px solid',
    borderColor: 'rgba(255,255,255,0.25)'
  }}
>
  <Toolbar sx={{ height: 72 }}>
    
    <Box sx={{ flexGrow: 1 }}>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ color: '#ffffff' }}
      >
        WealthMonitor
      </Typography>

      <Typography
        variant="caption"
        sx={{ color: 'rgba(255,255,255,0.85)' }}
      >
        Hi Sumeet — welcome aboard!
      </Typography>
    </Box>

    <Divider
      orientation="vertical"
      flexItem
      sx={{ mx: 3, borderColor: 'rgba(255,255,255,0.35)' }}
    />

   
    <Box sx={{ textAlign: 'right' }}>
      <Typography
        variant="caption"
        sx={{ display: 'block', color: 'rgba(255,255,255,0.85)' }}
      >
        Available Balance
      </Typography>

      {loading && balance === null ? (
        <CircularProgress size={18} sx={{ color: '#ffffff' }} />
      ) : (
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: '#ffffff' }}
        >
          $
          {balance?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </Typography>
      )}
    </Box>
  </Toolbar>
</AppBar>

  );
};

export default TopBar;
