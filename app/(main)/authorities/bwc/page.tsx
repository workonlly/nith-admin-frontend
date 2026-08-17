'use client';

import AuthorityMinutesManager from '@/app/components/AuthorityMinutesManager';

export default function BwcMinutesAdminPage() {
  return (
    <AuthorityMinutesManager
      authorityName="Building Works Committee (BWC)"
      apiBase="bwc"
    />
  );
}