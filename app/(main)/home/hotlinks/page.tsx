'use client';

import CRUDAdmin, { FieldDef } from '../../../components/CRUDAdmin';

const hotlinkFields: FieldDef[] = [
  { name: 'name', label: 'Display Name', type: 'text' },
  { name: 'links', label: 'Link URL', type: 'text' },
];

export default function HotlinksPage() {
  return (
    <CRUDAdmin
      title="Hotlinks"
      endpoint={`${process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000')}/hero/hotlinks`}
      dataKey="" // Hero routes just return the array in 'data' directly
      fields={hotlinkFields}
    />
  );
}

