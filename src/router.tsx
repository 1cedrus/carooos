import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Authentication from '@/pages/Authentication';
import Dashboard from '@/pages/Dashboard';
import Home from '@/pages/Home.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import UserBox from '@/pages/Dashboard/UserBox';
import MessagesBox from '@/pages/Dashboard/MessagesBox';
import FriendsBox from '@/pages/Dashboard/FriendsBox';
import PlayBox from '@/pages/Dashboard/PlayBox';
import Game from '@/pages/Game';
import ChatBox from '@/pages/Dashboard/ChatBox.tsx';
import SandBox from '@/pages/Dashboard/SandBox.tsx';
import ResetPassword from '@/pages/Authentication/ResetPassword';

export default createBrowserRouter(
  createRoutesFromElements([
    <Route path='/' errorElement={<ErrorPage />}>
      <Route index element={<Home />}></Route>
      <Route path='login' element={<Authentication />}></Route>
      <Route path='register' element={<Authentication />}></Route>
      <Route path='reset-password' element={<ResetPassword />}></Route>
      <Route path='/' element={<Dashboard />}>
        <Route path='user' element={<UserBox />}></Route>
        <Route path='messages' element={<MessagesBox />}></Route>
        <Route path='messages/:cid' element={<ChatBox />}></Route>
        <Route path='friends' element={<FriendsBox />}></Route>
        <Route path='play' element={<PlayBox />}></Route>
        <Route path='game/:roomCode' element={<Game />}></Route>
        <Route path='sandbox' element={<SandBox />}></Route>
      </Route>
    </Route>,
  ]),
);
