import React from 'react';
import { Box, Typography, Button } from '@mui/material'; // Import Button component
import { Link } from 'react-router-dom'; // Import Link component

function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 64px)', // Adjust for AppBar height
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" color="primary" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" color="textSecondary">
        The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" sx={{ mt: 3 }} component={Link} to="/">
        Go to Home
      </Button>
    </Box>
  );
}

export default NotFound;