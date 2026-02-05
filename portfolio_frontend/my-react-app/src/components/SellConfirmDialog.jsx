import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography, 
  Box
} from '@mui/material';

const SellConfirmDialog = ({ open, onClose, onConfirm, data }) => {
  if (!data) return null;

  return (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
  <DialogTitle sx={{ pb: 1 }}>
    <Typography variant="subtitle1" fontWeight={600}>
      Confirm Sell Order
    </Typography>
    <Typography variant="caption" color="text.secondary">
      Please review the details before confirming
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

    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary">
        Quantity
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        {data.qty}
      </Typography>
    </Box>

   
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ mt: 2, lineHeight: 1.5 }}
    >
      Once confirmed, this action cannot be undone.
    </Typography>
  </DialogContent>

  <DialogActions sx={{ px: 3, py: 2 }}>
    <Button onClick={onClose} color="inherit">
      Back
    </Button>

    <Button
      onClick={onConfirm}
      variant="contained"
      color="error"
    >
      Confirm Sell
    </Button>
  </DialogActions>
</Dialog>

  );
};
export default SellConfirmDialog;   