import express from "express"
import {login, logout, signup, updateProfile, checkAuth, refreshAccessToken} from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"

const router = express.Router();

//// The validator is a generic middleware that gets the entity it should validate and takes care to return
// HTTP status 400 (Bad Request) should the body payload validation fail
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

// Update ProfilePicture only to authenticated users
router.put("/updateProfile", protectRoute, updateProfile)

// This endpoint is dedicated to issuing a new access token when the current one expires. It validates the refresh token and, upon success, generates and returns a new access token.
// VERIFY IF NEEDS A PROTECTED ROUTE
router.post("/refresh", refreshAccessToken)

// This endpoint verifies the validity of the current access token, confirming the user's authentication status without issuing new tokens.
router.get("/check", protectRoute, checkAuth)

export default router;