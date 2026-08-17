'use client';

import AuthorityMinutesManager from '@/app/components/AuthorityMinutesManager';

export default function SenateMinutesAdminPage() {
  return (
    <AuthorityMinutesManager
      authorityName="Senate"
      apiBase="senate"
    />
  );
}
