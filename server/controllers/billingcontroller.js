import { PLANS } from '../config/plans.js';
import stripe from '../config/stripe.js';
import dotenv from 'dotenv';
dotenv.config();

export const billing = async (req, res) => {
    try {
     const { planType } = req.body;
     const userId = req.user._id;
     const plan = PLANS[planType];
     if(!plan || plan.price === 0){
        return res.status(400).json({ message: 'Invalid plan type' });
     }
     const session =  await stripe.checkout.sessions.create({
        mode:"payment",
        payment_method_types: ['card'],
        line_items:[
            {
                price_data:{
                    currency:'inr',
                    product_data:{
                        name: `GenWeb.AI ${planType.toUpperCase()} plan`,
                    },
                    unit_amount: plan.price * 100,
                },
                quantity:1,
            }
        ],
        metadata :{
            userId,
            credits:plan.credits,
                plan: plan.plan
        },
        uccess_url: `${process.env.FRONTEND_URL}/`,
        cancel_url: `${process.env.FRONTEND_URL}/pricing`,
     });
    return res.status(200).json({ SessionUrl: session.url });
    }catch(error){
        return res.status(500).json({ message: 'billing error' });
    }
}