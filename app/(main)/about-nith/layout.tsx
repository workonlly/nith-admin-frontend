'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/app/sidebar/page';

const aboutNithLinks = [
  { label: 'History', href: '/about-nith/history' },
  { label: 'About The City', href: '/about-nith/about-city' },
  { label: 'Vision & Mission', href: '/about-nith/vision-mission' },
  { label: 'Goals', href: '/about-nith/goals' },
  { label: 'Core Values', href: '/about-nith/core-values' },
  { label: 'Connectivity', href: '/about-nith/connectivity' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full min-h-screen flex flex-row">
      <Sidebar
        heading="About NITH"
        links={aboutNithLinks}
        downlink="Back to Home"
        downlinkHref="/admin"
        activeLink={pathname}
      />
      <div className="w-[80%] bg-[#F9F9F9]">{children}</div>
    </div>
  );
}