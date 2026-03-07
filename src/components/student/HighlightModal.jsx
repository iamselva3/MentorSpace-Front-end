import React, { useState, useEffect } from 'react';
import { FiX, FiStar, FiSave } from 'react-icons/fi';

const HighlightModal = ({ isOpen, onClose, onSave, selectedText, position }) => {
  const [note, setNote] = useState('');
  const [color, setColor] = useState('#fef08a'); 

  useEffect(() => {
    if (isOpen) {
      setNote('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const colors = [
    { value: '#fef08a', label: 'Yellow', class: 'bg-yellow-200', darkClass: 'bg-yellow-500/30', borderClass: 'border-yellow-500/50' },
    { value: '#bbf7d0', label: 'Green', class: 'bg-green-200', darkClass: 'bg-green-500/30', borderClass: 'border-green-500/50' },
    { value: '#bfdbfe', label: 'Blue', class: 'bg-blue-200', darkClass: 'bg-blue-500/30', borderClass: 'border-blue-500/50' },
    { value: '#fbcfe8', label: 'Pink', class: 'bg-pink-200', darkClass: 'bg-pink-500/30', borderClass: 'border-pink-500/50' },
    { value: '#fed7aa', label: 'Orange', class: 'bg-orange-200', darkClass: 'bg-orange-500/30', borderClass: 'border-orange-500/50' },
    { value: '#e9d5ff', label: 'Purple', class: 'bg-purple-200', darkClass: 'bg-purple-500/30', borderClass: 'border-purple-500/50' },
  ];

  const handleSave = () => {
    onSave(selectedText, note, color);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-fadeIn border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <FiStar className="text-yellow-400" />
            <h3 className="font-semibold text-white">Add Highlight</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-300 rounded-full hover:bg-gray-700 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-4 bg-indigo-500/10 border-l-4 border-indigo-500/50 mx-4 mt-4 rounded">
          <p className="text-sm text-gray-300 italic">"{selectedText}"</p>
        </div>

        <div className="px-4 mb-4 mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Highlight Color
          </label>
          <div className="flex gap-2">
            {colors.map(c => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={`w-8 h-8 rounded-full ${c.darkClass} border-2 transition-all ${
                  color === c.value 
                    ? 'border-indigo-400 scale-110 ring-2 ring-indigo-400/50' 
                    : 'border-gray-600 hover:scale-105 hover:border-gray-500'
                }`}
                title={c.label}
              />
            ))}
          </div>
        </div>

        <div className="px-4 mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Add a note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Why is this important? Your thoughts..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            rows="3"
            autoFocus
          />
        </div>

        
        <div className="flex justify-end gap-2 p-4 border-t border-gray-700 bg-gray-900/50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/20"
          >
            <FiSave /> Save Highlight
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighlightModal;