import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  Chip,
  Stack,
  Button
} from '@mui/material';
import { Bar, Chart } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, TimeScale } from "chart.js";
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, TimeScale, CandlestickController, CandlestickElement);

const RiskEngine = () => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showGraph, setShowGraph] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [candlestickData, setCandlestickData] = useState(null);

  const handleStockClick = async (stock) => {
    setSelectedStock(stock);
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/stocks/${stock.symbol}/candlestick`);
      if (!response.ok) {
        throw new Error('Failed to fetch candlestick data');
      }
      const data = await response.json();
      setCandlestickData(data);
    } catch (error) {
      console.error('Error fetching candlestick data:', error);
      setError('Failed to load candlestick data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/risk-analysis');
        if (!response.ok) {
          throw new Error('Failed to fetch risk analysis data');
        }
        const data = await response.json();
        setRiskData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching risk data:', error);
        setError('Failed to load risk analysis data');
      } finally {
        setLoading(false);
      }
    };

    fetchRiskData();
  }, []);

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        p: 3,
        boxSizing: 'border-box'
      }}
    >
      <Grid container spacing={3} sx={{ height: '100%', width: '100%' }}>
      
        <Grid item xs={12} md={4} sx={{ height: '90%', width: '25%' }}>
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

            
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {loading && (
                <Stack alignItems="center" mt={4}>
                  <CircularProgress size={28} />
                </Stack>
              )}

              {error && (
                <Typography color="error">
                  {error}
                </Typography>
              )}

              {riskData && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Portfolio Assets
                  </Typography>

                  <Stack spacing={1}>
                    {riskData.assets.map((asset) => (
                      <Paper
                        key={asset.symbol}
                        variant="outlined"
                        sx={{
                          p: 1,
                          display: 'flex',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: 'action.hover' }
                        }}
                        onClick={() => handleStockClick(asset)}
                      >
                        <Typography>{asset.symbol}</Typography>
                        <Chip
                          label={asset.risk}
                          size="small"
                          color={
                            asset.risk === 'HIGH'
                              ? 'error'
                              : asset.risk === 'MEDIUM'
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
          </Paper>
        </Grid>

       
        <Grid item xs={12} md={8} sx={{ height: '90%', width: '65%' }}>
          <Paper
            elevation={1}
            sx={{
              height: '100%',
              width: '100%',
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <CircularProgress />
              </Box>
            )}

            {selectedStock && candlestickData && (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5">
                    📈 {selectedStock.symbol} Price Trend
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedStock(null);
                      setCandlestickData(null);
                    }}
                  >
                    Back to Risk View
                  </Button>
                </Box>

                <Box sx={{ 
                  flex: 1, 
                  minHeight: 400, 
                  p: 2,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e9ecef'
                }}>
                  <Chart
                    key={`candlestick-${selectedStock.symbol}`}
                    type='candlestick'
                    data={{
                      datasets: [{
                        label: `${selectedStock.symbol} Price`,
                        data: candlestickData.map(d => ({
                          x: d.x,
                          o: d.o,
                          h: d.h,
                          l: d.l,
                          c: d.c
                        })),
                        color: {
                          up: '#26a69a',
                          down: '#ef5350',
                          unchanged: '#26a69a',
                        },
                        borderColor: {
                          up: '#26a69a',
                          down: '#ef5350',
                          unchanged: '#26a69a',
                        },
                        borderWidth: 2,
                        borderSkipped: false,
                        borderRadius: 2,
                      }],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      animation: {
                        duration: 1000,
                        easing: 'easeInOutQuart'
                      },
                      hover: {
                        mode: 'nearest',
                        intersect: false
                      },
                      layout: {
                        padding: {
                          top: 20,
                          bottom: 20,
                          left: 20,
                          right: 20
                        }
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                        title: {
                          display: true,
                          text: `${selectedStock.symbol} Candlestick Chart (Last 20 Days)`,
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleColor: '#fff',
                          bodyColor: '#fff',
                          borderColor: '#fff',
                          borderWidth: 1,
                          cornerRadius: 8,
                          displayColors: false,
                          callbacks: {
                            title: function(context) {
                              const date = new Date(context[0].raw.x);
                              return date.toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              });
                            },
                            label: function(context) {
                              const data = context.raw;
                              const change = data.c - data.o;
                              const changePercent = ((change / data.o) * 100).toFixed(2);
                              return [
                                `Open: $${data.o.toFixed(2)}`,
                                `High: $${data.h.toFixed(2)}`,
                                `Low: $${data.l.toFixed(2)}`,
                                `Close: $${data.c.toFixed(2)}`,
                                `Change: ${change >= 0 ? '+' : ''}$${change.toFixed(2)} (${changePercent}%)`
                              ];
                            }
                          }
                        },
                      },
                      scales: {
                        x: {
                          type: 'time',
                          time: {
                            unit: 'day',
                            displayFormats: {
                              day: 'MMM dd'
                            }
                          },
                          title: {
                            display: true,
                            text: 'Date'
                          },
                          grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Price ($)'
                          },
                          grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                          },
                          ticks: {
                            callback: function(value) {
                              return '$' + value.toFixed(2);
                            }
                          }
                        }
                      }
                    }}
                  />
                </Box>

                <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Stock:</strong> {selectedStock.symbol} |
                    <strong> Name:</strong> {selectedStock.name} |
                    <strong> Risk Level:</strong>
                    <Chip
                      label={selectedStock.risk}
                      size="small"
                      color={
                        selectedStock.risk === 'HIGH'
                          ? 'error'
                          : selectedStock.risk === 'MEDIUM'
                          ? 'warning'
                          : 'success'
                      }
                      sx={{ mx: 0.5, fontSize: '0.7rem', height: '18px' }}
                    /> |
                    <strong> Current Price:</strong> <span style={{ color: '#26a69a', fontWeight: 'bold' }}>${selectedStock.price?.toFixed(2)}</span> |
                    <strong> Change:</strong> <span style={{ color: selectedStock.change >= 0 ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                      {selectedStock.change >= 0 ? '+' : ''}${selectedStock.change?.toFixed(2)} ({selectedStock.changePercent?.toFixed(2)}%)
                    </span> |
                    <strong> Volatility:</strong> {(selectedStock.volatility * 100)?.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <strong>📊 Technical Analysis:</strong> Candlestick chart shows price movements over the last 20 trading days.
                    <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: '#26a69a', borderRadius: 0.5 }}></Box>
                        <Typography variant="caption">Bullish (Price Up)</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: '#ef5350', borderRadius: 0.5 }}></Box>
                        <Typography variant="caption">Bearish (Price Down)</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 2, height: 12, backgroundColor: '#666' }}></Box>
                        <Typography variant="caption">Wicks (High/Low Range)</Typography>
                      </Box>
                    </Box>
                  </Typography>
                </Box>
              </Box>
            )}

            {riskData && !showGraph && !selectedStock && (
              <Box sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h4" gutterBottom>
                  Portfolio Risk
                </Typography>

                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    color:
                      riskData.risk === 'HIGH'
                        ? 'error.main'
                        : riskData.risk === 'MEDIUM'
                        ? 'warning.main'
                        : 'success.main',
                    mb: 2
                  }}
                >
                  {riskData.risk}
                </Typography>

                <Typography variant="body1" color="text.secondary" mb={3}>
                  Total Portfolio Value: <strong>${riskData.totalValue?.toFixed(2)}</strong> |
                  Volatility Ratio: <strong>{riskData.volatilityRatio?.toFixed(3)}</strong>
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setShowGraph(true)}
                  sx={{ mt: 2 }}
                >
                  Visualize Risk Data
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Click on any stock in the left panel to view its price trend
                </Typography>              </Box>
            )}

            {riskData && showGraph && !selectedStock && (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5">
                    Risk Analysis Graph
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setShowGraph(false)}
                  >
                    Back to Summary
                  </Button>
                </Box>

                <Box sx={{ flex: 1, minHeight: 400, p: 2 }}>
                  <Bar
                    key="risk-distribution-chart"
                    data={{
                      labels: ['Risk Distribution'],
                      datasets: [
                        {
                          label: 'Low Risk Assets',
                          data: [riskData.assets.filter(asset => asset.risk === 'LOW').length],
                          backgroundColor: '#4caf50',
                          borderColor: '#388e3c',
                          borderWidth: 1,
                        },
                        {
                          label: 'Medium Risk Assets',
                          data: [riskData.assets.filter(asset => asset.risk === 'MEDIUM').length],
                          backgroundColor: '#ff9800',
                          borderColor: '#f57c00',
                          borderWidth: 1,
                        },
                        {
                          label: 'High Risk Assets',
                          data: [riskData.assets.filter(asset => asset.risk === 'HIGH').length],
                          backgroundColor: '#f44336',
                          borderColor: '#d32f2f',
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: 'Portfolio Risk Distribution',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Number of Assets'
                          }
                        },
                        x: {
                          title: {
                            display: true,
                            text: 'Risk Categories'
                          }
                        }
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Overall Risk Level:</strong> {riskData.risk} |
                    <strong> Volatility Ratio:</strong> {riskData.volatilityRatio?.toFixed(3)} |
                    <strong> Total Portfolio Value:</strong> ${riskData.totalValue?.toFixed(2)} |
                    <strong> Total Assets:</strong> {riskData.assets?.length}
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RiskEngine;
