const express = require('express');
const app = express();
const port = 3001; // Different port for each service

app.get('/', (req, res) => {
  res.send('Order Service is running!');
});

app.listen(port, () => {
  console.log(`Order Service running on http://localhost:${port}`);
});
