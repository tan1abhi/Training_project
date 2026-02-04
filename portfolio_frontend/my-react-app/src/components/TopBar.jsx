import React, { useState, useEffect, useCallback } from 'react';
import { AppBar, Toolbar, Typography, Box, CircularProgress } from '@mui/material';
import { api } from '../services/api';

const TopBar = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  
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

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        height: '10vh',
        justifyContent: 'center',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#1976d2' 
      }}
    >
      <Toolbar sx={{ height: '10vh', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          WealthMonitor Dashboard
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            px: 2, 
            py: 1, 
            borderRadius: 2 
          }}
        >
          <Typography variant="body1" sx={{ mr: 1, opacity: 0.9 }}>
            Available Balance:
          </Typography>
          
          {loading && balance === null ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              ${balance?.toLocaleString(undefined, { 
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