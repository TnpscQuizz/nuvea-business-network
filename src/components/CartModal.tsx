import React from 'react';
import type { CartItem } from '../types';
import { X, Trash2, ShoppingBag } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  removeFromCart: (index: number) => void;
  clearCart: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cart,
  removeFromCart,
  clearCart,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const handleCheckout = () => {
    alert('ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது! சப்ளையர் விரைவில் தொடர்பு கொள்வார்.');
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-black text-slate-900">
              உங்கள் ஷாப்பிங் கார்ட் ({cart.length})
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-semibold text-xs space-y-2">
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
            <p>உங்கள் கார்ட்டில் பொருட்கள் எதுவும் இல்லை.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-black text-xs text-slate-900">{item.name}</h4>
                    <p className="text-[10px] text-slate-400">சப்ளையர்: {item.sellerName || 'Verified Supplier'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-xs text-slate-900">
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown with 18% GST */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex justify-between">
                <span>பொருட்கள் மதிப்பு:</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>18% GST வரி (9% CGST + 9% SGST):</span>
                <span className="text-emerald-700 font-bold">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-sm font-black text-slate-900">
                <span>மொத்தத் தொகை:</span>
                <span className="text-emerald-600">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              💳 ஆர்டரை உறுதி செய் (Checkout) ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
