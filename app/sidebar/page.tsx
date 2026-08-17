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
    <div className="w-[280px] h-screen bg-[#171717] flex flex-col shadow-2xl sticky top-0 shrink-0 z-30">
      {/* HEADER */}
      <div className="p-5 border-b border-[#631012]/30 shrink-0">
        <h1 className="text-xl font-bold text-white">
          {heading}
        </h1>

        <p className="text-xs text-white/60 mt-0.5">
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
          className="mt-3 w-full px-3 py-1.5 text-xs rounded-lg bg-[#262626] text-white border border-[#631012]/30 outline-none focus:border-[#631012]"
        />
      </div>

      {/* LINKS */}
      <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-thin scrollbar-thumb-gray-700">
        <ul className="space-y-1 pb-10">
          {filteredLinks.map((link, index) => {
            if ('header' in link) {
              return (
                <li key={`header-${index}`} className="pt-3 pb-1 px-3">
                  <span className="text-[10px] font-black text-[#F9F9F9]/50 uppercase tracking-[0.15em]">
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
                    px-3 py-2 rounded-lg text-xs
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-[#631012] text-white shadow-md font-semibold'
                        : 'text-white/80 hover:bg-[#631012]/20 hover:text-white'
                    }
                  `}
                >
                  <span className="font-medium">
                    {link.label}
                  </span>

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 ml-2" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* FOOTER */}
      <div className="p-3 border-t border-[#631012]/30 shrink-0">
        <Link
          href={downlinkHref}
          className="block w-full text-center px-3 py-2 rounded-lg bg-[#631012]/20 text-white hover:bg-[#631012] text-xs font-semibold transition-all duration-200"
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