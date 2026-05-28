const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 3000;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Coolify App läuft!');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});