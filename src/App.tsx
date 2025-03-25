import { useState } from 'react';
import { HierarchicalTable } from './components/HierarchicalTable/HierarchicalTable';
import { TableSettings } from './components/TableSettings/TableSettings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card';
import { generateData } from './lib/dataGenerator';

export interface Filters {
  first: string;
  second: string;
  third: string;
}

export type FontFamily = 'sans' | 'mono' | 'serif';

const isValidJSON = (str: string) => {
  try {
    const parse = JSON.parse(str);
    return parse;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e: unknown) {
    return undefined;
  }
};

export const App = () => {
  const [showTotal, setShowTotal] = useState(true);
  const [years, setYears] = useState(1);
  const [padding, setPadding] = useState(20);
  const [nodeSign, setNodeSign] = useState('⌵ ');
  const [inputData, setInputData] = useState<string>('');
  const [fontFamiliy, setFontFamily] = useState<FontFamily>('sans');
  const [filters, setFilters] = useState({
    first: '',
    second: '',
    third: '',
  });

  const rawData = isValidJSON(inputData) ?? generateData(years);

  return (
    <>
      <div className='width-full height-full flex flex-col justify-center gap-2 p-4 sm:flex-row'>
        <Card className='basis-1/4'>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Style Table Here</CardDescription>
          </CardHeader>
          <CardContent>
            <TableSettings
              showTotal={showTotal}
              setShowTotal={setShowTotal}
              years={years}
              setYears={setYears}
              padding={padding}
              setPadding={setPadding}
              nodeSign={nodeSign}
              setNodeSign={setNodeSign}
              filters={filters}
              setFilters={setFilters}
              fontFamily={fontFamiliy}
              setFontFamily={setFontFamily}
              inputData={inputData}
              setInputData={setInputData}
            />
          </CardContent>
        </Card>

        <Card className='basis-2/4'>
          <CardHeader>
            <CardTitle>Table</CardTitle>
            <CardDescription>Hierarchical table</CardDescription>
          </CardHeader>
          <CardContent>
            <HierarchicalTable
              key={'true'}
              showTotal={showTotal}
              rawData={rawData}
              paddingSize={padding}
              nodeSign={nodeSign}
              fontFamily={fontFamiliy}
              filters={filters}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};
