'use client';

import SingleAnchorLinkManager from '@/app/components/SingleAnchorLinkManager';

export default function Page() {
  return (
    <SingleAnchorLinkManager
      id="local-chapters"
      defaultText="Local Chapters"
      title="Local Chapters"
      category="Alumni"
    />
  );
}