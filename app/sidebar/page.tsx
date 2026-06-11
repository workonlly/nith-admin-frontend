import { Url } from 'next/dist/shared/lib/router/router';
import React from 'react';
import Link from 'next/link';

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
  return (
    <div className="bg-[#171717] w-[20%] h-screen sticky top-0 flex flex-col justify-between shadow-2xl ">
      <div className="p-6 border-b border-[#631012]/30 sticky top-0 bg-[#171717] ">
        <h1 className="text-2xl font-bold text-[#F9F9F9]  tracking-tight">
          {heading}
        </h1>
        <p className="text-sm text-[#F9F9F9]/60 mt-1">NIT Hamirpur</p>
      </div>
      <div className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1 pb-24">
          {links.map((link, index) => {
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#631012] text-[#F9F9F9] shadow-lg'
                      : 'text-[#F9F9F9]/80 hover:bg-[#631012]/20 hover:text-[#F9F9F9]'
                  }`}
                >
                  <span className="font-medium text-sm">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-3 border-t fixed w-[20%] bottom-0 bg-[#171717] border-[#631012]/30">
        <Link
          href={downlinkHref}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#F9F9F9]/80 hover:bg-[#631012]/20 hover:text-[#F9F9F9] transition-all duration-200 cursor-pointer"
        >
          <span className="font-medium  text-sm">{downlink}</span>
        </Link>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="w-full min-h-screen flex flex-row ">
      <Sidebar heading="Sidebar" links={[]} downlink="Back" />
      <div className="w-[80%]"></div>
    </div>
  );
}
