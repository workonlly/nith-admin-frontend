'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/app/sidebar/page';

const authoritiesLinks = [
  { label: 'Composition of BOG (Anchor)', href: '/authorities/compostion_of_bog' },
  { label: 'Minutes of BOG', href: '/authorities/bog' },
  { label: 'Composition of FC (Anchor)', href: '/authorities/compostion_of_fc' },
  { label: 'Minutes of FC', href: '/authorities/fc' },
  { label: 'Composition of BWC (Anchor)', href: '/authorities/compostion_of_bwc' },
  { label: 'Minutes of BWC', href: '/authorities/bwc' },
  { label: 'Composition of Senate', href: '/authorities/senate' },
  { label: 'Minutes of Senate', href: '/authorities/senate/minutes' },
  { label: 'All Anchor Links', href: '/authorities/anchor-links' },
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
