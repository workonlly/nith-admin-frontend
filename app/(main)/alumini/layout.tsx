'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/app/sidebar/page';

const homeLinks = [
  { label: 'Activites', href: '/alumini/activites' },
  { label: 'Functionaries', href: '/alumini/functionaries' },
  {
    label: 'Alumni Related Services ',
    href: '/alumini/alumni-related-services',
  },
  { label: 'Alumni Related Mou', href: '/alumini/alumni-related-mou' },
  { label: 'Alumni Assist', href: '/alumini/alumni-assist' },
  { label: 'Distinguished Alumni', href: '/alumini/distinguished' },
  {
    label: 'Alumni Affair Activites',
    href: '/alumini/alumni-affair-activites',
  },
  {
    label: 'Resource Generation Activities',
    href: '/alumini/resource-generation-activities',
  },
  { label: 'Portal', href: '/alumini/portal' },
  { label: 'Alumni Registration', href: '/alumini/registration' },
  { label: 'Endowment Fund', href: '/alumini/endowment-fund' },
  { label: 'Award Initiatives', href: '/alumini/award-initiatives' },
  { label: 'Annual Meet', href: '/alumini/annual-meet' },
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
