import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography, Box
} from '@mui/material';
import { useState, useEffect } from 'react';

const SellQuantityDialog = ({ open, onClose, onNext, data }) => {
  const [qty, setQty] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && data?.maxQuantity) {
      setQty(data.maxQuantity);
      setError('');
    }
  }, [open, data]);

  const handleNext = () => {
    const value = Number(qty);

    if (!Number.isInteger(value) || value <= 0 || value > data.maxQuantity) {
      setError(`Enter a value between 1 and ${data.maxQuantity}`);
      return;
    }

    onNext(value);
  };

  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
  <DialogTitle sx={{ pb: 1 }}>
    <Typography variant="subtitle1" fontWeight={600}>
      Sell Asset
    </Typography>
    <Typography variant="caption" color="text.secondary">
      Review quantity before proceeding
    </Typography>
  </DialogTitle>

  <DialogContent dividers sx={{ pt: 2 }}>
    
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary">
        Ticker
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        {data.ticker}
      </Typography>
    </Box>

    
    <TextField
      autoFocus
      fullWidth
      label="Quantity to sell"
      type="number"
      value={qty}
      onChange={(e) => setQty(e.target.value)}
      error={!!error}
      helperText={
        error || `You can sell up to ${data.maxQuantity} units`
      }
      inputProps={{
        min: 1,
        max: data.maxQuantity
      }}
    />
  </DialogContent>

  <DialogActions sx={{ px: 3, py: 2 }}>
    <Button onClick={onClose} color="inherit">
      Cancel
    </Button>
    <Button
      onClick={handleNext}
      variant="contained"
      color="error"
      disabled={!qty || Number(qty) <= 0}
    >
      Continue
    </Button>
  </DialogActions>
</Dialog>

  );
};

export default SellQuantityDialog;
