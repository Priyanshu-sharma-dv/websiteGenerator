import express  from 'express'
import { googleAuth, logOut} from '../controllers/authcontroller.js';

const authRouter = express.Router()

authRouter.post("/googleAuth",googleAuth)
authRouter.get("/logout",logOut)

export default authRouter;