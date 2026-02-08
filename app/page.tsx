"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

export default function LovePage() {
  const [isOpen, setIsOpen] = useState(false);

  const lancerSurprise = () => {
    setIsOpen(true);

    // Explosion de confettis en forme de cœurs ❤️
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#ff0000", "#ff69b4", "#ffffff"],
        shapes: ["circle"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#ff0000", "#ff69b4", "#ffffff"],
        shapes: ["circle"],
      });
    }, 250);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-pink-400 via-purple-300 to-indigo-400">
      {/* Animation de fond (Cercles flous) */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* La Carte Centrale (Glassmorphism) */}
      <div className="relative z-10 bg-white/30 backdrop-blur-md border border-white/50 p-10 rounded-3xl shadow-2xl text-center max-w-lg w-full mx-4 transition-all duration-500 transform hover:scale-105">
        {/* Le Cœur Battant */}
        <div className="text-6xl mb-6 animate-bounce cursor-pointer">❤️</div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md mb-2 font-serif">
          Pour Amal Rezgui
        </h1>

        <p className="text-white/90 text-lg mb-8 font-medium">
          La personne la plus spéciale de mon univers.
        </p>

        {!isOpen ? (
          <button
            onClick={lancerSurprise}
            className="bg-white text-pink-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-pink-50 transition-all transform hover:-translate-y-1 hover:shadow-xl text-lg"
          >
            Clique ici mon amour 💌
          </button>
        ) : (
          <div className="animate-in fade-in zoom-in duration-700 bg-white/80 p-6 rounded-xl shadow-inner">
            <p className="text-2xl font-bold text-pink-600 mb-2">
              Je t'aime ! 💖
            </p>
            <p className="text-gray-700">
              Merci d'être toi. Chaque jour est meilleur grâce à toi.
            </p>
            <p className="text-4xl mt-4">🌹💍✨</p>
          </div>
        )}
      </div>

      {/* Styles CSS spécifiques pour l'animation Blob */}
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
