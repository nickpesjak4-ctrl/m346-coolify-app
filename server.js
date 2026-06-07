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
            'SELECT * FROM fahrzeuge ORDER BY marke'
        );

        let html = `
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Fahrzeugverwaltung</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    background:#0f172a;
    color:white;
    font-family:Segoe UI, sans-serif;
    padding:40px;
}

.header{
    text-align:center;
    margin-bottom:40px;
}

.header h1{
    font-size:3rem;
}

.header p{
    color:#94a3b8;
}

.container{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
    gap:25px;
}

.card{
    background:#1e293b;
    border-radius:20px;
    padding:25px;
    box-shadow:0 10px 25px rgba(0,0,0,0.3);
    transition:0.3s;
}

.card:hover{
    transform:translateY(-5px);
}

.card h2{
    margin-bottom:15px;
}

.info{
    margin-bottom:10px;
}

.km{
    display:inline-block;
    background:#2563eb;
    padding:10px 15px;
    border-radius:20px;
    font-weight:bold;
    margin-top:10px;
}

.button{
    display:inline-block;
    margin-top:20px;
    background:#22c55e;
    color:white;
    padding:12px 20px;
    text-decoration:none;
    border-radius:10px;
    font-weight:bold;
}

.button:hover{
    background:#16a34a;
}

</style>
</head>
<body>

<div class="header">
<h1>🚗 Fahrzeugverwaltung</h1>
<p>Meine Fahrzeuge und Servicehistorie</p>
</div>

<div class="container">
`;

        result.rows.forEach(f => {

            let emoji = "🚗";

            if (f.marke === "Aprilia") emoji = "🏍️";
            if (f.marke === "Peugeot") emoji = "🛵";
            if (f.marke === "Segway") emoji = "🛴";

            html += `
<div class="card">

<h2>${emoji} ${f.marke} ${f.modell}</h2>

<p class="info">
📅 Baujahr:
${new Date(f.baujahr).toLocaleDateString('de-CH')}
</p>

<p class="info">
📍 Kilometerstand
</p>

<div class="km">
${f.kilometer.toLocaleString('de-CH')} km
</div>

<br>

<a class="button" href="/fahrzeug/${f.id}">
Servicehistorie
</a>

</div>
`;
        });

        html += `
</div>
</body>
</html>
`;

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
            'SELECT * FROM service WHERE fahrzeug_id = $1 ORDER BY kilometer'
            ,
            [req.params.id]
        );

        const f = fahrzeug.rows[0];

        let html = `
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">

<title>${f.marke} ${f.modell}</title>

<style>

body{
    background:#0f172a;
    color:white;
    font-family:Segoe UI,sans-serif;
    padding:40px;
}

.card{
    background:#1e293b;
    border-radius:20px;
    padding:30px;
    max-width:1000px;
    margin:auto;
}

.status{
    display:inline-block;
    background:#16a34a;
    padding:10px 15px;
    border-radius:20px;
    margin-top:10px;
}

.service{
    background:#334155;
    padding:15px;
    border-left:5px solid #22c55e;
    border-radius:10px;
    margin-top:15px;
}

.back{
    display:inline-block;
    margin-top:25px;
    background:#2563eb;
    color:white;
    text-decoration:none;
    padding:12px 20px;
    border-radius:10px;
}

</style>

</head>
<body>

<div class="card">

<h1>${f.marke} ${f.modell}</h1>

<h3>
🛣️ ${f.kilometer.toLocaleString('de-CH')} km
</h3>

<p>
📅 Baujahr:
${new Date(f.baujahr).toLocaleDateString('de-CH')}
</p>

<div class="status">
🟢 Fahrzeug betriebsbereit
</div>

<br><br>

<h2>🔧 Servicehistorie</h2>
`;

        service.rows.forEach(s => {

            html += `
<div class="service">

<strong>
${s.kilometer.toLocaleString('de-CH')} km
</strong>

<br><br>

${s.beschreibung}

</div>
`;
        });

        html += `

<br>

<h2>📋 Nächste Wartung</h2>

<p>Ölwechsel: Kontrolle empfohlen</p>
<p>Bremsen: Kontrolle empfohlen</p>
<p>Reifen: Zustand prüfen</p>

<a class="back" href="/">
← Zurück zur Übersicht
</a>

</div>

</body>
</html>
`;

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