import React from 'react';
import { motion } from 'framer-motion';

interface EnvelopeProps {
  onOpen: () => void;
  isOpen: boolean;
}

export const Envelope: React.FC<EnvelopeProps> = ({ onOpen, isOpen }) => {
  return (
    <motion.div
      className="w-80 h-56 bg-blush-300 relative rounded-lg cursor-pointer shadow-2xl"
      onClick={onOpen}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Front */}
      <div className="absolute inset-0 bg-blush-400 clip-path-envelope" />
      <motion.div
        className="absolute top-0 inset-x-0 h-40 bg-blush-200 origin-top rounded-t-lg z-20"
        initial={false}
        animate={{ rotateX: isOpen ? -180 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 border-t-8 border-blush-500 rounded-t-lg" />
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-warmGold-400 rounded-full border-4 border-white flex items-center justify-center font-script text-white text-3xl">♥</div>
      </div>
    </motion.div>
  );
};
