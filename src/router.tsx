import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Authentication from '@/pages/Authentication';
import Game from '@/pages/Game';
import Dashboard from '@/pages/Dashboard';
import Home from '@/pages/Home.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import Sandbox from '@/pages/Dashboard/SandboxCard/Sandbox.tsx';

export default createBrowserRouter(
  createRoutesFromElements([
    <Route path='/' errorElement={<ErrorPage />}>
      <Route index element={<Home />}></Route>
      <Route path='login' element={<Authentication />}></Route>
      <Route path='register' element={<Authentication />}></Route>
      <Route path='dashboard' element={<Dashboard />}></Route>
      <Route path='game/:roomCode' element={<Game />}></Route>
      <Route path='sandbox' element={<Sandbox />}></Route>
    </Route>,
  ]),
);
