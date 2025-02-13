import express from 'express';
import { protectRoute } from "../middlewares/auth.middleware.js"
import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js'; 

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar); //Retrieves a list of users with whom the authenticated user has active conversations.
router.get("/:id", protectRoute, getMessages) // Fetches a specific message by its :id
router.post("/send/:id", protectRoute, sendMessage) // Send a new message to a user
export default router;