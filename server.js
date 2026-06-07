const express = require('express');
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect()
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err));

app.get('/', async (req, res) => {
    try {
        const result = await client.query(
            'SELECT * FROM fahrzeuge'
        );

        let html = `
        <h1>🚗 Fahrzeugverwaltung</h1>
        <hr>
        `;

        result.rows.forEach(f => {
            html += `
                <div style="margin-bottom:20px;">
                    <h2>${f.marke} ${f.modell}</h2>
                    <p>Baujahr: ${f.baujahr}</p>
                    <p>Kilometer: ${f.kilometer} km</p>
                    <a href="/fahrzeug/${f.id}">Details anzeigen</a>
                </div>
                <hr>
            `;
        });

        res.send(html);

    } catch (err) {
        console.log(err);
        res.status(500).send('Fehler');
    }
});

app.get('/fahrzeug/:id', async (req, res) => {
    try {

        const fahrzeug = await client.query(
            'SELECT * FROM fahrzeuge WHERE id = $1',
            [req.params.id]
        );

        const service = await client.query(
            'SELECT * FROM service WHERE fahrzeug_id = $1 ORDER BY kilometer',
            [req.params.id]
        );

        let html = `
            <h1>${fahrzeug.rows[0].marke} ${fahrzeug.rows[0].modell}</h1>
            <p>${fahrzeug.rows[0].kilometer} km</p>
            <h2>Servicehistorie</h2>
        `;

        service.rows.forEach(s => {
            html += `
                <p>
                    ${s.kilometer} km - ${s.beschreibung}
                </p>
            `;
        });

        html += `<br><a href="/">Zurück</a>`;

        res.send(html);

    } catch (err) {
        console.log(err);
        res.status(500).send('Fehler');
    }
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server läuft auf Port ${port}`);
});