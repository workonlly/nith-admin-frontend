'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/app/sidebar/page';

const homeLinks = [
  {
    label: 'Dashboard',
    href: '/home',
  },

  {
    label: 'Hero Section',
    href: '/home/hero',
  },

  {
    label: 'About Us',
    href: '/home/about',
  },

  {
    label: 'Academics',
    href: '/home/academics',
  },

  {
    label: 'Admissions',
    href: '/home/admissions',
  },

  {
    label: 'Achievements',
    href: '/home/achievements',
  },

  {
    label: 'Director',
    href: '/home/director',
  },

  {
    label: 'Events',
    href: '/home/events',
  },

  {
    label: 'Gallery',
    href: '/home/gallery',
  },

  {
    label: 'News',
    href: '/home/news',
  },

  {
    label: 'Placements',
    href: '/home/placements',
  },

  // =========================
  // ADD NEW SECTIONS HERE
  // =========================

];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="w-full min-h-screen flex">
      {/* SIDEBAR */}
      <Sidebar
        heading="Home CMS"
        links={homeLinks}
        downlink="Back to Admin"
        downlinkHref="/admin"
        activeLink={pathname}
      />

      {/* CONTENT */}
      <div className="flex-1 bg-[#F9F9F9] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}