import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const TopBar = () => {
  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        height: '10vh',
        justifyContent: 'center',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ height: '10vh', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Portfolio Dashboard
        </Typography>
        <Box>
          <Typography variant="body1">Balance: $12,345.67</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;