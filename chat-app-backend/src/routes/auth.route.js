import express from "express"
import {login, logout, signup, updateProfile, checkAuth} from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"

const router = express.Router();

//// The validator is a generic middleware that gets the entity it should validate and takes care to return
// HTTP status 400 (Bad Request) should the body payload validation fail
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

// Update ProfilePicture only to authenticated users
router.put("/updateProfile", protectRoute, updateProfile)

// We will call this function whenever we refresh the application to check if the user is still authenticated
router.get("/check", protectRoute, checkAuth)

export default router;