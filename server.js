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

app.get('/', async (req, res) => {
    try {
        const result = await client.query(
            'SELECT * FROM fahrzeuge ORDER BY marke'
        );

        let html = `
        <html>
        <head>
            <title>Fahrzeugverwaltung</title>
        </head>
        <body>
            <h1>🚗 Fahrzeugverwaltung</h1>
            <h3>Meine Fahrzeuge</h3>
        `;

        result.rows.forEach(fahrzeug => {
            html += `
                <div style="border:1px solid black;padding:10px;margin:10px;">
                    <h2>${fahrzeug.marke} ${fahrzeug.modell}</h2>
                    <p>Baujahr: ${fahrzeug.baujahr}</p>
                    <p>Kilometer: ${fahrzeug.kilometer}</p>
                </div>
            `;
        });

        html += `
        </body>
        </html>
        `;

        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send('Fehler beim Laden der Fahrzeuge');
    }
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server läuft auf Port ${port}`);
});