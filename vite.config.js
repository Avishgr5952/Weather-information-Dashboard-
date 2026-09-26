import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import https from 'https';
import http from 'http';
import dns from 'dns';

// Ensure Node uses Google & Cloudflare public DNS to avoid ISP/router DNS poisoning
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {
  // Ignore
}

const OPEN_METEO_IPS = {
  'geocoding-api.open-meteo.com': '202.61.206.6',
  'air-quality-api.open-meteo.com': '152.53.84.73',
  'archive-api.open-meteo.com': '5.9.98.12'
};

function openMeteoProxyPlugin() {
  return {
    name: 'open-meteo-proxy-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        let targetHost = null;
        let targetPath = null;

        if (req.url.startsWith('/geo-proxy')) {
          targetHost = 'geocoding-api.open-meteo.com';
          targetPath = req.url.replace('/geo-proxy', '');
        } else if (req.url.startsWith('/aqi-proxy')) {
          targetHost = 'air-quality-api.open-meteo.com';
          targetPath = req.url.replace('/aqi-proxy', '');
        } else if (req.url.startsWith('/archive-proxy')) {
          targetHost = 'archive-api.open-meteo.com';
          targetPath = req.url.replace('/archive-proxy', '');
        }

        if (!targetHost) {
          return next();
        }

        const ip = OPEN_METEO_IPS[targetHost];
        const options = {
          hostname: ip || targetHost,
          port: 443,
          path: targetPath,
          method: 'GET',
          rejectUnauthorized: false,
          headers: {
            'Host': targetHost,
            'User-Agent': 'WeatherInformationDashboard/1.0',
            'Accept': 'application/json'
          }
        };

        const proxyReq = https.request(options, (remoteRes) => {
          // Never forward 301/302 redirects to client browser to prevent CORS/mixed-content blocks
          if (remoteRes.statusCode >= 300 && remoteRes.statusCode < 400) {
            res.writeHead(502, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'no-store, no-cache, must-revalidate',
            });
            res.end(JSON.stringify({ error: 'Remote endpoint issued redirect' }));
            return;
          }

          res.writeHead(remoteRes.statusCode, {
            'Content-Type': remoteRes.headers['content-type'] || 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          });

          remoteRes.pipe(res);
        });

        proxyReq.on('error', (err) => {
          res.writeHead(502, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store, no-cache',
          });
          res.end(JSON.stringify({ error: err.message }));
        });

        proxyReq.end();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), openMeteoProxyPlugin()],
  server: {
    port: 3000,
    open: false,
  }
});
