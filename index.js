const express = require('express');
const app = express();
const port = 3000;

const userToken = "";

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});