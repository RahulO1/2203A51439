// src/components/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      sx={{
        width: '100%',
        py: 3,
        mt: 4, // Margin top to separate from main content
        backgroundColor: '#263238', // Dark grey background
        color: '#eceff1', // Light text color
        textAlign: 'center',
        borderRadius: '8px 8px 0 0', // Rounded top corners
      }}
    >
      <Typography variant="body2" component="p">
        © {new Date().getFullYear()} Stock Aggregation App. All rights reserved.
      </Typography>
      <Typography variant="caption" component="p" sx={{ mt: 0.5 }}>
        Data provided for educational purposes only.
      </Typography>
    </Box>
  );
}

export default Footer;