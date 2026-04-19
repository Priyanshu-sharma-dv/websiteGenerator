import stripe from '../config/stripe.js';
import User from '../models/usermodel.js';
import dotenv from 'dotenv';
dotenv.config();
export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const credits = Number(session.metadata.credits);
        const plan = session.metadata.plan;

        await User.findByIdAndUpdate(userId, {
            $inc: { credits },
            plan
        });
    }
    return re.json({ received: true });
}