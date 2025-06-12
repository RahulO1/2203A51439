import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import CorrelationHeatmap from '../components/CorrelationHeatmap';
// IMPORT fetchAllStocks and fetchStockPrices from your api utility file
import { fetchStockPrices, fetchAllStocks } from '../utils/api';
import {
  calculateCovariance,
  calculateStandardDeviation,
  calculatePearsonCorrelation,
} from '../utils/calculations';

function HeatmapPage() {
  const [stocks, setStocks] = useState({}); // To store all available stocks (name: ticker)
  const [timeframe, setTimeframe] = useState(60); // Default 60 minutes
  const [allStockData, setAllStockData] = useState({}); // {ticker: [priceData...]}
  const [correlationMatrix, setCorrelationMatrix] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTickers, setSelectedTickers] = useState([]); // User selected tickers for heatmap

  useEffect(() => {
    // Fetch all available stocks on component mount
    const getStocks = async () => {
      setLoading(true);
      setError(null); // Clear any previous errors
      try {
        // Use the centralized fetchAllStocks function
        const fetchedStocks = await fetchAllStocks();
        setStocks(fetchedStocks);
        // Pre-select a few stocks for demonstration initially, but ensure we don't try to slice more than available
        const tickersArray = Object.values(fetchedStocks);
        const initialTickers = tickersArray.slice(0, Math.min(tickersArray.length, 5));
        setSelectedTickers(initialTickers);
      } catch (err) {
        // Log the full error object for detailed debugging in console
        console.error('Error fetching initial stocks for heatmap:', err);
        // Provide a user-friendly error message
        setError(`Failed to fetch available stocks for heatmap: ${err.message || 'Network error or server issue'}. Please try again.`);
      } finally {
        setLoading(false);
      }
    };
    getStocks();
  }, []); // Empty dependency array means this runs once on component mount

  const fetchDataForSelectedStocks = useCallback(async () => {
    if (selectedTickers.length === 0) {
      setAllStockData({});
      setCorrelationMatrix([]);
      return;
    }

    setLoading(true);
    setError(null); // Clear any previous errors

    const dataPromises = selectedTickers.map((ticker) =>
      // Ensure fetchStockPrices is correctly implemented in utils/api.js
      fetchStockPrices(ticker, timeframe)
        .then((data) => ({ ticker, data }))
        .catch((err) => {
          // Catch errors for individual stock fetches and re-throw with ticker info
          const errorMessage = err.message || String(err);
          throw { ticker, message: errorMessage }; // Custom error object for Promise.allSettled
        })
    );

    try {
      const results = await Promise.allSettled(dataPromises);
      const fetchedData = {};
      const failedFetchesMessages = [];

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          fetchedData[result.value.ticker] = result.value.data;
        } else {
          // result.reason will be the custom error object thrown above
          const failedTicker = result.reason.ticker || 'unknown';
          const failedMessage = result.reason.message || 'unknown error';
          failedFetchesMessages.push(`Failed to fetch data for ${failedTicker}: ${failedMessage}`);
          console.warn(`Failed to fetch data for ${failedTicker}:`, result.reason);
        }
      });
      setAllStockData(fetchedData);

      if (failedFetchesMessages.length > 0) {
        setError(`Some stock data failed to load: ${failedFetchesMessages.join('; ')}`);
      } else {
        setError(null); // Clear error if all data fetched successfully
      }

    } catch (err) {
      // This catch would be for unexpected errors during Promise.allSettled itself
      console.error('Unexpected error during batch stock data fetch:', err);
      setError('An unexpected error occurred while fetching stock data for heatmap calculations.');
      setAllStockData({});
    } finally {
      setLoading(false);
    }
  }, [selectedTickers, timeframe]);

  useEffect(() => {
    fetchDataForSelectedStocks();
  }, [fetchDataForSelectedStocks]);

  useEffect(() => {
    // Calculate correlation matrix
    if (Object.keys(allStockData).length < 2) {
      setCorrelationMatrix([]);
      return;
    }

    const tickers = Object.keys(allStockData);
    const matrix = [];

    // Filter out stocks with insufficient data for calculation (need at least 2 points)
    const validTickers = tickers.filter(ticker => allStockData[ticker] && allStockData[ticker].length >= 2);

    if (validTickers.length < 2) {
      // If after filtering, we have less than 2 valid tickers, can't form a matrix
      setCorrelationMatrix([]);
      return;
    }

    validTickers.forEach((ticker1, i) => {
      const row = [];
      validTickers.forEach((ticker2, j) => {
        if (i === j) {
          row.push({ ticker1, ticker2, correlation: 1 }); // Correlation with itself is 1
        } else {
          const prices1 = allStockData[ticker1].map((d) => d.price);
          const prices2 = allStockData[ticker2].map((d) => d.price);

          // To calculate correlation, the arrays must be of the same length
          // This is a simplification; a more robust solution would align timestamps.
          // For now, we take the minimum length to avoid errors.
          const minLength = Math.min(prices1.length, prices2.length);
          const alignedPrices1 = prices1.slice(0, minLength);
          const alignedPrices2 = prices2.slice(0, minLength);

          if (minLength >= 2) { // Need at least 2 data points for std dev/covariance (n-1 denominator)
            const covariance = calculateCovariance(alignedPrices1, alignedPrices2);
            const stdDev1 = calculateStandardDeviation(alignedPrices1);
            const stdDev2 = calculateStandardDeviation(alignedPrices2);

            let correlation;
            if (stdDev1 === 0 || stdDev2 === 0) {
                // If one stock has no variance, correlation is often undefined or 0 depending on context
                // For a heatmap, 0 or NaN might be appropriate. Let's use 0 for visualization.
                correlation = 0; // Or NaN if you want to visually distinguish "no variance"
            } else {
                correlation = calculatePearsonCorrelation(
                    covariance,
                    stdDev1,
                    stdDev2
                );
                // Clamp correlation to [-1, 1] due to potential floating point inaccuracies
                if (correlation > 1) correlation = 1;
                if (correlation < -1) correlation = -1;
            }

            row.push({ ticker1, ticker2, correlation });
          } else {
            row.push({ ticker1, ticker2, correlation: NaN }); // Not enough data for calculation
          }
        }
      });
      matrix.push(row);
    });
    setCorrelationMatrix(matrix);
  }, [allStockData]);


  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  const handleTickerSelectionChange = (event) => {
    setSelectedTickers(event.target.value);
  };


  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Correlation Heatmap
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="timeframe-select-label">Timeframe (minutes)</InputLabel>
        <Select
          labelId="timeframe-select-label"
          id="timeframe-select"
          value={timeframe}
          label="Timeframe (minutes)"
          onChange={handleTimeframeChange}
        >
          {[10, 30, 60, 120, 240, 480].map((m) => (
            <MenuItem key={m} value={m}>
              Last {m} minutes
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="tickers-select-label">Select Tickers</InputLabel>
        <Select
          labelId="tickers-select-label"
          id="tickers-select"
          multiple
          value={selectedTickers}
          onChange={handleTickerSelectionChange}
          renderValue={(selected) => selected.join(', ')}
          label="Select Tickers"
          // Disable selection if loading and no stocks are loaded yet
          disabled={loading && Object.keys(stocks).length === 0}
        >
          {/* Ensure stocks are loaded before mapping */}
          {Object.entries(stocks).map(([name, ticker]) => (
            <MenuItem key={ticker} value={ticker}>
              {name} ({ticker})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Loading and Error Indicators */}
      {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
      {error && <Alert severity="error">{error}</Alert>}

      {/* No Data Message */}
      {!loading && !error && correlationMatrix.length === 0 && selectedTickers.length > 0 && (
        <Typography variant="body1" color="textSecondary">
          Not enough data or tickers selected to compute correlation heatmap. Please select at least two tickers and ensure data availability.
        </Typography>
      )}
      {!loading && !error && Object.keys(stocks).length === 0 && (
          <Typography variant="body1" color="textSecondary">
              No stocks available to select. Please check API connectivity.
          </Typography>
      )}

      {/* Heatmap Display */}
      {!loading && !error && correlationMatrix.length > 0 && (
        <CorrelationHeatmap
          correlationMatrix={correlationMatrix}
          allStockData={allStockData}
          timeframe={timeframe}
        />
      )}
    </Box>
  );
}

export default HeatmapPage;