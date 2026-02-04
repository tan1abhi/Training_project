import { Box, Grid, Paper, Typography } from '@mui/material';

const BrowseStocks = () => {
  return (
    <Box
  sx={{
    height: '100%',
    width: '100%',
    p: 3,
    boxSizing: 'border-box'
  }}
>
  <Grid
    container
    spacing={3}
    sx={{ height: '100%', width: '100%' }}
  >
    {/* LEFT SECTION — 30% (Stock List) */}
    <Grid item xs={12} md={4} sx={{ height: '100%', width : '25%' }}>
      <Paper
        elevation={1}
        sx={{
          height: '100%',
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Stock List
        </Typography>

        {/* Scrollable List Area */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <Typography variant="body2" color="text.secondary">
            Stock list 
          </Typography>
        </Box>
      </Paper>
    </Grid>

    {/* RIGHT SECTION — 70% */}
    <Grid item xs={12} md={8} sx={{ height: '100%' , width : '65%' }}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {/* BUY — 70% */}
        <Paper
          elevation={1}
          sx={{
            flexGrow: 7,
            p: 2
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add stocks
          </Typography>
        </Paper>

        {/* SELL — 30% */}
        <Paper
          elevation={1}
          sx={{
            flexGrow: 3,
            p: 2
          }}
        >
          <Typography variant="h6" gutterBottom>
            remove stocks
          </Typography>
        </Paper>
      </Box>
    </Grid>
  </Grid>
</Box>

  );
};

export default BrowseStocks;