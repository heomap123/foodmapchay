import FeaturePageLayout from './FeaturePageLayout';

const savedItems = [
  { name: 'Bánh mì chay Cần Thơ', category: 'Bánh mì', note: 'Món yêu thích' },
  { name: 'Bún chay 3 miền', category: 'Bún', note: 'Đã lưu hôm nay' },
  { name: 'Nhà hàng chay Sài Gòn', category: 'Set dinner', note: 'Nên thử' },
];

export default function SavedPage() {
  return (
    <FeaturePageLayout
      badge="Saved"
      title="Những món bạn đã lưu"
      subtitle="Theo dõi danh sách món ăn yêu thích và nơi bạn muốn quay lại trong tương lai."
    >
      <section className="saved-grid">
        {savedItems.map((item, index) => (
          <article key={item.name} className="saved-card feature-result-card--animate" style={{ animationDelay: `${index * 120}ms` }}>
            <div className="saved-image" aria-hidden="true" />
            <div className="saved-body">
              <span>{item.category}</span>
              <h3>{item.name}</h3>
              <p>{item.note}</p>
            </div>
          </article>
        ))}
      </section>
    </FeaturePageLayout>
  );
}
