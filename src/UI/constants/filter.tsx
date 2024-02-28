// Types
type FilterOptionsProps = {
  label: string;
  value: 'All' | 'Pending' | 'Approved';
};

export const FILTER_OPTIONS: FilterOptionsProps[] = [
  { label: 'View all', value: 'All' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Finalized', value: 'Approved' }
];
