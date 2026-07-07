import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'manage-themes',
      configureServer(server) {
        server.middlewares.use('/api/themes', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                const safeName = data.theme.toLowerCase().replace(/[^a-z0-9]/g, '_');
                const filename = `${safeName}_${Date.now()}.json`;
                fs.writeFileSync(path.resolve('./src/data', filename), JSON.stringify(data, null, 2));
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, filename }));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: String(e) }));
              }
            });
          } else if (req.method === 'DELETE') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                const filepath = path.resolve('./src/data', data.filename);
                if (fs.existsSync(filepath)) {
                  fs.unlinkSync(filepath);
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: String(e) }));
              }
            });
          }
        });
      }
    }
  ]
})
