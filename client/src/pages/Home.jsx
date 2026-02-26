import React, { useState } from "react";
import { motion } from "framer-motion";
import LoginModal from "../components/LoginModal";

function Home() {
  const highlights = [
    "AI Generated Code",
    "Fully Responsive Layouts",
    "Production Ready Output",
  ];

  const [openLogin, setOpenLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <div className="relative min-h-screen bg-[#040404] text-white overflow-hidden">

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 backdrop-blur-xl bg-black/40 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-lg font-semibold">Genweb.ai</div>

          <div className="flex items-center gap-5">
            <div className="hidden md:flex text-sm text-zinc-400 hover:text-white cursor-pointer">
              Pricing
            </div>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border border-white/20"
                />
                <span className="text-sm text-zinc-300">{currentUser.name}</span>
              </div>
            ) : (
              <button
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm"
                onClick={() => setOpenLogin(true)}
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <section className="pt-36 pb-32 px-6 text-center">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          Welcome to Genweb.ai
          <br />
          Build Stunning Websites
          <br />
          <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            With AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-8 max-w-2xl mx-auto text-zinc-400 text-lg"
        >
          Describe your ideal website, and let Genweb.ai bring it to life in seconds.
        </motion.p>

        {!currentUser && (
          <button
            onClick={() => setOpenLogin(true)}
            className="px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition mt-12"
          >
            Get Started
          </button>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white/5 border border-white/10 p-8 hover:border-purple-500/40 transition"
            >
              <h3 className="text-xl font-semibold mb-3">{h}</h3>
              <p className="text-sm text-zinc-400">
                GenWeb.ai builds real websites with clean code,
                animations, responsive and scalable structure.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-10 text-center text-sm text-zinc-500">
        &copy; {new Date().getFullYear()} GenWeb.ai
      </footer>

      <LoginModal
        open={openLogin}
        onClose={(user) => {
          setOpenLogin(false);
          if (user) setCurrentUser(user);
        }}
      />
    </div>
  );
}

export default Home;