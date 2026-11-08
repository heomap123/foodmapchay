import FeaturePageLayout from './FeaturePageLayout';

const events = [
  { title: 'Night Market Chay', date: '12/11', location: 'Cần Thơ Center', attendees: '180 người' },
  { title: 'Workshop Nấu Món Chay', date: '18/11', location: 'Eco Kitchen', attendees: '95 người' },
  { title: 'Food Fair Vegan', date: '25/11', location: 'Công viên Hòa Bình', attendees: '240 người' },
];

export default function EventsPage() {
  return (
    <FeaturePageLayout
      badge="Events"
      title="Sự kiện ẩm thực hấp dẫn"
      subtitle="Tham gia các hoạt động, workshop và hội chợ ẩm thực chay gần bạn."
    >
      <section className="feature-event-grid">
        {events.map((event, index) => (
          <article key={event.title} className="event-card feature-result-card--animate" style={{ animationDelay: `${index * 140}ms` }}>
            <div className="event-date">
              <strong>{event.date}</strong>
            </div>
            <div className="event-body">
              <span className="event-tag">Sắp diễn ra</span>
              <h3>{event.title}</h3>
              <p>{event.location}</p>
              <div className="event-footer">
                <span>{event.attendees}</span>
                <button type="button">Đặt chỗ</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </FeaturePageLayout>
  );
}
