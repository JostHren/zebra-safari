import { Button } from '../ui/button';

interface TableSettingsProps {
  showTotal: boolean;
  setShowTotal: (showTotal: boolean) => void;
  years: number;
  setYears: (years: number) => void;
  padding: number;
  setPadding: (padding: number) => void;
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
