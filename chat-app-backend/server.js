const express = require('express')
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const app = express()
const port = 3000
// Allow CORS for Express routes
app.use(cors());

// Create a new HTTP server by passing the Express app object.
const server = http.createServer(app);

// Initialize a new instance of socket.io by passing the server (the HTTP server) object.
const io = new Server(server, {
    cors: { origin: "*", 
        methods: ["GET", "POST"],
        credentials: true }
  });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

// I listen on the connection event for incoming sockets and log it to the console.
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    } );
    socket.on('disconnect', () => {
        console.log('user disconnected');
      } )
  })

/* WebSockets Connection:
    ✅  When a new user connects to the WebSocket server, this event triggers.
    ✅ A unique socket.id is assigned to each user.
    ✅ This allows the server to keep track of users and handle their real-time interactions.
 */
/*o.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    // Join chat room: ✅ This listens for a joinRoom event from the frontend.
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);//user is added to that chat room
    });
  
    // Listen for messages: ✅ When a user sends a message, this event runs.
    socket.on("message", async ({ senderId, roomId, content }) => {
      const newMessage = await db.query(
        "INSERT INTO messages (sender_id, chatroom_id, content) VALUES ($1, $2, $3) RETURNING *",
        [senderId, roomId, content]
      );
      // Broadcasts the new message to all users in the room.
      io.to(roomId).emit("message", newMessage.rows[0]);
    });
    //Triggers when a user closes the tab or loses connection.
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
*/

  

  server.listen(5000, () => console.log("Server running on port 5000"));
