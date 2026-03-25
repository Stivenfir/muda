import type { ReactNode } from 'react';

interface PageCardProps {
  title: string;
  children: ReactNode;
}

function PageCard({ title, children }: PageCardProps) {
  return (
    <div
      style={{
        background: '#1f2937',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        color: '#f9fafb',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      }}
    >
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {children}
    </div>
  );
}

export default PageCard;