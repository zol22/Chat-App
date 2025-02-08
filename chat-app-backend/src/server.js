import express from 'express'
import cors from 'cors';
import http from 'http';
import { Server } from "socket.io";
import authRoutes from "./routes/auth.route.js";
import dotenv from 'dotenv'
const app = express()

// Middleware to parse JSON bodies
app.use(express.json ());   

dotenv.config();

const PORT = process.env.PORT;

// Allow CORS for Express routes
app.use(cors());

// Enabling fREE SSL/TLS can help encrypt the communication of your applications. 
/*const options = {
  // The path should be changed accordingly to your setup
  cert: fs.readFileSync('./sslcert/fullchain.pem'),
  key: fs.readFileSync('./sslcert/privkey.pem')
};*/

app.use("/api/auth", authRoutes);


// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// The validator is a generic middleware that gets the entity it should validate and takes care to return
// HTTP status 400 (Bad Request) should the body payload validation fail
/*app.use((req, res, next) => {


})*/

// Create a new HTTP server by passing the Express app object, can add createServer(options,app).
const server = http.createServer(app);

// Initialize a new instance of socket.io by passing the server (the HTTP server) object.
const io = new Server(server, {
    cors: { 
        origin: "*", 
        methods: ["GET", "POST"],
        credentials: true }
  });


// I listen on the connection event for incoming sockets and log it to the console.
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data.room);

    } );

    socket.on('send_message', (data) => {
      console.log("📨 Server received message:", JSON.stringify(data, null, 2));
        //socket.broadcast.emit('receive_message', data);
        socket.to(data.room).emit("receive_message", {messages: data.messages});
    } );
    /*socket.on('disconnect', () => {
        console.log('user disconnected');
      } )*/
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

  

  server.listen(PORT, () => console.log("Server running on port", PORT));
