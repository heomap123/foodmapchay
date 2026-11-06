import { useMemo, useState } from 'react';
import {
  buildLocationLabel,
  getDistrictOptions,
  getProvinceOptions,
  getWardOptions,
  matchesLocationFilter,
  type LocationSelection,
} from './services/location';
import { useAuth } from './AuthContext';

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

type FeatureCard = {
  key: string;
  label: string;
  subtitle: string;
  image: string;
  cta: string;
  variant?: 'light' | 'dark';
};

const featureCards: FeatureCard[] = [
  {
    key: 'explore',
    label: 'Explore',
    subtitle: 'Khám phá quán chay gần bạn',
    image:
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80',
    cta: 'Khám phá',
    variant: 'dark',
  },
  {
    key: 'community',
    label: 'Community',
    subtitle: 'Cộng đồng người ăn chay',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
    cta: 'Tham gia',
    variant: 'light',
  },
  {
    key: 'feed',
    label: 'Feed',
    subtitle: 'Bảng tin chia sẻ thú vị',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80',
    cta: 'Xem ngay',
    variant: 'dark',
  },
  {
    key: 'events',
    label: 'Events',
    subtitle: 'Sự kiện ẩm thực hấp dẫn',
    image:
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1000&q=80',
    cta: 'Xem chi tiết',
    variant: 'light',
  },
  {
    key: 'saved',
    label: 'Saved',
    subtitle: 'Đã lưu những món yêu thích',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80',
    cta: 'Xem danh sách',
    variant: 'light',
  },
  {
    key: 'profile',
    label: 'Profile',
    subtitle: 'Cá nhân của bạn',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80',
    cta: 'Xem hồ sơ',
    variant: 'dark',
  },
];

const restaurantData: RestaurantRecommendation[] = [
  {
    id: '1',
    name: 'Bánh mì chay Cần Thơ',
    address: '123 Đường 3/2, Ninh Kiều, Cần Thơ',
    description: 'Bánh mì nóng kèm chả chay, dưa leo và rau thơm, thích hợp cho bữa sáng nhanh.',
    tag: 'Bánh mì',
    price: '25.000đ - 50.000đ',
    rating: '4.8/5',
    signature: 'Món nổi bật: Bánh mì chay đặc biệt',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
    coords: { lat: 10.0384, lng: 105.7821 },
  },
  {
    id: '2',
    name: 'Bún chay Cần Thơ',
    address: '88 Lý Tự Trọng, Ninh Kiều, Cần Thơ',
    description: 'Bún ăn sáng ngon, đầy đặn với đậu hũ, rau, giá và nước dùng thơm.',
    tag: 'Bún',
    price: '22.000đ - 45.000đ',
    rating: '4.7/5',
    signature: 'Món nổi bật: Bún chay đặc biệt',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
    coords: { lat: 10.0329, lng: 105.7828 },
  },
  {
    id: '3',
    name: 'Nhà hàng Chay Cần Thơ',
    address: '45 Nguyễn Văn Linh, Ninh Kiều, Cần Thơ',
    description: 'Combo chay truyền thống với đậu hũ, rau, bún và canh ngon cho bữa trưa đầy đủ.',
    tag: 'Set lunch',
    price: '60.000đ - 110.000đ',
    rating: '4.9/5',
    signature: 'Món nổi bật: Bún chay kiểu Bạc Liêu',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    coords: { lat: 10.0348, lng: 105.7802 },
  },
  {
    id: '4',
    name: 'Quán Rau Củ chay Cần Thơ',
    address: '221 Võ Văn Kiệt, Ô Môn, Cần Thơ',
    description: 'Đồ chay tươi, nhiều lựa chọn từ bún riêu đến cơm chiên nấm và lẩu chay.',
    tag: 'Quán ăn',
    price: '45.000đ - 90.000đ',
    rating: '4.8/5',
    signature: 'Món nổi bật: Cơm chiên chay nấm',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
    coords: { lat: 10.1247, lng: 105.6329 },
  },
  {
    id: '5',
    name: 'Cơm chay Hạnh Phúc',
    address: '21 Hòa Bình, Ninh Kiều, Cần Thơ',
    description: 'Đồ ăn nhẹ, đơn giản, dễ ăn và rất phù hợp cho buổi chiều mát mẻ.',
    tag: 'Cơm',
    price: '35.000đ - 70.000đ',
    rating: '4.7/5',
    signature: 'Món nổi bật: Cơm chay đặc biệt',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    coords: { lat: 10.0421, lng: 105.7774 },
  },
  {
    id: '6',
    name: 'Mì chay Hương An',
    address: '67 Trần Hưng Đạo, Bình Thủy, Cần Thơ',
    description: 'Mì chay đậm vị, nhiều nấm và rau, rất hợp cho chiều thư giãn.',
    tag: 'Mì',
    price: '40.000đ - 75.000đ',
    rating: '4.9/5',
    signature: 'Món nổi bật: Mì chay nóng hổi',
    image: 'https://images.unsplash.com/photo-1512058564366-cd4ce903b1a5?auto=format&fit=crop&w=900&q=80',
    coords: { lat: 10.0705, lng: 105.7488 },
  },
];

