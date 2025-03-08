const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

// API endpoint for prayer times
app.get('/api/prayer-times/:cityId', async (req, res) => {
    try {
        const { cityId } = req.params;
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const response = await fetch(`https://ezanvakti.herokuapp.com/vakitler?ilce=${cityId}&tarih=${dateStr}`);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
