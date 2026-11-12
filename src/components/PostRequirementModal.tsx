import React, { useState } from 'react';
import type { Requirement } from '../types';
import { X, Send } from 'lucide-react';

interface PostRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (req: Requirement) => void;
}

export const PostRequirementModal: React.FC<PostRequirementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('textiles');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [talukId, setTalukId] = useState('harur');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !budget) return;

    const newReq: Requirement = {
      id: `req_${Date.now()}`,
      title,
      category,
      budget: Number(budget),
      description,
      talukId,
      status: 'open',
      createdAt: new Date().toISOString(),
      quotes: [],
    };

    onSubmit(newReq);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-black text-slate-900">வணிகத் தேவை சமர்ப்பித்தல்</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-slate-700 mb-1">தேவையின் தலைப்பு</label>
            <input
              type="text"
              required
              placeholder="எ.கா: 100 திருமண பட்டு புடவைகள் மொத்த ஆர்டர்"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1">தொழில் பிரிவு</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-medium cursor-pointer"
              >
                <option value="textiles">ஜவுளி & ஆடைகள்</option>
                <option value="jewellery">தங்கம் & வெள்ளி நகைகள்</option>
                <option value="cctv">CCTV & பாதுகாப்பு</option>
                <option value="photography">4K வீடியோ & போட்டோ</option>
                <option value="agriculture">இயற்கை விவசாயம்</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">பட்ஜெட் (₹)</label>
              <input
                type="number"
                required
                placeholder="எ.கா: 150000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1">முழு விவரம்</label>
            <textarea
              rows={3}
              placeholder="எவ்வளவு அளவு தேவை? என்னென்ன தர நிர்ணயங்கள் தேவை?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 font-medium"
            />
          </div>

          <div className="pt-3 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 font-bold rounded-xl"
            >
              ரத்து
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-md cursor-pointer"
            >
              சமர்ப்பிக்க ➔
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
