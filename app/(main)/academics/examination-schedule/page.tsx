'use client';

import SingleAnchorLinkManager from '@/app/components/SingleAnchorLinkManager';

export default function Page() {
  return (
    <SingleAnchorLinkManager
      id="examination-schedule"
      defaultText="Examination Schedule"
      title="Examination Schedule"
      category="Academics"
    />
  );
}