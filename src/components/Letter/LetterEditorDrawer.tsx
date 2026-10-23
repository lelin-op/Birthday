import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const LetterEditorDrawer: React.FC<{ onSave: (data: any) => void; isOpen: boolean; onClose: () => void; config: any }> = ({ onSave, isOpen, onClose, config }) => {
  const [formData, setFormData] = useState(config);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 p-6 overflow-y-auto"
    >
      <h2 className="text-xl font-bold mb-4">Edit Your Letter</h2>
      <div className="flex flex-col gap-4">
        <input
          placeholder="Recipient Name"
          value={formData.recipientName}
          onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
          className="p-2 border rounded"
        />
        <textarea
          placeholder="Letter Body"
          value={formData.letterBody}
          onChange={(e) => setFormData({...formData, letterBody: e.target.value})}
          className="p-2 border rounded h-40"
        />
        <button onClick={() => onSave(formData)} className="bg-pink-500 text-white p-2 rounded">Save</button>
        <button onClick={onClose} className="bg-gray-200 p-2 rounded">Close</button>
      </div>
    </motion.div>
  );
};
