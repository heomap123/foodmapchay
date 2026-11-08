/// <reference types="vite/client" />

import type { Coordinates, Place } from '../types/map.js';

const foodAmenities = new Set(['restaurant', 'fast_food', 'food_court', 'ice_cream', 'cafe']);

function googleMapsApiKey(): string {
  const env = typeof import.meta !== 'undefined' ? import.meta.env : undefined;
  const value = env?.VITE_GOOGLE_MAPS_API_KEY || '';
  return value.trim();
}

export interface VegetarianSeedPlace {
  id: string;
  name: string;
  address: string;
  amenity: string;
  lat: number;
  lng: number;
  typeLabel: string;
  cuisine: string;
  website: string;
  phone: string;
  price: string;
  openingHours: string;
  brand: string;
  osmType: string;
  osmId: string | number;
  rating?: number;
  reviewCount?: number;
}

export const vegetarianPlacesSeed: VegetarianSeedPlace[] = [
  {
    id: 'code-1', name: 'Quán Chay 3/2', address: '226 Đường 3/2, Ninh Kiều, Cần Thơ', amenity: 'restaurant', lat: 10.0408, lng: 105.7767,
    typeLabel: 'Quán ăn', cuisine: 'vegetarian', website: 'https://example.com', phone: '', price: '200k-400k', openingHours: '08:00-21:00', brand: '', osmType: 'code', osmId: 'code-1', rating: 4.7, reviewCount: 12,
  },
  {
    id: 'code-2', name: 'Mì Chay Lê Bình', address: '18 Lê Bình, Ninh Kiều, Cần Thơ', amenity: 'restaurant', lat: 10.0379, lng: 105.7804,
    typeLabel: 'Quán ăn', cuisine: 'vegetarian', website: 'https://example.com', phone: '', price: '80k-200k', openingHours: '09:00-21:00', brand: '', osmType: 'code', osmId: 'code-2', rating: 4.6, reviewCount: 9,
  },
  {
    id: 'code-3', name: 'Bún Chay Hưng Phú', address: '105 Hưng Phú, Cái Răng, Cần Thơ', amenity: 'restaurant', lat: 10.0128, lng: 105.7484,
    typeLabel: 'Quán ăn', cuisine: 'vegan', website: 'https://example.com', phone: '', price: '50k-150k', openingHours: '07:00-20:00', brand: '', osmType: 'code', osmId: 'code-3', rating: 4.5, reviewCount: 15,
  },
  {
    id: 'code-4', name: 'Chay Tâm An', address: '57 Nguyễn Văn Cừ, Bình Thủy, Cần Thơ', amenity: 'restaurant', lat: 10.0725, lng: 105.7469,
    typeLabel: 'Quán ăn', cuisine: 'vegetarian', website: 'https://example.com', phone: '', price: '150k-300k', openingHours: '10:00-22:00', brand: '', osmType: 'code', osmId: 'code-4', rating: 4.8, reviewCount: 27,
  },
  {
    id: 'code-5', name: 'Nhà Chay Cần Thơ', address: '12 Trần Hưng Đạo, Ninh Kiều, Cần Thơ', amenity: 'restaurant', lat: 10.0492, lng: 105.7838,
    typeLabel: 'Quán ăn', cuisine: 'vegan', website: 'https://example.com', phone: '', price: '120k-250k', openingHours: '08:30-21:30', brand: '', osmType: 'code', osmId: 'code-5', rating: 4.7, reviewCount: 22,
  },
  {
    id: 'code-6', name: 'Bếp Chay An Bình', address: '334 An Hòa, Bình Thủy, Cần Thơ', amenity: 'restaurant', lat: 10.0215, lng: 105.7721,
    typeLabel: 'Quán ăn', cuisine: 'vegetarian', website: 'https://example.com', phone: '', price: '90k-180k', openingHours: '08:00-20:30', brand: '', osmType: 'code', osmId: 'code-6', rating: 4.6, reviewCount: 18,
  },
  {
    id: 'code-7', name: 'Cơm Chay Xuân Khánh', address: '23 Xuân Khánh, Ninh Kiều, Cần Thơ', amenity: 'restaurant', lat: 10.0469, lng: 105.7919,
    typeLabel: 'Quán ăn', cuisine: 'vegetarian', website: 'https://example.com', phone: '', price: '100k-220k', openingHours: '09:00-21:00', brand: '', osmType: 'code', osmId: 'code-7', rating: 4.5, reviewCount: 11,
  },
  {
    id: 'code-8', name: 'Quán Chay Ô Môn', address: '12 Nguyễn Hữu Thọ, Ô Môn, Cần Thơ', amenity: 'restaurant', lat: 10.1228, lng: 105.6312,
    typeLabel: 'Quán ăn', cuisine: 'vegan', website: 'https://example.com', phone: '', price: '80k-180k', openingHours: '07:30-20:30', brand: '', osmType: 'code', osmId: 'code-8', rating: 4.6, reviewCount: 10,
  },
  {
    id: 'data-1', name: 'Ngon Vegan - Bến Ninh Kiều', address: '28 Hai Bà Trưng, Ninh Kiều, Cần Thơ', amenity: 'restaurant', lat: 10.0383, lng: 105.7859,
    typeLabel: 'Quán ăn', cuisine: 'vegan', website: 'https://example.com', phone: '', price: '100k-250k', openingHours: '07:30–22:00', brand: '', osmType: 'seed', osmId: 'data-1', rating: 4.7, reviewCount: 12,
  },
  {
    id: 'data-2', name: 'Cơm chay Thiện Duyên', address: '262 Đường 30 Tháng 4, Tân An, Cần Thơ', amenity: 'restaurant', lat: 10.0289, lng: 105.7732,
    typeLabel: 'Quán ăn', cuisine: 'vegetarian', website: 'https://example.com', phone: '', price: '50k-150k', openingHours: '06:00–20:00', brand: '', osmType: 'seed', osmId: 'data-2', rating: 4.4, reviewCount: 701,
  },
  {
    id: 'data-3', name: 'Tịnh Chay', address: '60 Nam Kỳ Khởi Nghĩa, Ninh Kiều, Cần Thơ', amenity: 'restaurant', lat: 10.0392, lng: 105.7808,
    typeLabel: 'Quán ăn', cuisine: 'vegetarian', website: 'https://example.com', phone: '', price: '80k-220k', openingHours: '06:00–19:00', brand: '', osmType: 'seed', osmId: 'data-3', rating: 4.9, reviewCount: 145,
  },
  {
    id: 'data-4', name: 'Quán ăn chay Bách Thảo', address: '86A Đề Thám, Ninh Kiều, Cần Thơ', amenity: 'restaurant', lat: 10.0397, lng: 105.7853,
    typeLabel: 'Quán ăn', cuisine: 'vegetarian', website: 'https://example.com', phone: '', price: '80k-180k', openingHours: '06:30–21:30', brand: '', osmType: 'seed', osmId: 'data-4', rating: 5, reviewCount: 1,
  },
  {
    id: 'data-5', name: 'Nhà hàng chay Tịnh Bình', address: '80–82 Lương Định Của, Cái Khế, Cần Thơ', amenity: 'restaurant', lat: 10.0334, lng: 105.7651,
    typeLabel: 'Nhà hàng', cuisine: 'vegetarian', website: 'https://example.com', phone: '', price: '150k-400k', openingHours: '08:30–21:00', brand: '', osmType: 'seed', osmId: 'data-5', rating: 4.8, reviewCount: 307,
  },
  {
    id: 'data-6', name: 'Nhà hàng chay Quý Liên', address: '4 Trần Văn Trà, KDC Hưng Phú 1, Cần Thơ', amenity: 'restaurant', lat: 10.0168, lng: 105.7561,
    typeLabel: 'Nhà hàng', cuisine: 'vegetarian', website: 'https://example.com', phone: '', price: '100k-250k', openingHours: '06:00–22:00', brand: '', osmType: 'seed', osmId: 'data-6', rating: 4.3, reviewCount: 705,
  },
  {
    id: 'data-7', name: 'Quán Chay An', address: 'Đường Nguyễn Văn Linh, Tân An, Cần Thơ', amenity: 'restaurant', lat: 10.0213, lng: 105.7701,
    typeLabel: 'Quán ăn', cuisine: 'vegetarian', website: 'https://example.com', phone: '', price: '50k-200k', openingHours: '09:00–21:30', brand: '', osmType: 'seed', osmId: 'data-7', rating: 4.7, reviewCount: 111,
  },
  {
    id: 'data-8', name: 'Mê Rau Vegetarian - Buffet Lẩu Rau Nấm', address: '102 Nguyễn An Ninh, Ninh Kiều, Cần Thơ', amenity: 'restaurant', lat: 10.0421, lng: 105.7821,
    typeLabel: 'Buffet', cuisine: 'vegan', website: 'https://example.com', phone: '', price: '150k-300k', openingHours: '10:00–21:30', brand: '', osmType: 'seed', osmId: 'data-8', rating: 4.7, reviewCount: 140,
  },
  {
    id: 'data-9', name: 'Buffet Chay Tịnh Lạc', address: '34–36 Trần Đại Nghĩa, Cái Khế, Cần Thơ', amenity: 'restaurant', lat: 10.0265, lng: 105.7615,
    typeLabel: 'Buffet', cuisine: 'vegetarian', website: 'https://example.com', phone: '', price: '100k-260k', openingHours: '07:00–22:00', brand: '', osmType: 'seed', osmId: 'data-9', rating: 4.6, reviewCount: 104,
  },
  {
    id: 'data-10', name: 'Quán chay Ngọc Thảo', address: '98 Nguyễn Thái Học, Ninh Kiều, Cần Thơ', amenity: 'restaurant', lat: 10.0364, lng: 105.7812,
    typeLabel: 'Quán ăn', cuisine: 'vegetarian', website: 'https://example.com', phone: '', price: '70k-180k', openingHours: 'Chưa có dữ liệu', brand: '', osmType: 'seed', osmId: 'data-10', rating: 4.7, reviewCount: 59,
  },
];

