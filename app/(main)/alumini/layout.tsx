'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/app/sidebar/page';

const alumniLinks = [
  { header: 'Engagement & Governance' },
  { label: 'Activities', href: '/alumini/activites' },
  { label: 'Functionaries', href: '/alumini/functionaries' },
  { label: 'Alumni Related Notices', href: '/alumini/alumini-realted-notices' },
  { label: 'Alumni Related MoU', href: '/alumini/alumni-related-mou' },
  { label: 'Alumni Assist', href: '/alumini/alumni-assist' },

  { header: 'Network & Community' },
  { label: 'List of Alumni', href: '/alumini/list-of-alumini' },
  { label: 'Alumni Registration', href: '/alumini/registration' },
  { label: 'Local Chapters', href: '/alumini/local-chapters' },
  { label: 'Annual Alumni Meet', href: '/alumini/annual-meet' },
  { label: 'Distinguished Alumni', href: '/alumini/distinguished' },

  { header: 'Impact, Funds & Services' },
  { label: 'Endowment Fund', href: '/alumini/endowment-fund' },
  { label: 'Award Initiatives', href: '/alumini/award-initiatives' },
  { label: 'Alumni Network / Portal', href: '/alumini/netwrok' },
  { label: 'Alumni Related Services', href: '/alumini/alumni-related-services' },
  { label: 'Alumni Affair Activities', href: '/alumini/alumni-affair-activites' },
  { label: 'Resource Generation Activities', href: '/alumini/resource-generation-activities' },
  { label: 'Portal', href: '/alumini/portal' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full min-h-screen flex flex-row">
      <Sidebar
        heading="Alumni Section"
        links={alumniLinks}
        downlink="Back to CMS Hub"
        downlinkHref="/admin"
        activeLink={pathname}
      />
      <div className="flex-1 bg-[#F9F9F9] min-w-0 overflow-y-auto">{children}</div>
    </div>
  );
}
