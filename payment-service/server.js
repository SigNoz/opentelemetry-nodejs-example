const express = require('express');
const app = express();
const port = 3002;  // Different port for each service

app.get('/', (req, res) => {
  res.send('Payment Service is running!');
});

app.listen(port, () => {
  console.log(`Payment Service running on http://localhost:${port}`);
});
