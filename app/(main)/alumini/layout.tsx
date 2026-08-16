'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/app/sidebar/page';

const homeLinks = [
  { label: 'Activities', href: '/alumini/activites' },
  { label: 'Alumni Related Notices', href: '/alumini/alumini-realted-notices' },
  { label: 'Alumni Related MoU', href: '/alumini/alumni-related-mou' },
  { label: 'List of Alumni', href: '/alumini/list-of-alumini' },
  { label: 'Alumni Registration', href: '/alumini/registration' },
  { label: 'Local Chapters', href: '/alumini/local-chapters' },
  { label: 'Annual Alumni Meet', href: '/alumini/annual-meet' },
  { label: 'Endowment Fund', href: '/alumini/endowment-fund' },
  { label: 'Award Initiatives', href: '/alumini/award-initiatives' },
  { label: 'Alumni Network / Portal', href: '/alumini/netwrok' },
  { label: 'Functionaries', href: '/alumini/functionaries' },
  { label: 'Alumni Related Services', href: '/alumini/alumni-related-services' },
  { label: 'Alumni Assist', href: '/alumini/alumni-assist' },
  { label: 'Distinguished Alumni', href: '/alumini/distinguished' },
  { label: 'Alumni Affair Activities', href: '/alumini/alumni-affair-activites' },
  { label: 'Resource Generation Activities', href: '/alumini/resource-generation-activities' },
  { label: 'Portal', href: '/alumini/portal' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full min-h-screen flex flex-row">
      <Sidebar
        heading="Home"
        links={homeLinks}
        downlink="Back to Home"
        downlinkHref="/admin"
        activeLink={pathname}
      />
      <div className="w-[80%] bg-[#F9F9F9]">{children}</div>
    </div>
  );
}
