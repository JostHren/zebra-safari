import { Filters } from '@/App';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface TableSettingsProps {
  showTotal: boolean;
  setShowTotal: (showTotal: boolean) => void;
  years: number;
  setYears: (years: number) => void;
  padding: number;
  setPadding: (padding: number) => void;
  nodeSign: string;
  setNodeSign: (node: string) => void;
  decimal: number;
  setDecimal: (decimal: number) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export const TableSettings = ({
  showTotal,
  setShowTotal,
  years,
  setYears,
  padding,
  setPadding,
  nodeSign,
  setNodeSign,
  decimal,
  setDecimal,
  filters,
  setFilters,
}: TableSettingsProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <div>How many years should I generate:</div>
      <div className='flex gap-2'>
        <Button onClick={() => setYears(1)} disabled={years === 1} className='bg-lime-600'>
          1 Year
        </Button>
        <Button onClick={() => setYears(50)} disabled={years === 50} className='bg-lime-600'>
          50 Years
        </Button>
        <Button onClick={() => setYears(200)} disabled={years === 200} className='bg-lime-600'>
          200 Years
        </Button>
      </div>

      <div className='flex flex-row justify-between'>
        <div>Define filters:</div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className='w-10 cursor-pointer rounded-full border bg-amber-400 text-center text-xs'>
                info
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Seprate filters on the same level with space. <br />
              For example: 1980 1982 <br /> <br />
              Filters on the same level act as OR operator.
              <br /> Filters between levels act as AND operator.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Input
        placeholder='First level'
        value={filters.first}
        onChange={(e) => setFilters({ ...filters, first: e.target.value })}
      />
      <Input
        placeholder='Second level'
        value={filters.second}
        onChange={(e) => setFilters({ ...filters, second: e.target.value })}
      />
      <Input
        placeholder='Third level'
        value={filters.third}
        onChange={(e) => setFilters({ ...filters, third: e.target.value })}
      />

      <div>How much padding do you need:</div>
      <div className='flex gap-2'>
        <Button onClick={() => setPadding(0)} disabled={padding === 0} className='bg-lime-600'>
          0 px
        </Button>
        <Button onClick={() => setPadding(20)} disabled={padding === 20} className='bg-lime-600'>
          20 px
        </Button>
        <Button onClick={() => setPadding(40)} disabled={padding === 40} className='bg-lime-600'>
          40 px
        </Button>
      </div>

      <div>What node sign do you like:</div>
      <div className='flex gap-2'>
        <Button
          onClick={() => setNodeSign('⌵ ')}
          disabled={nodeSign === '⌵ '}
          className='bg-lime-600'
        >
          Sign ⌵
        </Button>
        <Button
          onClick={() => setNodeSign('* ')}
          disabled={nodeSign === '* '}
          className='bg-lime-600'
        >
          Sign *
        </Button>
        <Button onClick={() => setNodeSign('')} disabled={nodeSign === ''} className='bg-lime-600'>
          No sign
        </Button>
      </div>

      <div>How many decimal do you need:</div>
      <div className='flex gap-2'>
        <Button onClick={() => setDecimal(0)} disabled={decimal === 0} className='bg-lime-600'>
          0
        </Button>
        <Button onClick={() => setDecimal(1)} disabled={decimal === 1} className='bg-lime-600'>
          1
        </Button>
        <Button onClick={() => setDecimal(2)} disabled={decimal === 2} className='bg-lime-600'>
          2
        </Button>
      </div>

      <div>Do you want to see total:</div>
      <div className='flex gap-2'>
        <Button onClick={() => setShowTotal(true)} disabled={showTotal} className='bg-lime-600'>
          Show Total
        </Button>
        <Button onClick={() => setShowTotal(false)} disabled={!showTotal} variant={'destructive'}>
          Hide Total
        </Button>
      </div>
    </div>
  );
};
