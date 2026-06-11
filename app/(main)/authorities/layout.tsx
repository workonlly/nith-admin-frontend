'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/app/sidebar/page';

const authoritiesLinks = [
  { label: 'Board of Governors (BOG)', href: '/authorities/bog' },
  { label: 'Senate', href: '/authorities/senate' },
  { label: 'Finance Committee (FC)', href: '/authorities/fc' },
  { label: 'Building & Works Committee (BWC)', href: '/authorities/bwc' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full min-h-screen flex flex-row">
      <Sidebar
        heading="Authorities"
        links={authoritiesLinks}
        downlink="Back to Home"
        downlinkHref="/admin"
        activeLink={pathname}
      />
      <div className="w-[80%] bg-[#F9F9F9]">{children}</div>
    </div>
  );
}