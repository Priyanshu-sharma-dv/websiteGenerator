import express from 'express';
import {billing}  from '../controllers/billingcontroller.js';
import {stripeWebhook} from '../controllers/stripewebhookcontroller.js';
import isAuth from "../middlewares/isAuth.js"

const billingRouter = express.Router();
billingRouter.post('/',isAuth,billing)
billingRouter.post(
    '/webhook',
    express.raw({ type: 'application/json' }), // ← raw body MUST
    stripeWebhook
);
export default billingRouter;