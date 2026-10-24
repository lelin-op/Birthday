import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface EnvelopeProps {
  onOpen: () => void;
  isOpen: boolean;
  recipientName?: string;
}

export const Envelope: React.FC<EnvelopeProps> = ({ onOpen, isOpen, recipientName = "My Love" }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 650);
  };

  return (
    <div className="flex flex-col items-center">
      {/* 3D Envelope Container */}
      <motion.div
        className="w-80 sm:w-96 h-56 sm:h-64 relative rounded-2xl cursor-pointer select-none group perspective-1000"
        onClick={handleClick}
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Soft Ambient Shadow */}
        <div className="absolute -inset-2 bg-gradient-to-r from-rose-400/25 via-pink-400/20 to-amber-400/25 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-80" />

        {/* Envelope Back Body */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f43f5e] via-[#e11d48] to-[#9f1239] rounded-2xl shadow-2xl border border-rose-300/30 overflow-hidden">
          {/* Subtle linen paper texture overlay */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />
          {/* Interior Gold Lining visible inside */}
          <div className="absolute inset-x-4 top-2 h-20 bg-gradient-to-b from-amber-200/90 via-amber-100/60 to-transparent rounded-t-lg" />
        </div>

        {/* Letter Peeking Out animation */}
        <motion.div
          animate={isOpening || isOpen ? { y: -70, opacity: 1 } : { y: 0, opacity: 0.9 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-6 top-6 h-48 bg-[#fffdfa] rounded-xl shadow-lg border border-amber-100 p-4 flex flex-col justify-start z-10"
        >
          <div className="h-2 w-24 bg-rose-200/80 rounded-full mb-3" />
          <div className="h-1.5 w-full bg-slate-200/70 rounded-full mb-2" />
          <div className="h-1.5 w-5/6 bg-slate-200/70 rounded-full mb-2" />
          <div className="h-1.5 w-4/6 bg-slate-200/70 rounded-full mb-3" />
          <span className="text-xs font-script text-rose-500 font-bold self-end mt-auto">For {recipientName} ♥</span>
        </motion.div>

        {/* Envelope Front Left & Right Pockets */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Bottom Fold */}
          <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#be123c] via-[#e11d48] to-[#fb7185] rounded-b-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.15)] [clip-path:polygon(0_100%,100%_100%,50%_15%)]" />

          {/* Left Fold */}
          <div className="absolute top-0 bottom-0 left-0 w-44 bg-gradient-to-r from-[#9f1239] via-[#be123c] to-transparent rounded-l-2xl opacity-90 [clip-path:polygon(0_0,0_100%,100%_50%)]" />

          {/* Right Fold */}
          <div className="absolute top-0 bottom-0 right-0 w-44 bg-gradient-to-l from-[#9f1239] via-[#be123c] to-transparent rounded-r-2xl opacity-90 [clip-path:polygon(100%_0,100%_100%,0_50%)]" />
        </div>

        {/* Envelope Top Flap (Triangular 3D Fold) */}
        <motion.div
          animate={isOpening || isOpen ? { rotateX: -170 } : { rotateX: 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          className="absolute top-0 inset-x-0 h-32 origin-top z-30 [transform-style:preserve-3d]"
        >
          <div className="w-full h-full bg-gradient-to-b from-[#e11d48] via-[#f43f5e] to-[#fb7185] rounded-t-2xl shadow-md border-t border-rose-300/40 [clip-path:polygon(0_0,100%_0,50%_100%)] relative">
            <div className="absolute inset-x-8 top-1 h-[1px] bg-white/40" />
          </div>
        </motion.div>

        {/* 3D Wax Seal Stamp (Centered over flap peak) */}
        <motion.div
          animate={isOpening || isOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center"
        >
          {/* Golden Ribbon Tails */}
          <div className="absolute -bottom-4 flex gap-1 pointer-events-none">
            <div className="w-2.5 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b-sm rotate-[-15deg] shadow-sm" />
            <div className="w-2.5 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b-sm rotate-[15deg] shadow-sm" />
          </div>

          {/* Wax Seal Circle */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#b91c1c] via-[#dc2626] to-[#7f1d1d] shadow-xl border-2 border-amber-300/60 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform">
            <div className="absolute inset-1 rounded-full border border-amber-200/40" />
            <span className="font-script text-amber-200 text-2xl font-bold drop-shadow-sm select-none">♥</span>
            {/* Glossy specular highlight */}
            <div className="absolute top-1 left-2 w-4 h-2 bg-white/40 rounded-full blur-[1px] rotate-[-30deg]" />
          </div>
        </motion.div>
      </motion.div>

      {/* Helper text below envelope */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 text-sm text-slate-600 font-medium tracking-tight text-center"
      >
        💌 Tap the wax seal to break the envelope & read your letter
      </motion.p>
    </div>
  );
};
