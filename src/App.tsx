import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/ui/card';

function App() {
  return (
    <>
      <div className='width-full height-full flex justify-center gap-2 p-4'>
        <Card className='basis-1/4'>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Settings Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Settings Content</p>
          </CardContent>
          <CardFooter>
            <p>Settings Footer</p>
          </CardFooter>
        </Card>

        <Card className='basis-2/4'>
          <CardHeader>
            <CardTitle>Table</CardTitle>
            <CardDescription>Table Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Table Content</p>
          </CardContent>
          <CardFooter>
            <p>Table Footer</p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default App;
