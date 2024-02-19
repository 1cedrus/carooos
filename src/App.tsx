import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const canvas = document.getElementById('game') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (!context) {
      console.log('Error occupied!');
      return;
    }
  }, []);

  return <canvas id='game' className='m-4 w-[50rem] h-[50rem] border-2'></canvas>;
}
