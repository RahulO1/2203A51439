import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { calculateAverage } from '../utils/calculations';

function StockChart({ data, ticker }) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">No data to display for {ticker}.</Typography>
      </Box>
    );
  }

  // Pre-process data for charting
  const formattedData = data.map((item) => ({
    price: item.price,
    timestamp: new Date(item.lastUpdatedAt).toLocaleTimeString(), // Format for X-axis
    fullTimestamp: item.lastUpdatedAt, // Keep original for tooltip
  }));

  const averagePrice = calculateAverage(data.map((d) => d.price));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const price = payload[0].value;
      const originalItem = data.find(
        (item) =>
          new Date(item.lastUpdatedAt).toLocaleTimeString() === label &&
          item.price === price
      );

      return (
        <Box
          sx={{
            p: 1,
            border: '1px solid #ccc',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <Typography variant="body2">Time: {label}</Typography>
          <Typography variant="body2">Price: ${price.toFixed(2)}</Typography>
          {originalItem && (
            <Typography variant="body2">
              Updated At: {new Date(originalItem.lastUpdatedAt).toLocaleString()}
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {ticker} Stock Price
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <ReferenceLine
            y={averagePrice}
            label={{
              position: 'right',
              value: `Avg: $${averagePrice.toFixed(2)}`,
              fill: '#82ca9d',
            }}
            stroke="#82ca9d"
            strokeDasharray="3 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default StockChart;