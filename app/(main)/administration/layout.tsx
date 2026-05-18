'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/app/sidebar/page';

const administrationLinks = [
  { header: 'Oversight' },
  { label: 'Visitors', href: '/administration/visitors' },
  { label: 'Chief Vigilance Officer', href: '/administration/cvo' },
  
  { header: 'Leadership' },
  { label: 'Chairperson', href: '/administration/chairperson' },
  { label: 'Institute Coordinators', href: '/administration/institute-coordinators' },
  { label: 'Deans & Assoc. Deans', href: '/administration/deans' },
  
  { header: 'Executive' },
  { label: 'Director', href: '/administration/director' },
  { label: 'Head of Departments', href: '/administration/hod' },
  { label: 'Faculty Incharges', href: '/administration/faculty-incharges' },
  
  { header: 'Registry' },
  { label: 'Registrar & Staff', href: '/administration/registrar' },
  { label: 'Nodal Officers', href: '/administration/nodal-officers' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full min-h-screen flex flex-row">
      <Sidebar
        heading="Administration"
        links={administrationLinks}
        downlink="Back to Home"
        downlinkHref="/admin"
        activeLink={pathname}
      />
      <div className="w-[80%] bg-[#F9F9F9]">{children}</div>
    </div>
  );
}
