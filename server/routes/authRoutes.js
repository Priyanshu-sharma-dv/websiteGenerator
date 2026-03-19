import express from 'express';
import { googleAuth, logOut } from '../controllers/authcontroller.js';

const authRouter = express.Router();

authRouter.post("/google", googleAuth);
authRouter.post("/logout", logOut); // ✅ changed GET → POST

export default authRouter;