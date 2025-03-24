import { useState } from 'react';
import { HierarchicalTable } from './components/HierarchicalTable/HierarchicalTable';
import { TableSettings } from './components/TableSettings/TableSettings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card';

export const App = () => {
  const [showTotal, setShowTotal] = useState(true);
  const [years, setYears] = useState(1);
  const [padding, setPadding] = useState(20);

  return (
    <>
      <div className='width-full height-full flex justify-center gap-2 p-4'>
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
              yearsGenerated={years}
              paddingSize={padding}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};
