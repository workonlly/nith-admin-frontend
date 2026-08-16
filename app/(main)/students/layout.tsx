'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/app/sidebar/page';

const studentLinks = [
  { label: 'Activities', href: '/students/activities' },
  { label: 'Functionaries', href: '/students/functionaries' },
  {
    label: 'Student Related Notices',
    href: '/students/student-related-notices',
  },
  { label: 'SGRC', href: '/students/sgrc' },
  {
    label: 'Student Activities & Sports',
    href: '/students/student-activities-sports',
  },
  {
    label: 'Cultural Activities & Clubs',
    href: '/students/cultural-activities-clubs',
  },
  {
    label: 'Cultural Introduction & List',
    href: '/students/students-introduction-list',
  },
  {
    label: "Annual Cultural Festival (Hill'ffair)",
    href: '/students/annual-cultural-festival',
  },
  {
    label: 'Annual SPIC MACAY Activity',
    href: '/students/annual-spic-macay-activity',
  },
  {
    label: 'Student Discipline & Counselling',
    href: '/students/student-discipline-counselling',
  },
  { label: 'Discipline Rules', href: '/students/discipline-rules' },
  {
    label: 'Student Discipline Board',
    href: '/students/student-discipline-board',
  },
  { label: 'Counselling Rules', href: '/students/counselling-rules' },
  {
    label: 'Student Counselling Board',
    href: '/students/student-counselling-board',
  },
  { label: 'Council Rules', href: '/students/council-rules' },
  { label: 'Student Council Board', href: '/students/student-council-board' },
  { label: 'Anti Ragging Rules', href: '/students/anti-ragging-rules' },
  { label: 'Anti Ragging Committee', href: '/students/anti-ragging-committee' },
  {
    label: 'Student Hostels & Management',
    href: '/students/student-hostels-management',
  },
  { label: 'Hostels at NITH', href: '/students/hostels-at-nith' },
  { label: 'Hostel Management', href: '/students/hostel-management' },
  { label: 'Hostel Booklet', href: '/students/hostel-booklet' },
  {
    label: 'Technical Activities & Clubs',
    href: '/students/technical-activities-clubs',
  },
  {
    label: 'Technical Introduction & List',
    href: '/students/technical-introduction-list',
  },
  {
    label: 'Annual Technical Festival (Nimbus)',
    href: '/students/annual-technical-festival',
  },
  {
    label: 'Annual Innovation Activity',
    href: '/students/technical-annualinovation-activity',
  },
  {
    label: 'Student Welfare & Schemes',
    href: '/students/student-welfare-schemes',
  },
  {
    label: 'Scholarships and Fellowships',
    href: '/students/scholarships-fellowships',
  },
  { label: 'Prizes & Medals', href: '/students/prizes-medals' },
  { label: 'Insurance & Mediclaims', href: '/students/insurance-mediclaims' },
  {
    label: 'Sports Activities & Yoga',
    href: '/students/sports-activities-yoga',
  },
  {
    label: 'Sports Introduction & List',
    href: '/students/sports-introduction-list',
  },
  {
    label: 'Annual Sports Meet (Lalkaar)',
    href: '/students/annual-sports-meet',
  },
  { label: 'Annual Yoga Day', href: '/students/annual-yoga-day' },
  { label: 'NSS Activities', href: '/students/nss-activities' },
  { label: 'NCC Activities', href: '/students/ncc-activities' },
  { label: 'Publication Activities', href: '/students/publication-activities' },
  { label: 'Magazine Publication', href: '/students/magazine-publication' },
  {
    label: 'News Bulletin Publication',
    href: '/students/news-bulletin-publication',
  },
  { label: 'Newsletter Publication', href: '/students/newsletter-publication' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full min-h-screen flex flex-row">
      <Sidebar
        heading="Students"
        links={studentLinks}
        downlink="Back to Main Admin Panel"
        downlinkHref="/admin"
        activeLink={pathname}
      />
      <div className="w-[80%] bg-[#F9F9F9]">{children}</div>
    </div>
  );
}
