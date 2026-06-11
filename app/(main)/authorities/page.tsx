'use client';

import React from 'react';
import { Shield } from 'lucide-react';

export default function AuthoritiesPage() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="bg-gradient-to-r from-[#631012] to-[#7a1214] rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            Authorities
          </h1>
        </div>
        <p className="text-sm sm:text-base text-white/90">
          Start editing by selecting a sidebar option to manage institutional
          authorities.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#171717] mb-4">
          Institutional Authorities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-[#171717]/20 rounded-lg hover:border-[#631012] transition-colors">
            <h3 className="font-semibold text-[#171717]">
              Board of Governors (BOG)
            </h3>
            <p className="text-sm text-[#171717]/60">
              Apex governing body of the institute
            </p>
          </div>
          <div className="p-4 border border-[#171717]/20 rounded-lg hover:border-[#631012] transition-colors">
            <h3 className="font-semibold text-[#171717]">Senate</h3>
            <p className="text-sm text-[#171717]/60">Academic governing body</p>
          </div>
          <div className="p-4 border border-[#171717]/20 rounded-lg hover:border-[#631012] transition-colors">
            <h3 className="font-semibold text-[#171717]">
              Finance Committee (FC)
            </h3>
            <p className="text-sm text-[#171717]/60">
              Financial oversight and planning
            </p>
          </div>
          <div className="p-4 border border-[#171717]/20 rounded-lg hover:border-[#631012] transition-colors">
            <h3 className="font-semibold text-[#171717]">
              Building & Works Committee (BWC)
            </h3>
            <p className="text-sm text-[#171717]/60">
              Infrastructure and development
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}