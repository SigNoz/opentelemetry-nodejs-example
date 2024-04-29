const express = require('express');
const app = express();
const port = 3003;  // Different port for each service

app.get('/', (req, res) => {
  res.send('Product Service is running!');
});

app.listen(port, () => {
  console.log(`Product Service running on http://localhost:${port}`);
});
