'use strict';

const express = require('express');

const app = express();

app.use(express.json({ limit: '1mb' }));

app.get('/api/status', (req, res) => {
  res.json({ status: 'The API is functioning correctly.' });
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('The server is listening on port 3000');
});
