import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import StockChart from '../components/StockChart';
import { fetchStockPrices } from '../utils/api';
import { calculateAverage } from '../utils/calculations';

function StockPage() {
  const [stocks, setStocks] = useState({}); // To store all available stocks
  const [selectedStock, setSelectedStock] = useState('');
  const [timeframe, setTimeframe] = useState(60); // Default 60 minutes
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all available stocks on component mount
    const getStocks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://20.244.56.144/evaluation-service/stocks');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStocks(data.stocks);
        if (Object.keys(data.stocks).length > 0) {
          setSelectedStock(Object.values(data.stocks)[0]); // Select first stock by default
        }
      } catch (err) {
        setError('Failed to fetch available stocks. Please try again.');
        console.error('Error fetching stocks:', err);
      } finally {
        setLoading(false);
      }
    };
    getStocks();
  }, []);

  useEffect(() => {
    // Fetch stock prices when selectedStock or timeframe changes
    const getStockData = async () => {
      if (!selectedStock) return;

      setLoading(true);
      setError(null);
      try {
        const data = await fetchStockPrices(selectedStock, timeframe);
        setStockData(data);
      } catch (err) {
        setError(`Failed to fetch data for ${selectedStock}. Please try again.`);
        console.error('Error fetching stock data:', err);
        setStockData([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    };
    getStockData();
  }, [selectedStock, timeframe]);

  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
  };

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Stock Price Chart
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="stock-select-label">Select Stock</InputLabel>
        <Select
          labelId="stock-select-label"
          id="stock-select"
          value={selectedStock}
          label="Select Stock"
          onChange={handleStockChange}
          disabled={loading && Object.keys(stocks).length === 0}
        >
          {Object.entries(stocks).map(([name, ticker]) => (
            <MenuItem key={ticker} value={ticker}>
              {name} ({ticker})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="timeframe-select-label">Timeframe (minutes)</InputLabel>
        <Select
          labelId="timeframe-select-label"
          id="timeframe-select"
          value={timeframe}
          label="Timeframe (minutes)"
          onChange={handleTimeframeChange}
        >
          {[10, 30, 60, 120, 240, 480].map((m) => ( // Example timeframes
            <MenuItem key={m} value={m}>
              Last {m} minutes
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && stockData.length === 0 && selectedStock && (
        <Typography variant="body1" color="textSecondary">
          No data available for the selected stock and timeframe.
        </Typography>
      )}

      {!loading && !error && stockData.length > 0 && (
        <StockChart data={stockData} ticker={selectedStock} />
      )}
    </Box>
  );
}

export default StockPage;