// Section data for ISO standards
export const sectionData = {
  'ISO 9001': [
    { id: '4', title: 'Context of the organization', clauses: ['4.1', '4.2', '4.3', '4.4'] },
    { id: '5', title: 'Leadership', clauses: ['5.1', '5.2', '5.3'] },
    { id: '6', title: 'Planning', clauses: ['6.1', '6.2', '6.3'] },
    { id: '7', title: 'Support', clauses: ['7.1', '7.2', '7.3', '7.4', '7.5'] },
    { id: '8', title: 'Operation', clauses: ['8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7'] },
    { id: '9', title: 'Performance evaluation', clauses: ['9.1', '9.2', '9.3'] },
    { id: '10', title: 'Improvement', clauses: ['10.1', '10.2', '10.3'] }
  ],
  'ISO 45001': [
    { id: '4', title: 'Context of the organization', clauses: ['4.1', '4.2', '4.3', '4.4'] },
    { id: '5', title: 'Leadership and worker participation', clauses: ['5.1', '5.2', '5.3', '5.4'] },
    { id: '6', title: 'Planning', clauses: ['6.1', '6.2'] },
    { id: '7', title: 'Support', clauses: ['7.1', '7.2', '7.3', '7.4', '7.5'] },
    { id: '8', title: 'Operation', clauses: ['8.1', '8.2'] },
    { id: '9', title: 'Performance evaluation', clauses: ['9.1', '9.2', '9.3'] },
    { id: '10', title: 'Improvement', clauses: ['10.1', '10.2', '10.3'] }
  ]
};

export type SectionDataType = typeof sectionData;
