import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material'; // Import Container for content width
import StockPage from './pages/StockPage';
import HeatmapPage from './pages/HeatmapPage';
import NotFound from './pages/NotFound';
import HeroSection from './components/HeroSection'; // Import the new HeroSection
import Footer from './components/Footer';       // Import the new Footer

function App() {
  return (
    <Router>
      {/* Navbar (AppBar) */}
      <AppBar position="static" sx={{ backgroundColor: '#2196f3' }}> {/* Brighter blue for AppBar */}
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Stock Aggregation App
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit" component={Link} to="/" sx={{ mx: 1, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
              Stock Page
            </Button>
            <Button color="inherit" component={Link} to="/heatmap" sx={{ mx: 1, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
              Correlation Heatmap
            </Button>
          </Box>
          {/* Add a simple mobile menu button if needed for responsive design */}
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton> */}
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      {/* Using Container to limit content width and provide consistent padding */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, minHeight: 'calc(100vh - 64px - 80px)' }}> {/* Adjust minHeight for footer and header */}
        {/* Hero Section - Display on the home page, or always if desired */}
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <StockPage /> {/* StockPage is shown on home route, below hero */}
            </>
          } />
          <Route path="/heatmap" element={<HeatmapPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>

      {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;