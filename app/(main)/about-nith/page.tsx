'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Info } from 'lucide-react';

export default function AboutNithPage() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="bg-gradient-to-r from-[#631012] to-[#7a1214] rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Info className="w-6 h-6 sm:w-8 sm:h-8" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            About NIT Hamirpur
          </h1>
        </div>
        <p className="text-sm sm:text-base text-white/90">
          Start editing by selecting a sidebar option to see details about NIT
          Hamirpur.
        </p>
      </div>
    </div>
  );
}