import FeaturePageLayout from './FeaturePageLayout';

const favorites = ['Bánh mì chay', 'Bún chay', 'Cơm chay', 'Mì chay'];

export default function ProfilePage() {
  return (
    <FeaturePageLayout
      badge="Profile"
      title="Cá nhân của bạn"
      subtitle="Quản lý thông tin cá nhân, sở thích ẩm thực và danh sách yêu thích của bạn."
    >
      <section className="profile-page-grid">
        <article className="profile-summary feature-panel feature-panel--highlight">
          <div className="profile-avatar-lg" aria-hidden="true" />
          <div>
            <span className="feature-panel-label">Tài khoản</span>
            <h3>locafood.test.user2</h3>
            <p>Yêu thích món chay, bữa sáng nhanh và không gian xanh.</p>
          </div>
        </article>

        <div className="profile-stats-grid">
          <div className="stat-box">
            <strong>128</strong>
            <span>Người theo dõi</span>
          </div>
          <div className="stat-box">
            <strong>84</strong>
            <span>Đang theo dõi</span>
          </div>
          <div className="stat-box">
            <strong>25</strong>
            <span>Quán yêu thích</span>
          </div>
        </div>
      </section>

      <section className="feature-panel">
        <span className="feature-panel-label">Món yêu thích</span>
        <div className="favorite-tags">
          {favorites.map((item) => (
            <span key={item} className="feature-chip">{item}</span>
          ))}
        </div>
      </section>
    </FeaturePageLayout>
  );
}
