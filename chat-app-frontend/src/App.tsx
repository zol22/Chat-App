import { useState, useEffect } from 'react'
import { io } from 'socket.io-client';
import './App.css'

const socket = io('http://localhost:5000') // Establish a connection to the Socket.IO server at the specified URL.

function App() {

  const [room, setRoom] = useState<string>('');
  const [messages, setMessages] = useState<string>('');
  const [messageReceived, setMessageReceived] = useState<string>('');
  
  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join_room', {room})
    }

  }
  const sendMessage = () => {
    socket.emit('send_message', { messages, room})
  }

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageReceived(data.messages)
      console.log("📥 Message received from server:", JSON.stringify(data, null, 2));
    })  
  },[]) // whenever an event is emited, the useEffect hook will run.
  
  return (
    <div>
     
        <h1>Room:</h1>
        <input type="text" name="room" onChange={(e)=> setRoom(e.target.value)}/>
        <button onClick={joinRoom}>Join Room</button>

        <h1>Message:</h1>
        <input type="text" name="message"  onChange={(e)=> setMessages(e.target.value)}/>
        <button onClick={sendMessage} >Submit</button>
        {messageReceived}
     
    </div>
  )
}

export default App
