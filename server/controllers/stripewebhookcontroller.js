// controllers/webhookcontroller.js
import stripe from '../config/stripe.js';
import User from '../models/usermodel.js';

export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        // ✅ req.body raw buffer hona chahiye — important!
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error("Webhook signature failed:", err.message);
        return res.status(400).json({ message: `Webhook Error: ${err.message}` });
    }

    // ✅ Payment success hone par credits add karo
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const userId = session.metadata.userId;
        const credits = parseInt(session.metadata.credits);

        console.log(`Payment success — userId: ${userId}, credits: ${credits}`);

        try {
            const user = await User.findById(userId);
            if (!user) {
                console.error("User not found:", userId);
                return res.status(404).json({ message: "User not found" });
            }

            // ✅ Credits add karo
            user.credits = (user.credits || 0) + credits;
            await user.save();

            console.log(`Credits added! New balance: ${user.credits}`);
        } catch (err) {
            console.error("Error adding credits:", err);
            return res.status(500).json({ message: "Failed to add credits" });
        }
    }

    // ✅ Stripe ko 200 bhejo — warna wo retry karta rahega
    return res.status(200).json({ received: true });
};