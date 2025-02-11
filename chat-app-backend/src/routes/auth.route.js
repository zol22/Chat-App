import express from "express"
import {login, logout, signup} from "../controllers/auth.controller.js"

const router = express.Router();

//// The validator is a generic middleware that gets the entity it should validate and takes care to return
// HTTP status 400 (Bad Request) should the body payload validation fail
router.post("/signup", signup)
router.get("/login", login)
router.post("/logout", logout)

export default router;