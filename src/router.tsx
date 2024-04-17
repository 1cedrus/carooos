import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Authentication from '@/pages/Authentication';
import Game from '@/pages/Game';
import Dashboard from '@/pages/Dashboard';
import Home from '@/pages/Home.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import Sandbox from '@/pages/Dashboard/SandboxCard/Sandbox.tsx';
import MainLayout from '@/components/MainLayout.tsx';
import UserCard from '@/pages/Dashboard/UserCard';
import UserBox from '@/pages/Dashboard/UserCard/UserBox.tsx';
import MessagesBox from '@/pages/Dashboard/UserCard/MessagesBox';
import FriendsBox from '@/pages/Dashboard/UserCard/FriendsBox';
import ChatBox from '@/pages/Dashboard/UserCard/MessagesBox/ChatBox.tsx';

export default createBrowserRouter(
  createRoutesFromElements([
    <Route path='/' errorElement={<ErrorPage />}>
      <Route index element={<Home />}></Route>
      <Route path='login' element={<Authentication />}></Route>
      <Route path='register' element={<Authentication />}></Route>
      <Route path='/' element={<MainLayout />}>
        <Route path='dashboard' element={<Dashboard />}>
          <Route path='' element={<UserCard />}>
            <Route path='user' element={<UserBox />}></Route>
            <Route path='messages' element={<MessagesBox />}></Route>
            <Route path='messages/:cid' element={<ChatBox />}></Route>
            <Route path='friends' element={<FriendsBox />}></Route>
          </Route>
        </Route>
        <Route path='game/:roomCode' element={<Game />}></Route>
        <Route path='sandbox' element={<Sandbox />}></Route>
      </Route>
    </Route>,
  ]),
);
