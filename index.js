const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
let dotenv = require('dotenv').config();

const app = express();
app.use(cors());
app.options('*', cors());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use('/home', express.static(__dirname + '/views/index.html'));
app.get('/home', async (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(process.env.WEB_URL);
    const $ = cheerio.load(response.data);

    // Eliminar el elemento específico
    $('.ad-slot-header__wrapper').remove();

    res.send($.html());
  } catch (error) {
    res.send(`Error: ${error.message}`);
  }
});

// Proxy para la URL raíz
const apiProxy1 = createProxyMiddleware('/', {
  target: process.env.WEB_URL,
  changeOrigin: true,
});
app.use(apiProxy1);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
