import FeaturePageLayout from './FeaturePageLayout';

const posts = [
  { title: 'Top 5 món chay hiệu quả cho ngày bận rộn', author: 'Linh T.', likes: '1.8k' },
  { title: 'Cách phối món chay đẹp mắt cho bữa tối', author: 'An Nhiên', likes: '920' },
  { title: 'Review quán chay mới mở ở trung tâm', author: 'Duy Khang', likes: '1.3k' },
];

export default function FeedPage() {
  return (
    <FeaturePageLayout
      badge="Feed"
      title="Bảng tin chia sẻ thú vị"
      subtitle="Theo dõi các bài viết, mẹo ăn uống và trải nghiệm mới từ cộng đồng LocaFood."
    >
      <section className="feature-feed-list">
        {posts.map((post, index) => (
          <article key={post.title} className="feed-card feature-result-card--animate" style={{ animationDelay: `${index * 120}ms` }}>
            <div className="feed-visual" aria-hidden="true" />
            <div className="feed-body">
              <div className="feed-meta">
                <span>{post.author}</span>
                <span>•</span>
                <span>2 giờ trước</span>
              </div>
              <h3>{post.title}</h3>
              <p>
                Khám phá những món chay vừa ngon, vừa dễ chuẩn bị và hợp với thời gian bận rộn của bạn.
              </p>
              <div className="feed-actions">
                <button type="button">❤ {post.likes}</button>
                <button type="button">💬 84</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </FeaturePageLayout>
  );
}