const fallbackPlacesSeed = vegetarianPlacesSeed;

function distanceBetween(a: Coordinates, b: Coordinates): number {
  const earthRadius = 6371000;
  const latDiff = ((b.lat - a.lat) * Math.PI) / 180;
  const lngDiff = ((b.lng - a.lng) * Math.PI) / 180;
  const latA = (a.lat * Math.PI) / 180;
  const latB = (b.lat * Math.PI) / 180;

  const haversine =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(latA) * Math.cos(latB) * Math.sin(lngDiff / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function toPlace(item: VegetarianSeedPlace): Place {
  const tags: Record<string, string> = {
    amenity: item.amenity,
    cuisine: item.cuisine,
    vegan: item.cuisine.toLowerCase().includes('vegan') ? 'yes' : '',
    vegetarian: item.cuisine.toLowerCase().includes('vegetarian') ? 'yes' : '',
    name: item.name,
  };

  return {
    id: item.id,
    name: item.name,
    address: item.address,
    amenity: item.amenity,
    isFoodPlace: foodAmenities.has(item.amenity),
    isVegetarian: true,
    brand: item.brand,
    typeLabel: item.typeLabel,
    isApproximate: false,
    cuisine: item.cuisine,
    openingHours: item.openingHours,
    phone: item.phone,
    website: item.website,
    price: item.price,
    distance: 0,
    lat: item.lat,
    lng: item.lng,
    osmType: item.osmType,
    osmId: item.osmId,
    tags,
  };
}

function seedPlacesNearCenter(center: Coordinates, radius: number): Place[] {
  return fallbackPlacesSeed
    .map((item) => {
      const place = toPlace(item);
      return { ...place, distance: distanceBetween(center, { lat: item.lat, lng: item.lng }) };
    })
    .filter((place) => place.distance <= radius || place.distance <= 7000)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 12);
}

export async function getNearbyExplorePlaces(
  center: Coordinates,
  radius: number,
): Promise<{ places: Place[]; source: 'Google Maps' | 'Fallback' }> {
  const apiKey = googleMapsApiKey();
  const seededPlaces = seedPlacesNearCenter(center, radius);

  if (seededPlaces.length) {
    return {
      places: seededPlaces,
      source: 'Fallback',
    };
  }

  if (apiKey) {
    try {
      const googleQuery = new URLSearchParams({
        key: apiKey,
        location: `${center.lat},${center.lng}`,
        radius: String(radius),
        keyword: 'vegetarian OR vegan OR chay OR restaurant',
        type: 'restaurant',
        language: 'vi',
      });

      const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?${googleQuery.toString()}`);
      if (!response.ok) {
        throw new Error(`Google Maps HTTP ${response.status}`);
      }

      const data = await response.json() as { results?: Array<Record<string, unknown>> };
      const googlePlaces = (data.results ?? [])
        .map((item) => {
          const loc = (item.geometry as { location?: { lat?: number; lng?: number } })?.location ?? {};
          const lat = Number(loc.lat ?? 0);
          const lng = Number(loc.lng ?? 0);
          const name = String(item.name ?? 'Quán ăn gần đây');
          const address = String(item.vicinity ?? 'Cần Thơ');
          const rating = Number((item.rating as number | undefined) ?? 0);
          const reviewCount = Number((item.user_ratings_total as number | undefined) ?? 0);
          const types = Array.isArray(item.types) ? item.types as string[] : [];
          const tags: Record<string, string> = {
            amenity: types.includes('restaurant') ? 'restaurant' : 'cafe',
            cuisine: types.join(','),
          };

          return {
            id: String(item.place_id ?? `${name}-${lat}-${lng}`),
            name,
            address,
            amenity: tags.amenity,
            isFoodPlace: true,
            isVegetarian: /vegetarian|vegan|chay/i.test(name) || /vegetarian|vegan|chay/i.test(address),
            brand: '',
            typeLabel: 'Quán ăn',
            isApproximate: false,
            cuisine: tags.cuisine,
            openingHours: String((item.opening_hours as { open_now?: boolean } | undefined)?.open_now ? 'Đang mở' : ''),
            phone: '',
            website: '',
            price: '',
            distance: distanceBetween(center, { lat, lng }),
            lat,
            lng,
            osmType: 'google',
            osmId: String(item.place_id ?? `${lat}-${lng}`),
            tags,
            rating,
            reviewCount,
          } as Place & { rating?: number; reviewCount?: number };
        })
        .filter((place) => place.isFoodPlace && (place.isVegetarian || /restaurant|food|cafe|coffee|tea|buffet/i.test(place.name || '')))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 12);

      if (googlePlaces.length) {
        return { places: googlePlaces, source: 'Google Maps' };
      }
    } catch {
      // Fallback below remains intentionally stable when Google Maps is unavailable.
    }
  }

  return {
    places: seededPlaces.length ? seededPlaces : fallbackPlacesSeed.map((item) => ({ ...toPlace(item), distance: distanceBetween(center, { lat: item.lat, lng: item.lng }) })).slice(0, 12),
    source: 'Fallback',
  };
}

export function fallbackPlacesForCenter(center: Coordinates, radius: number): Place[] {
  return fallbackPlacesSeed
    .map((item) => {
      const place = toPlace(item);
      return { ...place, distance: distanceBetween(center, { lat: item.lat, lng: item.lng }) };
    })
    .filter((place) => place.distance <= radius || place.distance <= 7000)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 12);
}
