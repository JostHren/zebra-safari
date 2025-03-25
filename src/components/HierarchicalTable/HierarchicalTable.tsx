import { Filters, FontFamily } from '@/App';
import { useTable } from '@/hooks/useTable';
import { DeepData } from '@/lib/dataGenerator';
import { filterData } from '@/lib/filters';
import clsx from 'clsx';

export interface HierarchicalTableProps {
  showTotal?: boolean;
  decimalPlaces?: number;
  paddingSize?: number;
  nodeSign?: string;
  filters: Filters;
  fontFamily: FontFamily;
  rawData: DeepData;
}

export const HierarchicalTable = ({
  showTotal = true,
  paddingSize = 20,
  nodeSign = '⌵ ',
  filters,
  fontFamily,
  rawData,
}: HierarchicalTableProps) => {
  const data = filterData(rawData, filters);

  const { tableRef } = useTable({
    showTotal,
    paddingSize,
    nodeSign,
    data,
  });

  return (
    <div className='flex flex-row'>
      <table
        className={clsx(
          {
            ['font-sans']: fontFamily === 'sans',
            ['font-mono']: fontFamily === 'mono',
            ['font-serif']: fontFamily === 'serif',
          },
          'w-[260px] border-separate border-spacing-x-4',
        )}
      >
        <thead>
          <tr>
            <th scope='col'></th>
            <th scope='col' className={'border-b-4 border-gray-700 text-right font-normal'}>
              AC
            </th>
          </tr>
        </thead>
        <tbody ref={tableRef}></tbody>
      </table>
    </div>
  );
};
