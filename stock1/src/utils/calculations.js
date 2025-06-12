export const calculateAverage = (data) => {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
};

// Covariance formula: cov(X,Y) = Sum((Xi - X_bar)(Yi - Y_bar)) / (n-1)
export const calculateCovariance = (dataX, dataY) => {
  if (dataX.length !== dataY.length || dataX.length < 2) return 0; // Need at least 2 data points for n-1

  const n = dataX.length;
  const meanX = calculateAverage(dataX);
  const meanY = calculateAverage(dataY);

  let sumOfProducts = 0;
  for (let i = 0; i < n; i++) {
    sumOfProducts += (dataX[i] - meanX) * (dataY[i] - meanY);
  }
  return sumOfProducts / (n - 1);
};

// Standard Deviation formula: sigma_X = sqrt(Sum((Xi - X_bar)^2) / (n-1))
export const calculateStandardDeviation = (data) => {
  if (data.length < 2) return 0; // Need at least 2 data points for n-1

  const n = data.length;
  const mean = calculateAverage(data);
  const sumOfSquaredDifferences = data.reduce(
    (acc, val) => acc + Math.pow(val - mean, 2),
    0
  );
  return Math.sqrt(sumOfSquaredDifferences / (n - 1));
};

// Pearson's Correlation Coefficient formula: rho = cov(X,Y) / (sigma_X * sigma_Y)
export const calculatePearsonCorrelation = (covariance, stdDevX, stdDevY) => {
  if (stdDevX === 0 || stdDevY === 0) return 0; // Avoid division by zero, perfectly correlated if one has no deviation
  return covariance / (stdDevX * stdDevY);
};