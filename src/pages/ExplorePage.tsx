import { useEffect, useMemo, useState } from 'react';
import {
  getDistrictOptions,
  getProvinceOptions,
  getWardOptions,
  matchesLocationFilter,
  type LocationSelection,
} from '../services/location';
import { searchNearbyPlaces } from '../services/places';
import FeaturePageLayout from './FeaturePageLayout';

interface RestaurantRecommendation {
  id: string;
  name: string;
  address: string;
  description: string;
  tag: string;
  price: string;
  rating: string;
  signature: string;
  image: string;
  coords: { lat: number; lng: number };
}






function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function distanceBetweenMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const earthRadius = 6371000;
  const latDifference = toRadians(b.lat - a.lat);
  const lngDifference = toRadians(b.lng - a.lng);
  const latitudeA = toRadians(a.lat);
  const latitudeB = toRadians(b.lat);

  const haversine =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(lngDifference / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function buildLocationCenter(selection: LocationSelection): { lat: number; lng: number } {
  const wardCenters: Record<string, { lat: number; lng: number }> = {
    'An Hòa': { lat: 10.0398, lng: 105.7824 },
    'An Khánh': { lat: 10.0384, lng: 105.7941 },
    'An Bình': { lat: 10.0128, lng: 105.7704 },
    'Cái Khế': { lat: 10.0318, lng: 105.7734 },
    'Thới Bình': { lat: 10.0256, lng: 105.7892 },
    'Tân An': { lat: 10.0137, lng: 105.7705 },
    'Xuân Khánh': { lat: 10.0456, lng: 105.794 },
    'Bình Thủy': { lat: 10.0682, lng: 105.7426 },
    'Thới An': { lat: 10.0712, lng: 105.7328 },
    'Thới Nhựt': { lat: 10.0761, lng: 105.7604 },
    'Trà Nóc': { lat: 10.0888, lng: 105.7244 },
    'Châu Văn Liêm': { lat: 10.1158, lng: 105.6465 },
    'Thới Hòa': { lat: 10.1315, lng: 105.6181 },
    'Trường Lạc': { lat: 10.1478, lng: 105.6253 },
    'Thạnh Phú': { lat: 10.1211, lng: 105.6108 },
    'Ba Láng': { lat: 10.0148, lng: 105.7454 },
    'Hưng Phú': { lat: 10.0123, lng: 105.765 },
    'Lê Bình': { lat: 10.0178, lng: 105.7489 },
    'Thường Thạnh': { lat: 10.0064, lng: 105.7169 },
    'Tân Hưng': { lat: 10.0115, lng: 105.7081 },
    'Thốt Nốt': { lat: 10.0879, lng: 105.7054 },
    'Trung Nhứt': { lat: 10.1001, lng: 105.7082 },
    'Vĩnh Trinh': { lat: 10.0889, lng: 105.6778 },
  };

  const districtCenters: Record<string, { lat: number; lng: number }> = {
    'Ninh Kiều': { lat: 10.0359, lng: 105.777 },
    'Bình Thủy': { lat: 10.0743, lng: 105.7438 },
    'Ô Môn': { lat: 10.1284, lng: 105.6298 },
    'Cái Răng': { lat: 10.0096, lng: 105.7417 },
    'Thốt Nốt': { lat: 10.0995, lng: 105.6953 },
  };

  if (selection.ward && wardCenters[selection.ward]) {
    return wardCenters[selection.ward];
  }

  if (selection.district && districtCenters[selection.district]) {
    return districtCenters[selection.district];
  }

  return { lat: 10.0452, lng: 105.7469 };
}

function buildDirectionsUrl(place: RestaurantRecommendation, origin?: { lat: number; lng: number } | null): string {
  const destination = `${place.coords.lat},${place.coords.lng}`;
  const originParam = origin ? `&origin=${origin.lat},${origin.lng}` : '';
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}${originParam}`;
}

async function reverseGeocodeAddress(point: { lat: number; lng: number }): Promise<string> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  if (!apiKey) {
    return 'Cần Thơ';
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${point.lat},${point.lng}&language=vi&key=${apiKey}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );
    if (!response.ok) {
      return 'Vị trí hiện tại';
    }
    const data = await response.json() as { results?: Array<{ formatted_address?: string }> };
    return data.results?.[0]?.formatted_address || 'Vị trí hiện tại';
  } catch {
    return 'Vị trí hiện tại';
  }
}

async function fetchNearbyGooglePlaces(center: { lat: number; lng: number }): Promise<RestaurantRecommendation[]> {
  try {
    const result = await searchNearbyPlaces(center, 5000);
    return result.places.slice(0, 12).map((place) => ({
      id: place.id,
      name: place.name || 'Quán chay gần đây',
      address: place.address || 'Google Maps',
      description: place.typeLabel || 'Quán ăn chay gần vị trí của bạn.',
      tag: 'Chay',
      price: place.price || 'Liên hệ',
      rating: '4.7/5',
      signature: 'Được tìm theo Google Maps',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
      coords: { lat: place.lat, lng: place.lng },
    }));
  } catch {
    return [];
  }
}

export default function ExplorePage() {
  const [locationSelection, setLocationSelection] = useState<LocationSelection>({
    province: 'Cần Thơ',
    district: '',
    ward: '',
    point: '',
  });

  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [currentAddress, setCurrentAddress] = useState('Vị trí hiện tại');
  const [isLocating, setIsLocating] = useState(false);
  const [googlePlaces, setGooglePlaces] = useState<RestaurantRecommendation[]>([]);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(nextLocation);
        void reverseGeocodeAddress(nextLocation).then(setCurrentAddress);
      },
      () => {
        setCurrentLocation({ lat: 10.0452, lng: 105.7469 });
        setCurrentAddress('Cần Thơ');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  const locationCenter = useMemo(() => buildLocationCenter(locationSelection), [locationSelection]);

  const activeSearchCenter = useMemo(() => {
    if (locationSelection.ward || locationSelection.district || locationSelection.point) {
      return locationCenter;
    }
    return currentLocation ?? { lat: 10.0452, lng: 105.7469 };
  }, [currentLocation, locationCenter, locationSelection.district, locationSelection.point, locationSelection.ward]);

  useEffect(() => {
    void fetchNearbyGooglePlaces(activeSearchCenter).then((data) => {
      setGooglePlaces(data);
    });
  }, [activeSearchCenter]);

  const provinceOptions = useMemo(() => getProvinceOptions(), []);
  const districtOptions = useMemo(() => getDistrictOptions(locationSelection.province), [locationSelection.province]);
  const wardOptions = useMemo(
    () => getWardOptions(locationSelection.province, locationSelection.district),
    [locationSelection.district, locationSelection.province],
  );

  const sourceRestaurants = googlePlaces;

  const nearbyRestaurants = useMemo(() => {
    const referenceCenter = activeSearchCenter;

    return sourceRestaurants
      .filter((restaurant) => {
        if (locationSelection.district || locationSelection.ward || locationSelection.point) {
          const inAddressMatch = matchesLocationFilter(restaurant.address, locationSelection);
          if (!inAddressMatch) {
            return false;
          }
        }

        const distance = distanceBetweenMeters(referenceCenter, restaurant.coords);
        return distance <= 2500;
      })
      .sort((a, b) => {
        const distanceA = distanceBetweenMeters(referenceCenter, a.coords);
        const distanceB = distanceBetweenMeters(referenceCenter, b.coords);
        return distanceA - distanceB;
      });
  }, [activeSearchCenter, locationSelection, sourceRestaurants]);

  function updateLocation(key: keyof LocationSelection, value: string) {
    setLocationSelection((current) => {
      if (key === 'province') {
        return { province: value, district: '', ward: '', point: '' };
      }
      if (key === 'district') {
        return { ...current, district: value, ward: '', point: '' };
      }
      if (key === 'ward') {
        return { ...current, ward: value, point: '' };
      }
      return { ...current, point: value };
    });
  }

  function syncCurrentLocation() {
    if (!navigator.geolocation) {
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setCurrentLocation(nextLocation);
        void reverseGeocodeAddress(nextLocation).then(setCurrentAddress);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  const nearestRestaurant = nearbyRestaurants[0];

  return (
    <FeaturePageLayout
      badge="Explore"
      title="Khám phá quán chay gần bạn"
      subtitle="Chọn tỉnh, quận/huyện và xã/phường để xem danh sách quán chay phù hợp ở quanh khu vực bạn muốn truy cập."
    >
      <section className="feature-page-grid feature-page-grid--two">
        <div className="feature-panel feature-panel--highlight">
          <div className="feature-panel-head">
            <span>Vị trí đang chọn</span>
            <strong>{currentAddress}</strong>
          </div>

          <div className="feature-chip-row">
            <span className="feature-chip">Vị trí: {currentAddress}</span>
            {currentLocation && (
              <span className="feature-chip">
                {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
              </span>
            )}
          </div>

          <div className="selector-grid">
            <label className="select-field">
              <span>Tỉnh / Thành phố</span>
              <select value={locationSelection.province} onChange={(event) => updateLocation('province', event.target.value)}>
                {provinceOptions.map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </label>

            <label className="select-field">
              <span>Quận / Huyện</span>
              <select
                value={locationSelection.district}
                onChange={(event) => updateLocation('district', event.target.value)}
                disabled={!districtOptions.length}
              >
                <option value="">Chọn quận / huyện</option>
                {districtOptions.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </label>

            <label className="select-field">
              <span>Phường / Xã</span>
              <select
                value={locationSelection.ward}
                onChange={(event) => updateLocation('ward', event.target.value)}
                disabled={!wardOptions.length}
              >
                <option value="">Chọn phường / xã</option>
                {wardOptions.map((ward) => (
                  <option key={ward} value={ward}>{ward}</option>
                ))}
              </select>
            </label>

            <label className="select-field">
              <span>Địa chỉ cụ thể</span>
              <input
                type="text"
                value={locationSelection.point}
                onChange={(event) => updateLocation('point', event.target.value)}
                placeholder="Ví dụ: Đường 3/2"
                disabled={!locationSelection.district}
              />
            </label>
          </div>

          <div className="feature-chip-row">
            <span className="feature-chip">Bán kính 1.5km</span>
            <span className="feature-chip">Chay lành mạnh</span>
            <span className="feature-chip">Gợi ý theo vị trí</span>
          </div>

          <button type="button" className="feature-chip" onClick={syncCurrentLocation} disabled={isLocating}>
            {isLocating ? 'Đang cập nhật vị trí...' : 'Cập nhật vị trí hiện tại'}
          </button>

          <div className="big-metric">
            <strong>{nearbyRestaurants.length}</strong>
            <span>quán chay phù hợp</span>
          </div>
        </div>

        <div className="feature-panel">
          <div className="mini-list">
            <div>
              <span>Địa điểm gần nhất</span>
              <strong>{nearestRestaurant ? nearestRestaurant.name : 'Chưa có quán phù hợp'}</strong>
            </div>
            <div>
              <span>Đánh giá</span>
              <strong>{nearestRestaurant ? nearestRestaurant.rating : '0.0/5'}</strong>
            </div>
            <div>
              <span>Khoảng cách</span>
              <strong>
                {nearestRestaurant
                  ? `${Math.round(distanceBetweenMeters(activeSearchCenter, nearestRestaurant.coords))}m`
                  : '0m'}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-card-list">
        {nearbyRestaurants.length === 0 ? (
          <div className="empty-state feature-panel">
            Chưa có quán ăn chay nào phù hợp trong khu vực này. Hãy thử đổi quận, phường hoặc nhập địa chỉ cụ thể.
          </div>
        ) : (
          nearbyRestaurants.map((item, index) => (
            <article
              key={item.id}
              className="feature-result-card feature-result-card--animate"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div
                className="feature-result-visual"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(28, 73, 59, 0.28), rgba(28, 73, 59, 0.08)), url(${item.image})`,
                }}
                aria-hidden="true"
              />
              <div className="feature-result-body">
                <div className="feature-result-topline">
                  <span className="feature-tag">{item.tag}</span>
                  <span className="feature-price">{item.price}</span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.address}</p>
                <div className="feature-result-meta">
                  <span>{item.signature}</span>
                  <strong>⭐ {item.rating}</strong>
                </div>
                <a
                  className="direction-link"
                  href={buildDirectionsUrl(item, currentLocation)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Chỉ đường
                </a>
              </div>
            </article>
          ))
        )}
      </section>
    </FeaturePageLayout>
  );
}
