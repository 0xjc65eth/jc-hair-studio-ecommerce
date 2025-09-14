import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mega Hair Premium - Studio Premium Hair',
  description: 'Catálogo completo de mega hair 100% natural. Extensões de cabelo premium com entrega em toda a Europa.',
  keywords: [
    'mega hair',
    'extensões cabelo',
    'cabelo natural',
    'studio premium hair',
    'mega hair premium',
    'extensões naturais'
  ],
};

interface MegaHairLayoutProps {
  children: React.ReactNode;
}

export default function MegaHairLayout({ children }: MegaHairLayoutProps) {
  return (
    <div className="mega-hair-section">
      {children}
    </div>
  );
}