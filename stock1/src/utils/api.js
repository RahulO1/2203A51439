const BASE_URL = 'http://20.244.56.144/evaluation-service';

export const fetchStockPrices = async (ticker, minutes) => {
  const url = minutes
    ? `${BASE_URL}/stocks/${ticker}?minutes=${minutes}`
    : `${BASE_URL}/stocks/${ticker}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // The API returns an array of objects for 'minutes' and a single object for no minutes
    // Normalize to always return an array
    const data = await response.json();
    return Array.isArray(data) ? data : [data.stock];
  } catch (error) {
    console.error(`Failed to fetch stock prices for ${ticker}:`, error);
    throw error; // Re-throw to be caught by the component
  }
};

export const fetchAllStocks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/stocks`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.stocks;
  } catch (error) {
    console.error('Failed to fetch all stocks:', error);
    throw error;
  }
};