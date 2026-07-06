'use client';

import Link from 'next/link';
import { useState } from 'react';

type SidebarLink = 
  | { label: string; href: string }
  | { header: string };

interface SidebarProps {
  heading: string;
  links: SidebarLink[];
  downlink: string;
  downlinkHref?: string;
  activeLink?: string;
}

export function Sidebar({
  heading,
  links,
  downlink,
  downlinkHref = '/',
  activeLink,
}: SidebarProps) {
  const [search, setSearch] = useState('');

  // =========================
  // FILTER LINKS
  // =========================

  const filteredLinks = links.filter((link) => {
    if ('header' in link) return true;
    return link.label.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="w-[280px] min-h-screen bg-[#171717] flex flex-col shadow-2xl sticky top-0">
      {/* HEADER */}
      <div className="p-6 border-b border-[#631012]/30">
        <h1 className="text-2xl font-bold text-white">
          {heading}
        </h1>

        <p className="text-sm text-white/60 mt-1">
          NIT Hamirpur CMS
        </p>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search section..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="mt-4 w-full px-4 py-2 rounded-lg bg-[#262626] text-white border border-[#631012]/30 outline-none"
        />
      </div>

      {/* LINKS */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-2 pb-24">
          {filteredLinks.map((link, index) => {
            if ('header' in link) {
              return (
                <li key={`header-${index}`} className="pt-4 pb-2 px-4">
                  <span className="text-[10px] font-black text-[#F9F9F9]/40 uppercase tracking-[0.2em]">
                    {link.header}
                  </span>
                </li>
              );
            }
            const isActive = activeLink === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`
                    flex items-center justify-between
                    px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-[#631012] text-white shadow-lg'
                        : 'text-white/80 hover:bg-[#631012]/20 hover:text-white'
                    }
                  `}
                >
                  <span className="font-medium text-sm">
                    {link.label}
                  </span>

                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-[#631012]/30">
        <Link
          href={downlinkHref}
          className="block w-full text-center px-4 py-3 rounded-xl bg-[#631012]/20 text-white hover:bg-[#631012] transition-all duration-200"
        >
          {downlink}
        </Link>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="w-full min-h-screen flex">
      <Sidebar
        heading="Sidebar"
        links={[]}
        downlink="Back"
      />

      <div className="flex-1 bg-[#F9F9F9]" />
    </div>
  );
}