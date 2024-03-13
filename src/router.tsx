import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Authentication from '@/pages/Authentication';
import Game from '@/pages/Game';
import Dashboard from '@/pages/Dashboard';
import Home from '@/pages/Home.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';

export default createBrowserRouter(
  createRoutesFromElements([
    <Route path='/' errorElement={<ErrorPage />}>
      <Route index element={<Home />}></Route>
      <Route path='login' element={<Authentication />}></Route>
      <Route path='register' element={<Authentication />}></Route>
      <Route path='dashboard' element={<Dashboard />}></Route>
      <Route path='game/:id' element={<Game />}></Route>
    </Route>,
  ]),
);
