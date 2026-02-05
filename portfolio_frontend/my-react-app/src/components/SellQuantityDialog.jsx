import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography
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
      <DialogTitle>Sell Quantity</DialogTitle>

      <DialogContent dividers>
        <Typography gutterBottom>
          Ticker: <b>{data.ticker}</b>
        </Typography>

        <TextField
          autoFocus
          fullWidth
          label={`Quantity (Max ${data.maxQuantity})`}
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          error={!!error}
          helperText={error}
          inputProps={{
            min: 1,
            max: data.maxQuantity
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleNext} variant="contained">
          Next
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SellQuantityDialog;
