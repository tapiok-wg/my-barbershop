import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3004;
const DATA_FILE = path.join(process.cwd(), 'data', 'data.json');

if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

const readDataFile = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка чтения файла:', error);
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    return [];
  }
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.writeHead(204).end();
  }

  if (req.method === 'POST' && req.url === '/submit') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      console.log('Полученные данные:', body);

      if (!body.trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Тело запроса пустое' }));
      }

      try {
        const parsedBody = JSON.parse(body);
        console.log('Разобранные данные:', parsedBody);
        const { name, phone, message } = parsedBody;

        if (!name || !phone || !message) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Некорректные данные' }));
        }

        const data = readDataFile();
        data.push({ name, phone, message });
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        console.error('Ошибка разбора JSON:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Неверный формат JSON' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
