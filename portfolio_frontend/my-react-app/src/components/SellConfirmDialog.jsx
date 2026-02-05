import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

const SellConfirmDialog = ({ open, onClose, onConfirm, data }) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Confirm Sell Order</DialogTitle>

      <DialogContent dividers>
        <Typography>
          <b>Ticker:</b> {data.ticker}
        </Typography>

        <Typography>
          <b>Quantity:</b> {data.qty}
        </Typography>

        <Typography color="warning.main" sx={{ mt: 2 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Confirm Sell
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default SellConfirmDialog;   