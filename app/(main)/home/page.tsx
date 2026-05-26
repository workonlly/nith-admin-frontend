'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';

interface SectionItem {
  id: number;
  title: string;
  description: string;
  href: string;
}

const sections: SectionItem[] = [
  {
    id: 1,
    title: 'Hero Section',
    description: 'Main banner and hero content',
    href: '/home/hero',
  },
  {
    id: 2,
    title: 'About Us',
    description: 'Institution overview and information',
    href: '/home/about',
  },
  {
    id: 3,
    title: 'Academics',
    description: 'Courses, curriculum and academic structure',
    href: '/home/academics',
  },
  {
    id: 4,
    title: 'Admissions',
    description: 'Admission process and eligibility details',
    href: '/home/admissions',
  },
  {
    id: 5,
    title: 'Achievements',
    description: 'School achievements and awards',
    href: '/home/achievements',
  },
  {
    id: 6,
    title: 'Director Message',
    description: 'Message from the director',
    href: '/home/director',
  },
  {
    id: 7,
    title: 'Events',
    description: 'Upcoming and past events',
    href: '/home/events',
  },
  {
    id: 8,
    title: 'Gallery',
    description: 'Photo and media gallery',
    href: '/home/gallery',
  },
  {
    id: 9,
    title: 'News',
    description: 'Latest news and updates',
    href: '/home/news',
  },
  {
    id: 10,
    title: 'Placements',
    description: 'Placement records and statistics',
    href: '/home/placements',
  },
];

export default function HomePage() {
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#631012] to-[#7a1214] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Home className="w-7 h-7" />

          <h1 className="text-3xl font-bold">
            Homepage Sections
          </h1>
        </div>

        <p className="text-white/80">
          Static overview of all homepage CMS sections.
        </p>
      </div>

      {/* SECTIONS LIST */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="bg-white rounded-2xl border p-5 shadow-sm"
          >
            <h2 className="font-bold text-lg mb-1">
              {index + 1}. {section.title}
            </h2>

            <p className="text-gray-500">
              {section.description}
            </p>

            <Link
              href={section.href}
              className="inline-block mt-3 text-[#631012] font-medium hover:underline"
            >
              Open Section →
            </Link>
          </div>
        ))}
      </div>

      {/* PREVIEW SIDEBAR */}
      <div className="bg-white rounded-2xl p-6 border">
        <h2 className="text-2xl font-bold mb-6">
          Sidebar Preview
        </h2>

        <div className="space-y-2">
          {sections.map((section) => (
            <Link
              key={section.id}
              href={section.href}
              className="block px-4 py-3 rounded-xl bg-[#F9F9F9] hover:bg-[#631012] hover:text-white transition-all"
            >
              {section.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}