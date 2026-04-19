import React from 'react'
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coins, Check } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
const plans = [
    {
        key: "free",
        name: "free",
        price: '0',
        credits: 100,
        description: "Ideal for individuals looking to explore AI-generated websites with a limited number of creations and basic features.",
        features: [
            "100 AI-Generated Website Credits",
            " Reponsive HTML output",
            "Basic animations",
        ],
        popular: false,
        button: "Get Started",
    },
    {
        key: "pro",
        name: "pro",
        price: '499',
        credits: 500,
        description: "Perfect for professionals and businesses that need more features and higher limits.",
        features: [
            "1000 AI-Generated Website Credits",
            "Responsive HTML output",
            "Advanced animations",
            "Priority support"
        ],
        popular: true,
        button: "Get Pro"
    },
    {
        key: "enterprise",
        name: "enterprise",
        price: '1499',
        credits: 2000,
        description: "Best for large enterprises with high demands and the need for custom solutions.",
        features: [
            "Unlimited iterations",
            "Highest priority",
            "Advanced animations",
            "Priority support"
        ],
        popular: false,
        button: "Contact Enterprise Sales"
    }
]
function Pricing() {
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.user)
    const [loading, setloading] = useState(null);
    const handlebuy = async (planKey) => {
        if (!userData) {
            navigate('/');
            return;
        }
        if (planKey === 'free') {
            navigate('/dashboard')
            return;
        }
        setloading(planKey);
        try {
            const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/billing`,
                {
                    planType: planKey,
                },
                {
                    withCredentials: true,
                })
            window.location.href = result.data.SessionUrl;
        } catch (error) {
            console.log(error);
            setloading(null);
        }
    }
    return (
        <div className='relative min-h-screen overflow-hidden bg-[#050505] text-white  px-6 pt-16 pb-24'>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-\[500px\] h-\[500px\] bg-indigo-600/20 rounded-full blur-[120px]" />
            </div>
            <button className='relative z-10 mb-8 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition' onClick={() => navigate('/')}>
                <ArrowLeft size={18} />
                Back
            </button>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className='relative z-10 max-w-3xl mx-auto text-center mb-14'
            >
                <h1 className='text-4xl  md:text-5xl font-bold md-4'>Simple, transparent pricing</h1>
                <p className='text-zinc-400 text-lg mt-6 ' >Buy credits once. Build anytime.</p>
            </motion.div>
            <div className="relative z-10 max-w-7xl mx-auto  grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.12 }}
                        whileHover={{ y: -14, scale: 1.03 }}
                        className={`relative rounded-3xl p-8 border backdrop-blur-xl transition-all  ${p.popular ? 'border-indigo-500 bg-gradient-to-b from-indigo-500/20 to-transparent shadow-2xl shadow-indigo-500/30' : 'border-white/10 bg-white/5 hover:border-indigo-400 hover:bg-white/10 '}`}
                    >
                        {p.popular && (
                            <span className='absolute top-5 right-5 px-3 py-1 text-xs rounded-full bg-indigo-500 '>Most Popular</span>
                        )}
                        <h1 className='text-xl font-semibold mb-2'>{p.name}</h1>
                        <p className='text-zinc-400 text-sm mb-6'>{p.description}</p>
                        <div className="flex items-end gap-1 mb-4">
                            <span className='text-4xl font-bold'>{p.price}</span>
                            <span className='text-sm text-zinc-400 mb-1'></span>
                        </div>
                        <div className="flex items-center gap-2 mb-8">
                            <Coins className='text-yellow-400' />
                            <span className='font-semibold'>{p.credits} Credits</span>
                        </div>
                        <ul className='space-y-3 mb-10'>
                            {p.features.map((f) => (
                                <li
                                    key={f}
                                    className='flex items-center gap-2 text-sm text-zinc-300'
                                >
                                    <Check className='text-green-400' size={16} />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <motion.button
                            whileHover={{ scale: 0.96 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-semibold transition
                                 ${p.popular ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-white/10 hover:bg-white/20'}disabled:opacity-60`}
                            onClick={() => handlebuy(p.key)}
                        >
                            {loading === p.key ? 'redirecting...' : p.button}
                        </motion.button>
                    </motion.div>
                ))}

            </div>
        </div>
    )
}

export default Pricing
