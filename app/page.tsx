"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Types
interface Heart {
  id: number;
  x: number;
  y: number;
  scale: number;
}

export default function LoveGame() {
  const [gameState, setGameState] = useState<"START" | "PLAYING" | "WON">(
    "START",
  );
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState<Heart[]>([]);

  const TARGET_SCORE = 15; // Nombre de cœurs à attraper

  // --- LOGIQUE DU JEU ---

  // Faire apparaître des cœurs aléatoirement
  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const interval = setInterval(() => {
      setHearts((current) => {
        if (current.length > 6) return current; // Pas trop de cœurs en même temps
        return [
          ...current,
          {
            id: Date.now(),
            x: Math.random() * 80 + 10, // Entre 10% et 90% de la largeur
            y: Math.random() * 70 + 10, // Entre 10% et 80% de la hauteur
            scale: Math.random() * 0.5 + 0.8,
          },
        ];
      });
    }, 550); // Un cœur toutes les 550ms

    return () => clearInterval(interval);
  }, [gameState]);

  // Quand on clique sur un cœur
  const handleHeartClick = (id: number, e: React.MouseEvent) => {
    // Petit effet de confetti local sur le clic
    confetti({
      particleCount: 20,
      spread: 60,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ["#ef4444", "#b91c1c", "#ffffff"], // Rouge vif, Rouge foncé, Blanc
      disableForReducedMotion: true,
    });

    setHearts((current) => current.filter((h) => h.id !== id));
    setScore((s) => {
      const newScore = s + 1;
      if (newScore >= TARGET_SCORE) {
        handleWin();
      }
      return newScore;
    });
  };

  // Victoire
  const handleWin = () => {
    setGameState("WON");
    // Grande explosion finale
    const duration = 4000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors: ["#ff0000", "#dc2626", "#fb7185"], // Palette rouge/rose
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors: ["#ff0000", "#991b1b", "#fff"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  return (
    // Fond dynamique Rouge/Bordeaux Profond
    <main className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-red-950 via-rose-900 to-slate-900 flex flex-col items-center justify-center font-sans text-white">
      {/* Animation de fond (Lumières flottantes rouges et dorées) */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-red-600 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-rose-500 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-[600px] h-[600px] bg-orange-700/50 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      {/* --- ÉCRAN 1 : ACCUEIL --- */}
      <AnimatePresence>
        {gameState === "START" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            className="z-10 text-center p-10 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl max-w-lg mx-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif text-transparent bg-clip-text bg-gradient-to-br from-white to-red-200 drop-shadow-sm">
              Pour Amal
            </h1>
            <p className="text-lg md:text-xl text-red-100/90 mb-10 font-light leading-relaxed">
              Mon cœur a caché un message pour toi. <br />
              Attrape{" "}
              <span className="font-bold text-white">
                {TARGET_SCORE} cœurs
              </span>{" "}
              pour le révéler.
            </p>
            <button
              onClick={() => setGameState("PLAYING")}
              className="px-10 py-4 bg-gradient-to-r from-red-600 to-rose-600 rounded-full text-xl font-bold shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] hover:shadow-[0_0_60px_-10px_rgba(220,38,38,0.7)] hover:scale-105 transition-all duration-300 active:scale-95 border border-white/20"
            >
              Commencer ❤️
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ÉCRAN 2 : LE JEU --- */}
      {gameState === "PLAYING" && (
        <div className="absolute inset-0 z-20 cursor-crosshair">
          {/* Barre de progression */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 md:w-96 h-8 bg-black/30 rounded-full overflow-hidden border border-white/10 backdrop-blur-md shadow-lg">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)]"
              initial={{ width: 0 }}
              animate={{ width: `${(score / TARGET_SCORE) * 100}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          </div>
          <p className="absolute top-[4.5rem] left-1/2 -translate-x-1/2 text-sm font-bold text-red-200 tracking-widest uppercase">
            {score} / {TARGET_SCORE} Amour
          </p>

          {/* Les cœurs volants */}
          <AnimatePresence>
            {hearts.map((heart) => (
              <motion.button
                key={heart.id}
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: heart.scale, opacity: 1, y: 0 }}
                exit={{ scale: 2, opacity: 0, color: "#ef4444" }}
                whileHover={{ scale: 1.3, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleHeartClick(heart.id, e)}
                className="absolute text-6xl cursor-pointer filter drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] select-none hover:z-50"
                style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
              >
                ❤️
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* --- ÉCRAN 3 : VICTOIRE --- */}
      <AnimatePresence>
        {gameState === "WON" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 1, bounce: 0.3 }}
            className="z-30 text-center p-12 bg-black/20 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl max-w-2xl mx-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-8xl mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            >
              🌹
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif text-white drop-shadow-lg">
              Amal Rezgui
            </h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="space-y-6"
            >
              <p className="text-xl md:text-2xl text-red-50 font-medium leading-relaxed">
                Tu as gagné le jeu... <br />
                Mais c'est moi qui ai gagné le gros lot <br /> en t'ayant dans
                ma vie.
              </p>

              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto my-6 opacity-50"></div>

              <p className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-white to-red-200 font-bold animate-pulse">
                Je t'aime à l'infini.
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="mt-12 text-xs text-red-300/60 uppercase tracking-[0.3em]"
            >
              Ton Mari qui t'aime
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles globaux pour l'animation de fond */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
