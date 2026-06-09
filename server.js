const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {

    res.send(`
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>❤️ Karolina ❤️</title>

<style>

body{
    margin:0;
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    background:#0f172a;
    color:white;
    font-family:Segoe UI,sans-serif;
    text-align:center;
}

h1{
    font-size:6rem;
    color:#ff4d6d;
    margin-bottom:20px;
}

p{
    font-size:2rem;
}

.heart{
    font-size:8rem;
    animation:pulse 1s infinite;
}

@keyframes pulse{
    0%{transform:scale(1);}
    50%{transform:scale(1.15);}
    100%{transform:scale(1);}
}

</style>

</head>
<body>

<div class="heart">❤️</div>

<h1>Karolina</h1>

<p>Ich mobbe dich auch nicht immer 🥰</p>

</body>
</html>
`);
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, '0.0.0.0', () => {
    console.log(\`Server läuft auf Port \${port}\`);
});