const express = require('express');
const app = express();
const port = 3004;  // Different port for each service

app.get('/', (req, res) => {
  res.send('User Service is running!');
});

app.listen(port, () => {
  console.log(`User Service running on http://localhost:${port}`);
});
