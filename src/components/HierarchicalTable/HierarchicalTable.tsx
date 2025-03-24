import { useTable } from '@/hooks/useTable';

export interface HierarchicalTableProps {
  showTotal?: boolean;
  decimalPlaces?: number;
  paddingSize?: number;
  nodeSign?: string;
  yearsGenerated?: number;
}

export const HierarchicalTable = ({
  showTotal = true,
  decimalPlaces = 1,
  paddingSize = 20,
  nodeSign = '⌵ ',
  yearsGenerated = 200,
}: HierarchicalTableProps) => {
  const { tableRef } = useTable({
    showTotal,
    decimalPlaces,
    paddingSize,
    nodeSign,
    yearsGenerated,
  });

  return (
    <>
      <table className={'w-[260px] border-separate border-spacing-x-4'}>
        <tbody ref={tableRef}></tbody>
      </table>
    </>
  );
};
