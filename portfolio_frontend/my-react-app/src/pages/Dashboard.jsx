import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  PieChart,
  FilterList,
  ShowChart,
  AccountBalanceWallet,
  Analytics
} from '@mui/icons-material';
import StockPriceChart from '../components/StockPriceChart';


const Dashboard = () => {
  const sampleStockData = [
    { time: "2024-01-01", open: 100, high: 120, low: 90, close: 110 },
    { time: "2024-01-02", open: 110, high: 130, low: 105, close: 125 },
    { time: "2024-01-03", open: 120, high: 140, low: 110, close: 135 },
    { time: "2024-01-04", open: 130, high: 150, low: 120, close: 145 },
  ];

  const samplePortfolio = [
    { stock: "AAPL", amount: 5000 },
    { stock: "GOOGL", amount: 3000 },
    { stock: "MSFT", amount: 4000 },
    { stock: "TSLA", amount: 2000 },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 3,
        boxSizing: 'border-box'
      }}
    >
      
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h3"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 1,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          📊 Portfolio Analytics Dashboard
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center'
          }}
        >
          Real-time insights into your investment portfolio
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{ height: 'calc(100vh - 200px)' }}
      >
       
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <Card
            elevation={3}
            sx={{
              height: '100%',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CardContent sx={{ p: 3, pb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FilterList sx={{ mr: 1, color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Portfolio Filters
                </Typography>
              </Box>

              <TextField
                select
                fullWidth
                size="small"
                label="Filter by Sector"
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              >
                <MenuItem value="all">All Sectors</MenuItem>
                <MenuItem value="tech">Technology</MenuItem>
                <MenuItem value="finance">Finance</MenuItem>
                <MenuItem value="healthcare">Healthcare</MenuItem>
                <MenuItem value="energy">Energy</MenuItem>
              </TextField>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Analytics sx={{ mr: 1, color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Top Holdings
                </Typography>
              </Box>
            </CardContent>

            
            <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 3, pb: 3 }}>
              <List sx={{ p: 0 }}>
                <ListItem sx={{
                  borderRadius: 2,
                  mb: 1,
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #e8f4fd 0%, #b8d4f0 100%)' }
                }}>
                  <ListItemIcon>
                    <TrendingUp sx={{ color: '#4caf50' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>AAPL</Typography>}
                    secondary="Apple Inc."
                  />
                  <Chip label="$5,000" size="small" sx={{ background: '#4caf50', color: 'white' }} />
                </ListItem>

                <ListItem sx={{
                  borderRadius: 2,
                  mb: 1,
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #e8f4fd 0%, #b8d4f0 100%)' }
                }}>
                  <ListItemIcon>
                    <TrendingUp sx={{ color: '#2196f3' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>GOOGL</Typography>}
                    secondary="Alphabet Inc."
                  />
                  <Chip label="$3,000" size="small" sx={{ background: '#2196f3', color: 'white' }} />
                </ListItem>

                <ListItem sx={{
                  borderRadius: 2,
                  mb: 1,
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #e8f4fd 0%, #b8d4f0 100%)' }
                }}>
                  <ListItemIcon>
                    <TrendingUp sx={{ color: '#ff9800' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>MSFT</Typography>}
                    secondary="Microsoft Corp."
                  />
                  <Chip label="$4,000" size="small" sx={{ background: '#ff9800', color: 'white' }} />
                </ListItem>

                <ListItem sx={{
                  borderRadius: 2,
                  mb: 1,
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #e8f4fd 0%, #b8d4f0 100%)' }
                }}>
                  <ListItemIcon>
                    <TrendingUp sx={{ color: '#e91e63' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>TSLA</Typography>}
                    secondary="Tesla Inc."
                  />
                  <Chip label="$2,000" size="small" sx={{ background: '#e91e63', color: 'white' }} />
                </ListItem>
              </List>
            </Box>
          </Card>
        </Grid>

        
        <Grid item xs={12} md={8} sx={{ height: '100%' }}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>

           
            <Card
              elevation={3}
              sx={{
                flex: 1,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ShowChart sx={{ mr: 1, color: '#667eea' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                    Stock Price Trends
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  Real-time price movements for your portfolio stocks
                </Typography>
              </CardContent>
              <Box sx={{ flex: 1, px: 3, pb: 3, overflow: 'hidden' }}>
                <StockPriceChart data={sampleStockData} />
              </Box>
            </Card>

           
            <Card
              elevation={3}
              sx={{
                flex: 1,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PieChart sx={{ mr: 1, color: '#667eea' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                    Portfolio Distribution
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  Asset allocation breakdown by investment amount
                </Typography>
              </CardContent>
              <Box sx={{ flex: 1, px: 3, pb: 3, overflow: 'hidden' }}>
                <PortfolioPieChart data={samplePortfolio} />
              </Box>
            </Card>

          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
