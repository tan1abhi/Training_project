import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import AssetRiskContributionGraph from "./AssetRiskContributionGraph";
import WeightVsRiskGraph from "./WeightVsRiskGraph";
import MonteCarloGraph from "./MonteCarloGraph";

const TOTAL_PAGES = 3;

const RiskGraphsDialog = ({ open, setOpen, riskData }) => {
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (open) setPage(0);
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            Portfolio Risk Analysis
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Graph {page + 1} of {TOTAL_PAGES}
          </Typography>
        </Box>

        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{
          maxHeight: '80vh',
          overflowY: 'auto',
          px: 3,
          py: 2
        }}
      >
        {!riskData ? (
          <Typography color="text.secondary" align="center">
            No risk data available.
          </Typography>
        ) : (
          <Box sx={{ width: '100%' }}>
            {page === 0 && (
              <AssetRiskContributionGraph
                perAssetRisk={riskData.per_asset_risk}
              />
            )}

            {page === 1 && (
              <WeightVsRiskGraph
                perAssetRisk={riskData.per_asset_risk}
              />
            )}

            {page === 2 && (
              <MonteCarloGraph
                monteCarlo={riskData.portfolio_risk.monte_carlo}
              />
            )}
          </Box>
        )}
      </DialogContent>

      <Divider />

      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {page === 0 && "Asset-wise Risk Contribution"}
          {page === 1 && "Weight vs Risk Contribution"}
          {page === 2 && "Monte Carlo Scenarios"}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </Button>

          <Button
            size="small"
            variant="contained"
            disabled={page === TOTAL_PAGES - 1}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default RiskGraphsDialog;
