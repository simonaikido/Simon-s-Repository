const express = require('express');
const helmet = require('helmet');
const app = express();

app.use(helmet());

app.get('/', (req, res) => {
  res.send('Hello from Aikido test app!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
