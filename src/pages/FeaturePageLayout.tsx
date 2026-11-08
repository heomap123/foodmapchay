import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type FeaturePageLayoutProps = {
  badge: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function FeaturePageLayout({ badge, title, subtitle, children }: FeaturePageLayoutProps) {
  return (
    <main className="feature-page">
      <div className="feature-page-shell">
        <nav className="feature-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{badge}</span>
        </nav>

        <header className="feature-page-header">
          <div>
            <span className="feature-page-badge">{badge}</span>
            <h1>{title}</h1>
          </div>
          <p>{subtitle}</p>
        </header>

        {children}
      </div>
    </main>
  );
}
