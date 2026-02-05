import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  Chip,
  Button,

} from '@mui/material';

import RiskGraphsDialog from '../components/RiskGraphDialog';

const RiskEngine = () => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [openGraphsDialog, setOpenGraphsDialog] = useState(false);


  useEffect(() => {
    const fetchRiskData = () => {
      fetch('http://localhost:4000/api/portfolio/risk')
        .then((res) => {
          if (!res.ok) throw new "";
          return res.json();
        })
        .then((data) => {
          setRiskData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    };

    fetchRiskData();
    const intervalId = setInterval(fetchRiskData, 60000);

    return () => clearInterval(intervalId);
  }, []);



  const filteredAssets = React.useMemo(() => {
    if (!riskData?.per_asset_risk) return [];

    if (filter === 'all') return riskData.per_asset_risk;

    return riskData.per_asset_risk.filter(
      (asset) => asset.risk_label?.toLowerCase() === filter
    );
  }, [riskData, filter]);



  return (
    <Box sx={{ height: '100%', p: 3 }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>

        <Grid item xs={12} md={4} sx={{ height: '100%', width: '30%', pr: 1 }}>
          <Paper
            elevation={1}
            sx={{
              height: '100%',
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >

            <TextField
              select
              fullWidth
              size="small"
              label="Filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="low">Low Risk</MenuItem>
              <MenuItem value="medium">Medium Risk</MenuItem>
              <MenuItem value="high">High Risk</MenuItem>
            </TextField>

            <Box
              sx={{
                height: '70%',
                overflowY: 'auto',
                pr: 1,
                pb: 4,
                borderRadius: 1
              }}
            >
              {loading && (
                <Stack alignItems="center" mt={4}>
                  <CircularProgress size={28} />
                </Stack>
              )}

              {error && <Typography color="error">{error}</Typography>}

              {riskData && (
                <>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Portfolio Assets
                  </Typography>

                  <Stack spacing={1}>
                    {filteredAssets.map((asset) => (
                      <Paper
                        key={asset.ticker}
                        variant="outlined"
                        sx={{
                          p: 1,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >

                        <Typography fontWeight={600}>
                          {asset.ticker}
                        </Typography>


                        <Typography color="text.secondary">
                          Contribution: {(asset.risk_contribution * 100).toFixed(1)}%
                        </Typography>


                        <Chip
                          label={asset.risk_label}
                          size="small"
                          color={
                            asset.risk_label === 'HIGH'
                              ? 'error'
                              : asset.risk_label === 'MEDIUM'
                                ? 'warning'
                                : 'success'
                          }
                        />
                      </Paper>
                    ))}
                  </Stack>
                </>
              )}
            </Box>



            <Button
              variant="contained"
              fullWidth
              onClick={() => setOpenGraphsDialog(true)}
            >
              Show Graphs
            </Button>

          </Paper>
        </Grid>


        <Grid item xs={12} md={8} sx={{ height: '100%', width: '65%' }}>
          <Paper
            elevation={1}
            sx={{
              height: '100%',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {loading && <CircularProgress />}

            {riskData && (
              <>
                <Typography variant="h4" gutterBottom>
                  Overall Risk
                </Typography>

                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    color:
                      riskData.risk_level === 'HIGH'
                        ? 'error.main'
                        : riskData.risk_level === 'MEDIUM'
                          ? 'warning.main'
                          : 'success.main'
                  }}
                >
                  {riskData.portfolio_risk?.risk_level}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  mt={2}
                >
                  Volatility Ratio:{' '}
                  <strong>{riskData.portfolio_risk?.volatility_ratio}</strong>
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={3}
                  align="center"
                >
                  {riskData.portfolio_risk?.investor_summary}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

      </Grid>

      <RiskGraphsDialog open={openGraphsDialog} setOpen={setOpenGraphsDialog} riskData={riskData} />
    </Box>
  );
};

export default RiskEngine;
