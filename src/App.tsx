import { useState } from 'react';
import { HierarchicalTable } from './components/HierarchicalTable/HierarchicalTable';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card';

export const App = () => {
  const [showTotal, setShowTotal] = useState(true);
  const [years, setYears] = useState(200);
  const [padding, setPadding] = useState(200);

  return (
    <>
      <div className='width-full height-full flex justify-center gap-2 p-4'>
        <Card className='basis-1/4'>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Style Table Here</CardDescription>
          </CardHeader>
          <CardContent>Content Here</CardContent>
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
