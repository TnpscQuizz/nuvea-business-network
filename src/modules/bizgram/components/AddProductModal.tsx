import React, { useState, useRef } from 'react';
import { X, Upload, Plus, Camera, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import type { BizProduct, BizUser } from '../../../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: BizUser;
  onAddProduct: (newProduct: BizProduct) => void;
}

const CATEGORIES = [
  'Textiles & Handloom Silk',
  'Building Materials & Steel',
  'Machinery & Spares',
  'Agro Machinery & Tech',
  'Electronics & Electrical',
  'Chemicals & Polymers',
  'Packaging & Printing',
  'Food & Agro Processing',
  'Corporate Services & Software'
];

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAddProduct,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState<number>(18500);
  const [moq, setMoq] = useState<number>(10);
  const [unit, setUnit] = useState('Sets');
  const [description, setDescription] = useState('');
  const [gstRate, setGstRate] = useState<number>(18);
  const [sampleAvailable, setSampleAvailable] = useState(true);
  const [samplePrice, setSamplePrice] = useState<number>(2500);
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProd: BizProduct = {
      id: `prod_${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.businessName,
      name: name.trim(),
      category,
      price: Number(price),
      moq: Number(moq),
      unit: unit.trim() || 'Units',
      image: imagePreview,
      description: description.trim() || 'Factory direct wholesale consignment with verified GST invoice.',
      inStock: true,
      gstRate: Number(gstRate) || 18,
      sampleAvailable,
      samplePrice: sampleAvailable ? Number(samplePrice) : undefined,
    };

    onAddProduct(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-2xl animate-in fade-in duration-200 select-none">
      
      <div 
        className="w-full max-w-lg apple-glass apple-specular-edge rounded-[36px] overflow-hidden shadow-2xl border-2 border-white flex flex-col max-h-[92vh] bg-white/95"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-sm">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-900 tracking-tight">
                Add Wholesale Product to Store
              </h3>
              <p className="text-[10px] text-slate-500">
                Publish verified consignment with MOQ and live Buy Now checkout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden File Input for Device Photo */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* Direct Device Image Picker with Preview */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Product Image (From Computer / Phone)
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 hover:border-slate-900 transition cursor-pointer group flex items-center justify-center"
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 text-white font-bold text-xs">
                    <Camera className="w-4 h-4" />
                    <span>Change Image from Device</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-slate-500">
                  <Upload className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-bold">Tap to upload product photo</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG, WebP up to 10MB</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 block">Product / Consignment Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Pure Kanchipuram Handloom Silk Saree Consignment"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-medium"
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 block">Industry Sector / Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price, MOQ and Unit Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Unit Price (₹) *</label>
              <input
                type="number"
                required
                min={1}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">MOQ (Min Lot) *</label>
              <input
                type="number"
                required
                min={1}
                value={moq}
                onChange={(e) => setMoq(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Unit of Measure</label>
              <input
                type="text"
                required
                placeholder="Sets / Tons / Pcs"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {/* Sample Testing Option */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sampleAvailable}
                  onChange={(e) => setSampleAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900 accent-slate-950 cursor-pointer"
                />
                <span>Offer 1-Piece Sample Evaluation Order</span>
              </label>
              <span className="text-[10px] text-amber-700 font-bold">Bypasses MOQ</span>
            </div>
            {sampleAvailable && (
              <div className="pt-1 flex items-center gap-3">
                <span className="text-xs text-amber-900 font-medium">Sample Unit Price (₹):</span>
                <input
                  type="number"
                  min={1}
                  value={samplePrice}
                  onChange={(e) => setSamplePrice(Number(e.target.value))}
                  className="w-32 px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 block">Product Specifications & GST Notes</label>
            <textarea
              rows={2}
              placeholder="BIS / Silk Mark certification, alloy grades, dispatch turnaround time..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-medium resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-black shadow-md transition cursor-pointer"
            >
              Publish to Store
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
