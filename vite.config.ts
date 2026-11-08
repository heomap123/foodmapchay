import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fallbackPlacesForCenter, getNearbyExplorePlaces } from './src/services/exploreData';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'explore-proxy',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url || !req.url.startsWith('/api/explore')) {
            next();
            return;
          }

          try {
            const url = new URL(req.url, 'http://localhost');
            const lat = Number(url.searchParams.get('lat') ?? '10.0452');
            const lng = Number(url.searchParams.get('lng') ?? '105.7469');
            const radius = Number(url.searchParams.get('radius') ?? '5000');
            const center = {
              lat: Number.isFinite(lat) ? lat : 10.0452,
              lng: Number.isFinite(lng) ? lng : 105.7469,
            };
            const payload = await getNearbyExplorePlaces(center, Number.isFinite(radius) ? radius : 5000);
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.statusCode = 200;
            res.end(JSON.stringify(payload));
          } catch {
            const center = { lat: 10.0452, lng: 105.7469 };
            const payload = {
              places: fallbackPlacesForCenter(center, 5000),
              source: 'Fallback',
            };
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.statusCode = 500;
            res.end(JSON.stringify(payload));
          }
        });
      },
    },
  ],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
