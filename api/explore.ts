import { getNearbyExplorePlaces } from '../src/services/exploreData';

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const lat = Number(url.searchParams.get('lat') ?? '10.0452');
  const lng = Number(url.searchParams.get('lng') ?? '105.7469');
  const radius = Number(url.searchParams.get('radius') ?? '5000');

  const center = {
    lat: Number.isFinite(lat) ? lat : 10.0452,
    lng: Number.isFinite(lng) ? lng : 105.7469,
  };

  const payload = await getNearbyExplorePlaces(center, Number.isFinite(radius) ? radius : 5000);
  return Response.json(payload);
}
