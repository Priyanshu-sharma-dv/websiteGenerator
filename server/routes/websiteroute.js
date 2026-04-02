import express from "express";
import {generateWebsite,getWebsiteById} from "../controllers/websitecontroller.js";
import isAuth from "../middlewares/isAuth.js";

const websiteRouter = express.Router();
websiteRouter.post('/generate',isAuth, generateWebsite)
websiteRouter.get('/get-by-id/:id',isAuth, getWebsiteById)

export default websiteRouter;