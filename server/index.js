import  express from 'express';
import dotenv from "dotenv";
dotenv.config();
import connectdb from './config/db.js'; 
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from "./routes/authRoutes.js"
const port = process.env.PORT || 8000
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : "http:localhost:5173",
    credentials:true
}))
app.use('/api/auth',authRouter)


app.listen(port, ()=>{
    console.log("Server is running on the port ");
    connectdb()
})