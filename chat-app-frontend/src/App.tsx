import { useState, useEffect } from 'react'
import NavBar from './components/NavBar';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SignUpPage from './pages/SignUpPage';

import { io } from 'socket.io-client';
import './App.css'
import { useAuthStore} from './store/useAuthStore';
import { Loader } from 'lucide-react';

const socket = io('http://localhost:5000') // Establish a connection to the Socket.IO server at the specified URL.

function App() {

  const [room, setRoom] = useState<string>('');
  const [messages, setMessages] = useState<string>('');
  const [messageReceived, setMessageReceived] = useState<string>('');

  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  
  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join_room', {room})
    }

  }
  const sendMessage = () => {
    socket.emit('send_message', { messages, room})
  }

  useEffect(() => {

    checkAuth()
    /*socket.on('receive_message', (data) => {
      setMessageReceived(data.messages)
      console.log("📥 Message received from server:", JSON.stringify(data, null, 2));
    })  */
  },[checkAuth]) // whenever an event is emited, the useEffect hook will run.

  console.log(authUser)

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className='size-10 animate-spin'/>
      </div>
    );

  return (
    <div>
      <NavBar />
      <Routes >
        <Route path="/" element={ authUser ? <HomePage /> : <Navigate to="/login"/>}/> {/*If user is authenticated, they can see HomePage, if not, navigate to Login */}
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />}/> {/*If user is loggedin, they shouldnt see the signup or login page */}
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/"/>}/>
        <Route path="/settings" element={<SettingsPage />}/>
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />}/>
      </Routes>

        {/*<h1 className='text-red-500'>Room:</h1>
        <input type="text" name="room" onChange={(e)=> setRoom(e.target.value)}/>
        <button onClick={joinRoom}>Join Room</button>
        <h1>Message:</h1>
        <input type="text" name="message"  onChange={(e)=> setMessages(e.target.value)}/>
        <button onClick={sendMessage} >Submit</button>
        {messageReceived}
        */}
     
        
    </div>
  )
}

export default App
