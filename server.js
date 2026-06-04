const express = require('express');
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect()
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {

    const bilder = [
        { name: 'Ferien.jpg' },
        { name: 'Auto.png' },
        { name: 'Hund.jpeg' }
    ];

    res.render('index', { bilder });
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server läuft auf Port ${port}`);
});