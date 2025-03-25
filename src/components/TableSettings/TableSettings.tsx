import { Filters, FontFamily } from '@/App';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useState } from 'react';
import { Switch } from '../ui/switch';
import clsx from 'clsx';

const VALID_FORMAT_EXAMPLE = '{"root": [{"a":[{"b":2}, {"c":3}]}, {"d":3}]}';

interface TableSettingsProps {
  showTotal: boolean;
  setShowTotal: (showTotal: boolean) => void;
  years: number;
  setYears: (years: number) => void;
  padding: number;
  setPadding: (padding: number) => void;
  nodeSign: string;
  setNodeSign: (node: string) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  fontFamily: FontFamily;
  setFontFamily: (fontFamily: FontFamily) => void;
  inputData: string;
  setInputData: (inputData: string) => void;
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
  filters,
  setFilters,
  fontFamily,
  setFontFamily,
  inputData,
  setInputData,
}: TableSettingsProps) => {
  const [generateData, setGenerateData] = useState(true);

  const handleGenerate = () => {
    setGenerateData(!generateData);
    setYears(generateData ? 0 : 1);
    setInputData('');
  };

  return (
    <TooltipProvider>
      <div className='flex flex-col gap-2'>
        <div className={clsx({ ['text-gray-400']: !generateData })}>
          How many years should I generate:
        </div>
        <div className='flex gap-2'>
          <Button
            onClick={() => setYears(1)}
            disabled={years === 1 || !generateData}
            className='bg-lime-600'
          >
            1 Year
          </Button>
          <Button
            onClick={() => setYears(50)}
            disabled={years === 50 || !generateData}
            className='bg-lime-600'
          >
            50 Years
          </Button>
          <Button
            onClick={() => setYears(200)}
            disabled={years === 200 || !generateData}
            className='bg-lime-600'
          >
            200 Years
          </Button>
        </div>

        <div>
          <Switch
            className='bg-lime-600'
            checked={generateData}
            onCheckedChange={() => handleGenerate()}
          />
          {' Data generation enabled'}
        </div>

        <div className='flex flex-row justify-between'>
          <div className={clsx({ ['text-gray-400']: generateData })}>Input Data instead:</div>
          <Tooltip>
            <TooltipTrigger>
              <div className='w-4.5 cursor-pointer rounded-full border bg-red-600 text-center text-xs text-white'>
                !
              </div>
            </TooltipTrigger>
            <TooltipContent>
              1. Disable data generation
              <br />
              2. Input data is only used when it is valid!
              <br /> <br />
              3. Valid format example:
              <br />
              {VALID_FORMAT_EXAMPLE}
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          disabled={generateData}
        />

        <div className='flex flex-row justify-between'>
          <div>Define filters:</div>

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
          <Button
            onClick={() => setNodeSign('')}
            disabled={nodeSign === ''}
            className='bg-lime-600'
          >
            No sign
          </Button>
        </div>

        <div>Set font-family:</div>
        <div className='flex gap-2'>
          <Button
            onClick={() => setFontFamily('serif')}
            disabled={fontFamily === 'serif'}
            className='bg-lime-600'
          >
            Serif
          </Button>
          <Button
            onClick={() => setFontFamily('mono')}
            disabled={fontFamily === 'mono'}
            className='bg-lime-600'
          >
            Mono
          </Button>
          <Button
            onClick={() => setFontFamily('sans')}
            disabled={fontFamily === 'sans'}
            className='bg-lime-600'
          >
            Sans
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
    </TooltipProvider>
  );
};
