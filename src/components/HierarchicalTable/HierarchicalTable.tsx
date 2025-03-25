import { Filters } from '@/App';
import { useTable } from '@/hooks/useTable';
import { generateData } from '@/lib/dataGenerator';
import { filterData } from '@/lib/filters';

export interface HierarchicalTableProps {
  showTotal?: boolean;
  decimalPlaces?: number;
  paddingSize?: number;
  nodeSign?: string;
  yearsGenerated?: number;
  filters: Filters;
}

export const HierarchicalTable = ({
  showTotal = true,
  decimalPlaces = 1,
  paddingSize = 20,
  nodeSign = '⌵ ',
  yearsGenerated = 200,
  filters,
}: HierarchicalTableProps) => {
  const rawData = generateData(yearsGenerated);
  const data = filterData(rawData, filters);

  const { tableRef } = useTable({
    showTotal,
    decimalPlaces,
    paddingSize,
    nodeSign,
    data,
  });

  return (
    <div className='flex flex-row'>
      <table className={'w-[260px] border-separate border-spacing-x-4'}>
        <tbody ref={tableRef}></tbody>
      </table>
    </div>
  );
};
