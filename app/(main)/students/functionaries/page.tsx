'use client';

import CRUDAdmin, { FieldDef } from '../../../components/CRUDAdmin';

const fields: FieldDef[] = [
  { name: 'title_en', label: 'Section (English)', type: 'text' },
  { name: 'title_hn', label: 'Section (Hindi)', type: 'text' },
  { name: 'name_en', label: 'Name (English)', type: 'text' },
  { name: 'name_hn', label: 'Name (Hindi)', type: 'text' },
  { name: 'responsibility_en', label: 'Responsibility', type: 'textarea' },
  { name: 'phone', label: 'Phone', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'faculty_id', label: 'Faculty ID', type: 'text' },
];

export default function Page() {
  return (
    <CRUDAdmin
      title="Student Functionaries"
      endpoint={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/v1/students/functionaries`}
      dataKey="functionaries"
      fields={fields}
    />
  );
}
