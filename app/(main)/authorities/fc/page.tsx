'use client';

import AuthorityMinutesManager from '@/app/components/AuthorityMinutesManager';

export default function FcMinutesAdminPage() {
  return (
    <AuthorityMinutesManager
      authorityName="Finance Committee (FC)"
      apiBase="fc"
    />
  );
}