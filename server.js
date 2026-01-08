const express = require('express');
const axios = require('axios');
const https = require('https');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const API_BASE = 'https://localhost:7020';

// Agent HTTPS que ignora certificados auto-assinados
const httpsAgent = new https.Agent({ 
  rejectUnauthorized: false,
  keepAlive: true
});

// Proxy para evitar CORS issues
app.all('/api/*', async (req, res) => {
  try {
    const path = req.path.replace('/api', '');
    const url = API_BASE + path;
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${url}`);
    
    const config = {
      method: req.method,
      url: url,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      },
      data: req.body,
      validateStatus: () => true,
      httpsAgent: httpsAgent,
      timeout: 10000
    };
    
    delete config.headers['host'];
    delete config.headers['content-length'];
    
    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    res.status(500).json({ error: err.message, details: err.code });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', apiBase: API_BASE });
});

app.listen(3000, () => {
  console.log('\n🍕 Painel Administrativo Pizzaria');
  console.log('================================');
  console.log('📱 Painel rodando em: http://localhost:3000');
  console.log('🔗 API Backend: ' + API_BASE);
  console.log('================================\n');
});
