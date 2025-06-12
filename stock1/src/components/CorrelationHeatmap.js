import React, { useState } from 'react';
import { Box, Typography, Tooltip as MuiTooltip } from '@mui/material';
import { calculateAverage, calculateStandardDeviation } from '../utils/calculations';

const getColorForCorrelation = (correlation) => {
  if (isNaN(correlation)) return '#ccc'; // Grey for NaN
  // Scale correlation from -1 to 1 to a color range (e.g., red to green)
  // Example: Red for negative, White for 0, Green for positive
  const value = (correlation + 1) / 2; // Normalize to 0-1
  const red = Math.round(255 * (1 - value));
  const green = Math.round(255 * value);
  const blue = 0; // Keeping blue at 0 for red-green spectrum
  return `rgb(${red},${green},${blue})`;
};

function CorrelationHeatmap({ correlationMatrix, allStockData, timeframe }) {
  const [hoveredCell, setHoveredCell] = useState(null); // {rowTicker, colTicker}

  if (!correlationMatrix || correlationMatrix.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">
          No correlation data to display. Please select at least two stocks with available data.
        </Typography>
      </Box>
    );
  }

  const tickers = correlationMatrix.map((row) => row[0].ticker1); // Get the ordered list of tickers

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Stock Correlation Heatmap (Last {timeframe} mins)
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
        {/* Header Row for Tickers */}
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Box
            sx={{
              width: '100px', // For the empty top-left corner
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #eee',
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
            }}
          ></Box>
          {tickers.map((ticker) => (
            <Box
              key={`header-${ticker}`}
              sx={{
                minWidth: '100px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #eee',
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold',
              }}
            >
              <MuiTooltip
                title={
                  <Box>
                    <Typography variant="caption">Ticker: {ticker}</Typography>
                    {allStockData[ticker] && allStockData[ticker].length > 0 && (
                      <>
                        <Typography variant="caption">
                          Avg Price: $
                          {calculateAverage(allStockData[ticker].map((d) => d.price)).toFixed(2)}
                        </Typography>
                        <Typography variant="caption">
                          Std Dev: $
                          {calculateStandardDeviation(allStockData[ticker].map((d) => d.price)).toFixed(2)}
                        </Typography>
                      </>
                    )}
                  </Box>
                }
                arrow
              >
                <Typography variant="body2">{ticker}</Typography>
              </MuiTooltip>
            </Box>
          ))}
        </Box>

        {/* Data Rows */}
        {correlationMatrix.map((row, rowIndex) => (
          <Box key={`row-${rowIndex}`} sx={{ display: 'flex', flexDirection: 'row' }}>
            {/* Ticker label for the row */}
            <Box
              sx={{
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #eee',
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold',
              }}
            >
              <MuiTooltip
                title={
                  <Box>
                    <Typography variant="caption">Ticker: {row[0].ticker1}</Typography>
                    {allStockData[row[0].ticker1] && allStockData[row[0].ticker1].length > 0 && (
                      <>
                        <Typography variant="caption">
                          Avg Price: $
                          {calculateAverage(allStockData[row[0].ticker1].map((d) => d.price)).toFixed(2)}
                        </Typography>
                        <Typography variant="caption">
                          Std Dev: $
                          {calculateStandardDeviation(allStockData[row[0].ticker1].map((d) => d.price)).toFixed(2)}
                        </Typography>
                      </>
                    )}
                  </Box>
                }
                arrow
              >
                <Typography variant="body2">{row[0].ticker1}</Typography>
              </MuiTooltip>
            </Box>

            {/* Correlation Cells */}
            {row.map((cell, colIndex) => (
              <MuiTooltip
                key={`cell-${rowIndex}-${colIndex}`}
                title={
                  <Box>
                    <Typography variant="caption">
                      {cell.ticker1} vs {cell.ticker2}
                    </Typography>
                    <Typography variant="body2">
                      Correlation: {isNaN(cell.correlation) ? 'N/A' : cell.correlation.toFixed(4)}
                    </Typography>
                  </Box>
                }
                arrow
              >
                <Box
                  sx={{
                    minWidth: '100px',
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #eee',
                    backgroundColor: getColorForCorrelation(cell.correlation),
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredCell({ rowTicker: cell.ticker1, colTicker: cell.ticker2 })}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  <Typography variant="body2" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                    {isNaN(cell.correlation) ? 'N/A' : cell.correlation.toFixed(2)}
                  </Typography>
                </Box>
              </MuiTooltip>
            ))}
          </Box>
        ))}
      </Box>

      {/* Color Legend */}
      <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', width: '300px' }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Strong Negative
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            height: '20px',
            background: `linear-gradient(to right, rgb(255,0,0), rgb(127,127,0), rgb(0,255,0))`,
            border: '1px solid #ccc',
          }}
        />
        <Typography variant="body2" sx={{ ml: 1 }}>
          Strong Positive
        </Typography>
      </Box>
    </Box>
  );
}

export default CorrelationHeatmap;