import type { IncomingMessage, ServerResponse } from 'node:http';
import { getNearbyExplorePlaces } from '../src/services/exploreData.js';

export default async function handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
  if (request.method !== 'GET') {
    response.statusCode = 405;
    response.setHeader('Allow', 'GET');
    response.end('Method Not Allowed');
    return;
  }

  const url = new URL(request.url ?? '/', 'http://localhost');
  const lat = Number(url.searchParams.get('lat') ?? '10.0452');
  const lng = Number(url.searchParams.get('lng') ?? '105.7469');
  const radius = Number(url.searchParams.get('radius') ?? '5000');

  const center = {
    lat: Number.isFinite(lat) ? lat : 10.0452,
    lng: Number.isFinite(lng) ? lng : 105.7469,
  };

  const payload = await getNearbyExplorePlaces(center, Number.isFinite(radius) ? radius : 5000);
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
}
