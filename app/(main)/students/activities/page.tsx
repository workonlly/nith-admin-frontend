'use client';

import CRUDAdmin, { FieldDef } from '../../../components/CRUDAdmin';

const fields: FieldDef[] = [
  { name: 'title_en', label: 'Title (English)', type: 'text' },
  { name: 'title_hn', label: 'Title (Hindi)', type: 'text' },
  { name: 'description_en', label: 'Description (English)', type: 'textarea' },
  { name: 'description_hn', label: 'Description (Hindi)', type: 'textarea' },
];

export default function Page() {
  return (
    <CRUDAdmin
      title="Student Activities"
      endpoint={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/v1/students/activities`}
      dataKey="activities"
      fields={fields}
    />
  );
}
