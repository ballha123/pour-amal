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
        if (current.length > 5) return current; // Pas trop de cœurs en même temps
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
    }, 600); // Un cœur toutes les 600ms

    return () => clearInterval(interval);
  }, [gameState]);

  // Quand on clique sur un cœur
  const handleHeartClick = (id: number, e: React.MouseEvent) => {
    // Petit effet de confetti local sur le clic
    confetti({
      particleCount: 15,
      spread: 50,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ["#ff69b4", "#ff0000"],
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
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ff0000", "#ffa500", "#ffff00"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ff0000", "#ff00ff", "#00ffff"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  return (
    <main className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center font-sans text-white">
      {/* Fond animé doux */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* --- ÉCRAN 1 : ACCUEIL --- */}
      <AnimatePresence>
        {gameState === "START" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="z-10 text-center p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl max-w-lg"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
              Pour Amal
            </h1>
            <p className="text-lg md:text-xl text-pink-200 mb-8">
              J'ai caché mon amour dans ce jeu. <br />
              Attrape {TARGET_SCORE} cœurs pour le découvrir.
            </p>
            <button
              onClick={() => setGameState("PLAYING")}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xl font-bold shadow-lg hover:scale-105 transition-transform active:scale-95"
            >
              Commencer ❤️
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ÉCRAN 2 : LE JEU --- */}
      {gameState === "PLAYING" && (
        <div className="absolute inset-0 z-20">
          {/* Barre de progression */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-6 bg-white/20 rounded-full overflow-hidden border border-white/30 backdrop-blur">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${(score / TARGET_SCORE) * 100}%` }}
            />
          </div>
          <p className="absolute top-16 left-1/2 -translate-x-1/2 text-sm font-bold text-pink-200">
            {score} / {TARGET_SCORE}
          </p>

          {/* Les cœurs volants */}
          <AnimatePresence>
            {hearts.map((heart) => (
              <motion.button
                key={heart.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: heart.scale, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={(e) => handleHeartClick(heart.id, e)}
                className="absolute text-5xl cursor-pointer filter drop-shadow-lg"
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
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="z-30 text-center p-10 bg-white/20 backdrop-blur-xl rounded-[3rem] border border-white/40 shadow-2xl max-w-xl mx-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-7xl mb-4"
            >
              💖
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-4 font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-red-300 to-white">
              Amal Rezgui
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8"
            >
              Tu as gagné le jeu, mais c'est moi qui ai gagné le gros lot en
              t'ayant dans ma vie.
              <br />
              <br />
              <span className="text-pink-300 font-bold">
                Je t'aime à l'infini.
              </span>
            </motion.p>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-sm text-white/60"
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
          animation: blob 7s infinite;
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
