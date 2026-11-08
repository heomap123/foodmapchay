import FeaturePageLayout from './FeaturePageLayout';

const members = [
  { name: 'Mai Linh', role: 'Chia sẻ món chay', active: 'Online' },
  { name: 'Duy Khang', role: 'Khám phá quán mới', active: '2 phút trước' },
  { name: 'An Nhiên', role: 'Mẹo ăn uống lành mạnh', active: 'Hôm nay' },
];

const topics = ['Món chay dễ làm ở nhà', 'Quán chay trong khu vực', 'Tiết kiệm ăn chay', 'Văn hóa thực phẩm xanh'];

export default function CommunityPage() {
  return (
    <FeaturePageLayout
      badge="Community"
      title="Cộng đồng người ăn chay"
      subtitle="Kết nối cùng những người yêu ẩm thực lành mạnh, sáng tạo và luôn sẵn sàng chia sẻ điều mới."
    >
      <section className="feature-page-grid feature-page-grid--three">
        <div className="feature-panel feature-panel--highlight">
          <span className="feature-panel-label">Trending</span>
          <h3>Top chủ đề</h3>
          <ul className="topic-list">
            {topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </div>

        <div className="feature-panel">
          <span className="feature-panel-label">Tương tác</span>
          <h3>Hôm nay</h3>
          <div className="mini-stat-stack">
            <div>
              <strong>1.2k</strong>
              <span>thành viên online</span>
            </div>
            <div>
              <strong>420</strong>
              <span>bài chia sẻ</span>
            </div>
          </div>
        </div>

        <div className="feature-panel">
          <span className="feature-panel-label">Bạn bè</span>
          <h3>Người đang theo dõi</h3>
          {members.map((member) => (
            <div key={member.name} className="member-row">
              <div className="member-avatar" aria-hidden="true" />
              <div>
                <strong>{member.name}</strong>
                <span>{member.role}</span>
              </div>
              <small>{member.active}</small>
            </div>
          ))}
        </div>
      </section>
    </FeaturePageLayout>
  );
}
