'use client';

import Link from 'next/link';
import { 
  Home, 
  LayoutTemplate, 
  Info, 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  User, 
  Calendar, 
  Image as ImageIcon, 
  Newspaper, 
  Briefcase,
  ArrowRight,
  Settings2,
  Sparkles
} from 'lucide-react';

interface SectionItem {
  id: number;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

const sections: SectionItem[] = [
  {
    id: 1,
    title: 'Hero Section',
    description: 'Main banner and hero content',
    href: '/home/hero',
    icon: LayoutTemplate,
  },
  {
    id: 2,
    title: 'About Us',
    description: 'Institution overview and information',
    href: '/home/about',
    icon: Info,
  },
  {
    id: 3,
    title: 'Academics',
    description: 'Courses, curriculum and academic structure',
    href: '/home/academics',
    icon: BookOpen,
  },
  {
    id: 4,
    title: 'Admissions',
    description: 'Admission process and eligibility details',
    href: '/home/admissions',
    icon: GraduationCap,
  },
  {
    id: 5,
    title: 'Achievements',
    description: 'School achievements and awards',
    href: '/home/achievements',
    icon: Trophy,
  },
  {
    id: 6,
    title: 'Director Message',
    description: 'Message from the director',
    href: '/home/director',
    icon: User,
  },
  {
    id: 7,
    title: 'Events',
    description: 'Upcoming and past events',
    href: '/home/events',
    icon: Calendar,
  },
  {
    id: 8,
    title: 'Gallery',
    description: 'Photo and media gallery',
    href: '/home/gallery',
    icon: ImageIcon,
  },
  {
    id: 9,
    title: 'News',
    description: 'Latest news and updates',
    href: '/home/news',
    icon: Newspaper,
  },
  {
    id: 10,
    title: 'Placements',
    description: 'Placement records and statistics',
    href: '/home/placements',
    icon: Briefcase,
  },
];

export default function HomePage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-gray-50/50">
      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#631012] via-[#7a1214] to-[#921b1e] rounded-3xl p-8 md:p-12 text-white shadow-xl shadow-[#631012]/10">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-10 pointer-events-none">
          <Settings2 className="w-96 h-96" />
        </div>
        <div className="absolute -bottom-10 -left-10 opacity-20 pointer-events-none">
          <Sparkles className="w-40 h-40" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-sm font-medium">
              <Home className="w-4 h-4" />
              <span>CMS Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Homepage Sections
            </h1>
            <p className="text-lg text-white/80 max-w-xl leading-relaxed">
              Manage and customize the content displayed on the main institutional homepage. Select a section below to begin editing.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SECTIONS GRID */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.id}
                href={section.href}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#631012]/30 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#631012]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#631012]/5 text-[#631012] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#631012] group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#631012] transition-colors">
                    {section.title}
                  </h2>
                  
                  <p className="text-gray-500 text-sm flex-grow leading-relaxed">
                    {section.description}
                  </p>

                  <div className="mt-6 flex items-center text-sm font-medium text-[#631012] opacity-80 group-hover:opacity-100">
                    <span className="mr-2">Edit Section</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* SIDEBAR PREVIEW - Redesigned as Quick Navigation */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Settings2 className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Quick Navigation
              </h2>
            </div>
            
            <p className="text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
              Jump directly to any section to update its content, images, and layout settings.
            </p>

            <div className="space-y-1">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={section.href}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#631012]/5 text-gray-600 hover:text-[#631012] transition-colors group"
                >
                  <span className="font-medium text-sm">{section.title}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}