import React, { useState, useEffect } from 'react';
import { FiX, FiStar, FiSave } from 'react-icons/fi';

const HighlightModal = ({ isOpen, onClose, onSave, selectedText, position }) => {
  const [note, setNote] = useState('');
  const [color, setColor] = useState('#fef08a'); // Default yellow

  useEffect(() => {
    if (isOpen) {
      setNote('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const colors = [
    { value: '#fef08a', label: 'Yellow', class: 'bg-yellow-200' },
    { value: '#bbf7d0', label: 'Green', class: 'bg-green-200' },
    { value: '#bfdbfe', label: 'Blue', class: 'bg-blue-200' },
    { value: '#fbcfe8', label: 'Pink', class: 'bg-pink-200' },
    { value: '#fed7aa', label: 'Orange', class: 'bg-orange-200' },
    { value: '#e9d5ff', label: 'Purple', class: 'bg-purple-200' },
  ];

  const handleSave = () => {
    onSave(selectedText, note, color);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FiStar className="text-yellow-500" />
            <h3 className="font-semibold text-gray-900">Add Highlight</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Selected Text Preview */}
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-300 m-4 rounded">
          <p className="text-sm text-gray-700 italic">"{selectedText}"</p>
        </div>

        {/* Color Picker */}
        <div className="px-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Highlight Color
          </label>
          <div className="flex gap-2">
            {colors.map(c => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={`w-8 h-8 rounded-full ${c.class} border-2 transition-all ${
                  color === c.value ? 'border-indigo-600 scale-110' : 'border-transparent hover:scale-105'
                }`}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Note Input */}
        <div className="px-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add a note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Why is this important? Your thoughts..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
          >
            <FiSave /> Save Highlight
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighlightModal;