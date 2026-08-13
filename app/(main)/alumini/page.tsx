'use client';

import Link from 'next/link';
import { 
  Users, 
  Activity, 
  UserCheck, 
  HeartHandshake, 
  FileSignature, 
  LifeBuoy, 
  Award, 
  CalendarDays, 
  Banknote, 
  Monitor, 
  UserPlus, 
  PiggyBank, 
  Trophy, 
  Calendar,
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
    title: 'Activites',
    description: 'Manage alumni activities and events',
    href: '/alumini/activites',
    icon: Activity,
  },
  {
    id: 2,
    title: 'Functionaries',
    description: 'Manage alumni functionaries and leadership',
    href: '/alumini/functionaries',
    icon: UserCheck,
  },
  {
    id: 3,
    title: 'Alumni Related Services',
    description: 'Manage services provided to alumni',
    href: '/alumini/alumni-related-services',
    icon: HeartHandshake,
  },
  {
    id: 4,
    title: 'Alumni Related MoU',
    description: 'Manage MoUs and agreements',
    href: '/alumini/alumni-related-mou',
    icon: FileSignature,
  },
  {
    id: 5,
    title: 'Alumni Assist',
    description: 'Manage alumni assistance programs',
    href: '/alumini/alumni-assist',
    icon: LifeBuoy,
  },
  {
    id: 6,
    title: 'Distinguished Alumni',
    description: 'Manage distinguished alumni profiles',
    href: '/alumini/distinguished',
    icon: Award,
  },
  {
    id: 7,
    title: 'Alumni Affair Activites',
    description: 'Manage affairs and specific activities',
    href: '/alumini/alumni-affair-activites',
    icon: CalendarDays,
  },
  {
    id: 8,
    title: 'Resource Generation',
    description: 'Manage resource generation initiatives',
    href: '/alumini/resource-generation-activities',
    icon: Banknote,
  },
  {
    id: 9,
    title: 'Portal',
    description: 'Manage the alumni portal settings',
    href: '/alumini/portal',
    icon: Monitor,
  },
  {
    id: 10,
    title: 'Alumni Registration',
    description: 'Manage alumni registration details',
    href: '/alumini/registration',
    icon: UserPlus,
  },
  {
    id: 11,
    title: 'Endowment Fund',
    description: 'Manage the endowment fund',
    href: '/alumini/endowment-fund',
    icon: PiggyBank,
  },
  {
    id: 12,
    title: 'Award Initiatives',
    description: 'Manage award initiatives and criteria',
    href: '/alumini/award-initiatives',
    icon: Trophy,
  },
  {
    id: 13,
    title: 'Annual Meet',
    description: 'Manage the annual meet events',
    href: '/alumini/annual-meet',
    icon: Calendar,
  },
];

export default function AluminiPage() {
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
              <Users className="w-4 h-4" />
              <span>CMS Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Alumni Sections
            </h1>
            <p className="text-lg text-white/80 max-w-xl leading-relaxed">
              Manage and customize the content for the alumni section. Select a module below to begin editing.
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
                    <span className="mr-2">Manage Section</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* SIDEBAR PREVIEW - Quick Navigation */}
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
              Jump directly to any section to update its content, members, and settings.
            </p>

            <div className="space-y-1 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
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