const profileFavorites = [
  {
    id: 'fav-1',
    name: 'Bánh mì chay Cần Thơ',
    type: 'Bánh mì',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'fav-2',
    name: 'Bún chay Cần Thơ',
    type: 'Món chính',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'fav-3',
    name: 'Nhà hàng Chay Cần Thơ',
    type: 'Set lunch',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
  },
];

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

function buildDirectionsUrl(place: RestaurantRecommendation): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${place.name}, ${place.address}`)}`;
}

export default function App() {
  const { user, signOut } = useAuth();
  const [showExplore, setShowExplore] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [locationSelection, setLocationSelection] = useState<LocationSelection>({
    province: 'Cần Thơ',
    district: '',
    ward: '',
    point: '',
  });

  const provinceOptions = useMemo(() => getProvinceOptions(), []);
  const districtOptions = useMemo(() => getDistrictOptions(locationSelection.province), [locationSelection.province]);
  const wardOptions = useMemo(
    () => getWardOptions(locationSelection.province, locationSelection.district),
    [locationSelection.district, locationSelection.province],
  );

  const currentUser = user
    ? {
        id: user.id,
        email: user.email ?? 'user@gmail.com',
        name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Người dùng',
        avatar:
          user.user_metadata?.avatar_url ??
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
      }
    : null;

  const locationCenter = useMemo(() => buildLocationCenter(locationSelection), [locationSelection]);

  const nearbyRestaurants = useMemo(() => {
    return restaurantData
      .filter((restaurant) => {
        const inAddressMatch = matchesLocationFilter(restaurant.address, locationSelection);
        if (!inAddressMatch) return false;
        const distance = distanceBetweenMeters(locationCenter, restaurant.coords);
        return distance <= 1500;
      })
      .sort((a, b) => {
        const distanceA = distanceBetweenMeters(locationCenter, a.coords);
        const distanceB = distanceBetweenMeters(locationCenter, b.coords);
        return distanceA - distanceB;
      });
  }, [locationCenter, locationSelection]);

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

  async function handleLogout() {
    try {
      const { error } = await signOut();

      if (error) {
        setAuthError(error.message);
        return;
      }

      setShowProfile(false);
      setAuthError(null);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Đăng xuất thất bại.');
    }
  }

  return (
    <main className="veggie-page">
      <header className="veggie-header">
        <div className="brand-block" aria-label="LocaFood brand">
          <div className="brand-mark">🌿</div>
          <div className="brand-copy">
            <span className="brand-name">LocaFood</span>
            <small>Eat Green • Live Healthy • Together</small>
          </div>
        </div>

        <label className="search-bar" aria-label="Search for vegan restaurants">
          <span className="search-icon">⌕</span>
          <input type="text" value="Search for vegan restaurants, dishes, or communities..." readOnly />
          <span className="search-shortcut">Ctrl</span>
          <span className="search-shortcut key">K</span>
        </label>

        <div className="header-actions">
          <button type="button" className="location-pill" onClick={() => setShowExplore((value) => !value)}>
            <span className="pill-dot" aria-hidden="true" />
            {locationSelection.province}
          </button>
          <button type="button" className="icon-button" aria-label="Notifications">
            🔔
          </button>

          {currentUser && (
            <>
              <button type="button" className="profile-auth-button" onClick={() => setShowProfile((value) => !value)}>
                <img src={currentUser.avatar} alt={currentUser.name} className="header-avatar" />
                <span>{currentUser.name}</span>
              </button>

              <button type="button" className="logout-button" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </header>

      <section className="hero-banner" aria-label="Hero banner">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-icon">🌿</span>
            Good Food. Good Vibes.
          </div>

          <h1>
            Discover the Best
            <span>Vegan &amp; Vegetarian Spots</span>
          </h1>

          <div className="hero-links">
            <span>Explore</span>
            <span className="dot-separator">•</span>
            <span>Connect</span>
            <span className="dot-separator">•</span>
            <span>Share</span>
          </div>

          <button type="button" className="cta-button" onClick={() => setShowExplore(true)}>
            Start Exploring
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80"
            alt="Healthy vegan bowl"
          />
        </div>

        <div className="hero-note">
          A Greener
          <span>Choice for</span>
          <span>a Better Tomorrow</span>
        </div>

        <button type="button" className="chevron chevron-left" aria-label="Previous slide">‹</button>
        <button type="button" className="chevron chevron-right" aria-label="Next slide">›</button>

        <div className="hero-dots" aria-hidden="true">
          <span className="dot active" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </section>

      <section className="feature-grid" aria-label="Main feature tiles">
        {featureCards.map((card) => (
          <article
            key={card.key}
            className={`feature-card ${card.variant === 'dark' ? 'feature-card--dark' : 'feature-card--light'}`}
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(9, 29, 20, 0.18), rgba(9, 29, 20, 0.1)), url(${card.image})`,
            }}
            onClick={() => {
              if (card.key === 'explore') {
                setShowExplore(true);
                setShowProfile(false);
              }
              if (card.key === 'profile') {
                setShowProfile(true);
                setShowExplore(false);
              }
            }}
          >
            <div className="feature-copy">
              <span className="feature-label">{card.label}</span>
              <h2>{card.subtitle}</h2>
              <button
                type="button"
                className="feature-cta"
                onClick={(event) => {
                  event.stopPropagation();
                  if (card.key === 'explore') {
                    setShowExplore(true);
                    setShowProfile(false);
                  }
                  if (card.key === 'profile') {
                    setShowProfile(true);
                    setShowExplore(false);
                  }
                }}
              >
                {card.cta}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        ))}
      </section>

      {showProfile && (
        <section className="profile-panel" aria-label="Profile information">
          <div className="profile-header">
            <div className="profile-avatar-wrap">
              <div
                className="profile-avatar"
                aria-label="User avatar"
                style={{
                  backgroundImage: `url(${currentUser?.avatar ?? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80'})`,
                }}
              />
            </div>

            <div className="profile-meta">
              <h2>{currentUser?.name ?? 'Ho Chi Minh City'}</h2>
              <p className="profile-email">{currentUser?.email ?? 'user@gmail.com'}</p>
              <p className="profile-intro">
                Tôi là người yêu ẩm thực chay, thích khám phá quán mới, món ngon lành mạnh và chia sẻ trải nghiệm với cộng đồng.
              </p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <span className="stat-label">Người theo dõi</span>
              <strong>8.4K</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">Đang theo dõi</span>
              <strong>352</strong>
            </div>
          </div>

          <div className="profile-section">
            <div className="section-heading">
              <h3>Các quán ăn yêu thích</h3>
            </div>

            <div className="favorite-list">
              {profileFavorites.map((place) => (
                <article key={place.id} className="favorite-item">
                  <img src={place.image} alt={place.name} />
                  <div className="favorite-copy">
                    <strong>{place.name}</strong>
                    <span>{place.type}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {authError && <div className="auth-error">{authError}</div>}

      {showExplore && (
        <section className="explore-panel" aria-label="Explore nearby vegan restaurants">
          <div className="explore-selector">
            <div className="selector-header">
              <span className="selector-title">Chọn vị trí</span>
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
                <span>Vị trí hiện tại</span>
                <input
                  type="text"
                  value={locationSelection.point}
                  onChange={(event) => updateLocation('point', event.target.value)}
                  placeholder="Ví dụ: Đường 3/2"
                  disabled={!locationSelection.district}
                />
              </label>
            </div>

            <div className="selection-summary">
              <span>Hiển thị quán ăn gần bạn trong bán kính 1.5km cho:</span>
              <strong>{buildLocationLabel(locationSelection)}</strong>
            </div>
          </div>

          <div className="restaurant-results">
            {nearbyRestaurants.length === 0 ? (
              <div className="empty-state">Chưa có quán ăn nào trong bán kính 1.5km cho vị trí này.</div>
            ) : (
              nearbyRestaurants.map((place) => (
                <article className="restaurant-card" key={place.id}>
                  <img className="restaurant-image" src={place.image} alt={place.name} />

                  <div className="restaurant-content">
                    <div className="restaurant-topline">
                      <span className="restaurant-tag">{place.tag}</span>
                      <span className="restaurant-price">{place.price}</span>
                    </div>

                    <h3>{place.name}</h3>
                    <p className="restaurant-address">{place.address}</p>
                    <p className="restaurant-description">{place.description}</p>

                    <div className="restaurant-meta">
                      <span>{place.signature}</span>
                      <span>⭐ {place.rating}</span>
                    </div>

                    <a className="direction-button" href={buildDirectionsUrl(place)} target="_blank" rel="noreferrer">
                      Chỉ đường
                    </a>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      )}

      <footer className="page-footer">
        <span>LocaFood</span>
        <em>—</em>
        <span>Together for a Greener Planet</span>
        <span className="footer-icon">♡</span>
      </footer>
    </main>
  );
}
