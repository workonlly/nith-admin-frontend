'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/app/sidebar/page';

const academicsLinks = [
  { header: 'General Affairs' },
  { label: 'Activities', href: '/academics/activities' },
  { label: 'Functionaries', href: '/academics/functionaries' },
  { label: 'Academic Notices', href: '/academics/academic-notices' },
  { label: 'NAD Cell', href: '/academics/nad-cell' },
  { label: 'Fee Structure', href: '/academics/fee-structure' },
  { label: 'Class Timetable', href: '/academics/class-timetable' },

  { header: 'Lifecycle' },
  { label: 'Admissions 2025-26', href: '/academics/admissions-2025-26' },
  { label: 'Registration 2025-26', href: '/academics/registration-2025-26' },
  { label: 'International Admissions', href: '/academics/international-admissions' },
  { label: 'Examinations & Evaluation', href: '/academics/examinations-evaluation' },
  { label: 'Results', href: '/academics/results' },

  { header: 'Programmes' },
  { label: 'Bachelor Ordinances', href: '/academics/bachelor-ordinances' },
  { label: 'Bachelor Syllabus', href: '/academics/bachelor-course-structure-syllabus' },
  { label: 'Master Ordinances', href: '/academics/master-ordinances' },
  { label: 'Master Syllabus', href: '/academics/master-course-structure-syllabus' },
  { label: 'Doctoral Ordinances', href: '/academics/doctoral-ordinances' },

  { header: 'Calendars' },
  { label: 'Academic Calender', href: '/academics/academic-calender' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full min-h-screen flex flex-row">
      <Sidebar
        heading="Academics"
        links={academicsLinks}
        downlink="Back to Main Admin Panel"
        downlinkHref="/admin"
        activeLink={pathname}
      />
      <div className="w-[80%] bg-[#F9F9F9]">{children}</div>
    </div>
  );
}
