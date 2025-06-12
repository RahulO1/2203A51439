// src/components/HeroSection.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link for navigation

function HeroSection() {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '300px', // A decent height for a hero section
        backgroundColor: '#e3f2fd', // Light blue background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        mb: 4, // Margin bottom to separate from main content
        borderRadius: 2, // Rounded corners
        boxShadow: 3, // Subtle shadow
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#1a237e' }}>
        Real-time Stock Insights
      </Typography>
      <Typography variant="h6" color="textSecondary" sx={{ mb: 3, maxWidth: '800px' }}>
        Track stock prices, analyze historical data, and visualize correlations with our powerful aggregation platform.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        component={Link}
        to="/heatmap" // Directs to the correlation heatmap
        sx={{
          mt: 2,
          '&:hover': {
            backgroundColor: '#0d47a1', // Darker blue on hover
          },
        }}
      >
        Explore Correlations
      </Button>
    </Box>
  );
}

export default HeroSection;