import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, Truck, CreditCard, 
  Sparkles, ArrowRight, Building2, MapPin, Phone, 
  FileText, Check, AlertCircle, Zap, QrCode
} from 'lucide-react';
import type { BizOrder, BizUser } from '../../../types';
import { translations, type Language } from '../data/translations';

export interface CheckoutItem {
  id: string;
  name: string;
  sellerId: string;
  sellerName: string;
  price: number;
  moq: number;
  unit?: string;
  image: string;
  gstRate?: number;
  sampleAvailable?: boolean;
  samplePrice?: number;
}

interface InstantCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CheckoutItem | null;
  buyerUser: BizUser;
  onOrderSuccess: (newOrder: BizOrder) => void;
  lang?: Language;
}

export const InstantCheckoutModal: React.FC<InstantCheckoutModalProps> = ({
  isOpen,
  onClose,
  item,
  buyerUser,
  onOrderSuccess,
  lang = 'en',
}) => {
  const t = translations[lang] || translations.en;

  const [isSampleMode, setIsSampleMode] = useState(false);
  const [qty, setQty] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'upi_razorpay' | 'net_banking' | 'invoice_credit'>('upi_razorpay');
  const [deliveryAddress, setDeliveryAddress] = useState(
    buyerUser.outlets?.[0]?.address || buyerUser.locationTag || 'Plot 42, OMR IT Expressway, Chennai - 600113'
  );
  const [contactPhone, setContactPhone] = useState(buyerUser.phone || '917548820641');
  const [buyerGstin, setBuyerGstin] = useState(buyerUser.gstin || '33AABCS1429B1Z2');

  // Checkout Stages: 'form' | 'processing' | 'success'
  const [checkoutStage, setCheckoutStage] = useState<'form' | 'processing' | 'success'>('form');
  const [createdOrder, setCreatedOrder] = useState<BizOrder | null>(null);

  // Sync state whenever item changes
  useEffect(() => {
    if (item) {
      setIsSampleMode(false);
      setQty(item.moq || 1);
      setCheckoutStage('form');
      setCreatedOrder(null);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const unitPrice = isSampleMode && item.samplePrice ? item.samplePrice : item.price;
  const effectiveQty = isSampleMode ? 1 : Math.max(qty, item.moq || 1);
  const subtotal = unitPrice * effectiveQty;
  const gstRate = item.gstRate || 18;
  const gstAmount = Math.round((subtotal * gstRate) / 100);
  const totalAmount = subtotal + gstAmount;

  const handleQtyChange = (delta: number) => {
    if (isSampleMode) return;
    const min = item.moq || 1;
    setQty((prev) => Math.max(min, prev + delta));
  };

  const handlePlaceOrder = () => {
    setCheckoutStage('processing');

    setTimeout(() => {
      const orderNumber = `SHN-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      const trackingNumber = `SHN-TRK-${Math.floor(10000 + Math.random() * 90000)}`;

      const newOrder: BizOrder = {
        id: `ord_${Date.now()}`,
        orderNumber,
        buyerId: buyerUser.id,
        buyerName: buyerUser.businessName,
        buyerPhone: contactPhone,
        buyerAddress: deliveryAddress,
        buyerGstin,
        sellerId: item.sellerId,
        sellerName: item.sellerName,
        productId: item.id,
        productName: item.name,
        productImage: item.image,
        qty: effectiveQty,
        unitPrice,
        subtotal,
        gstAmount,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'invoice_credit' ? 'escrow_hold' : 'paid',
        status: 'placed',
        trackingNumber,
        courierPartner: 'DTDC Express Cargo Freight',
        estimatedDelivery: '3-4 Business Days',
        createdAt: 'Just now',
      };

      setCreatedOrder(newOrder);
      setCheckoutStage('success');
      onOrderSuccess(newOrder);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-2xl animate-in fade-in duration-200 select-none">
      
      {/* Modal Dialog Capsule */}
      <div 
        className="w-full max-w-lg apple-glass apple-specular-edge rounded-[36px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.35),0_0_50px_rgba(255,255,255,0.9)] border-2 border-white flex flex-col max-h-[92vh] bg-white/90"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Shinegah Instant B2B Checkout</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </h3>
              <p className="text-[10px] text-slate-500">
                Direct Factory Consignment with Verified GST Invoicing
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

        {/* STAGE 1: FORM */}
        {checkoutStage === 'form' && (
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
            
            {/* Product Card */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200 flex gap-3 shadow-sm">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100 shadow-sm"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="text-xs font-black text-slate-900 line-clamp-2 leading-snug">
                  {item.name}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span>Seller:</span>
                  <span className="font-bold text-slate-800">{item.sellerName}</span>
                  <CheckCircle2 className="w-3 h-3 text-slate-900 fill-slate-200" />
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-sm font-black text-slate-900 font-mono">
                    ₹{unitPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    / {item.unit || 'Unit'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200 ml-auto">
                    MOQ: {item.moq || 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Sample Order Option */}
            {item.sampleAvailable && item.samplePrice && (
              <div 
                onClick={() => setIsSampleMode(!isSampleMode)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                  isSampleMode 
                    ? 'bg-amber-50/80 border-amber-300 shadow-sm' 
                    : 'bg-white/60 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                    isSampleMode ? 'bg-amber-500 border-amber-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isSampleMode && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Order Single Evaluation Sample Piece
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Bypass MOQ constraint to test physical product quality before bulk shipment.
                    </div>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-700 font-mono shrink-0">
                  ₹{item.samplePrice.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* Quantity Stepper (if not sample mode) */}
            {!isSampleMode && (
              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-xs font-bold text-slate-900">Consignment Quantity</div>
                  <div className="text-[10px] text-slate-500">
                    Wholesale lot in {item.unit || 'Units'} (Min {item.moq || 1})
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleQtyChange(-1)}
                    disabled={qty <= (item.moq || 1)}
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-800 font-black flex items-center justify-center transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-black text-slate-900 min-w-8 text-center">
                    {effectiveQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQtyChange(1)}
                    className="w-8 h-8 rounded-xl bg-slate-950 hover:bg-black text-white font-black flex items-center justify-center transition cursor-pointer shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Delivery Destination & Contact Details */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-700" />
                  <span>Factory / Delivery Address</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">Verified Buyer Address</span>
              </div>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 text-slate-800 font-medium resize-none"
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">Phone for Logistics</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">Buyer GSTIN</label>
                  <input
                    type="text"
                    value={buyerGstin}
                    onChange={(e) => setBuyerGstin(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:outline-none focus:border-slate-900 uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 block">
                Select B2B Settlement Gateway
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                
                {/* 1. UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_razorpay')}
                  className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1 shadow-sm ${
                    paymentMethod === 'upi_razorpay'
                      ? 'bg-slate-950 text-white border-slate-950 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <QrCode className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-white/20">Instant</span>
                  </div>
                  <div className="font-extrabold text-[11px] leading-tight">UPI / QR</div>
                  <div className={`text-[9px] ${paymentMethod === 'upi_razorpay' ? 'text-slate-300' : 'text-slate-500'}`}>
                    GPay, PhonePe, Paytm
                  </div>
                </button>

                {/* 2. Net Banking */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('net_banking')}
                  className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1 shadow-sm ${
                    paymentMethod === 'net_banking'
                      ? 'bg-slate-950 text-white border-slate-950 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Building2 className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-white/20">NEFT</span>
                  </div>
                  <div className="font-extrabold text-[11px] leading-tight">Net Banking</div>
                  <div className={`text-[9px] ${paymentMethod === 'net_banking' ? 'text-slate-300' : 'text-slate-500'}`}>
                    HDFC, ICICI, SBI, Axis
                  </div>
                </button>

                {/* 3. Invoice Credit (Escrow) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('invoice_credit')}
                  className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1 shadow-sm ${
                    paymentMethod === 'invoice_credit'
                      ? 'bg-slate-950 text-white border-slate-950 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <FileText className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-500 text-white">Escrow</span>
                  </div>
                  <div className="font-extrabold text-[11px] leading-tight">30-Day Credit</div>
                  <div className={`text-[9px] ${paymentMethod === 'invoice_credit' ? 'text-slate-300' : 'text-slate-500'}`}>
                    GST Escrow Protection
                  </div>
                </button>

              </div>
            </div>

            {/* Price Calculation Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700 font-medium">
              <div className="flex items-center justify-between">
                <span>Subtotal ({effectiveQty} × ₹{unitPrice.toLocaleString('en-IN')})</span>
                <span className="font-mono font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST ({gstRate}% - CGST 9% + SGST 9%)</span>
                <span className="font-mono font-bold text-slate-900">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Direct Freight Insurance</span>
                <span className="text-emerald-700 font-bold">Complimentary B2B Cover</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-black text-slate-950">
                <span>Total Amount Payable</span>
                <span className="font-mono text-base text-slate-950">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>
        )}

        {/* STAGE 2: PROCESSING ANIMATION */}
        {checkoutStage === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-slate-950 animate-spin flex items-center justify-center" />
            <div className="space-y-1">
              <h4 className="font-black text-base text-slate-900">Securing B2B Payment Handshake...</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Connecting with HDFC Razorpay B2B Escrow Gateway & generating GST Invoice...
              </p>
            </div>
          </div>
        )}

        {/* STAGE 3: SUCCESS ANIMATION */}
        {checkoutStage === 'success' && createdOrder && (
          <div className="p-6 text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200">
                ORDER CONFIRMED & DISPATCHED TO FACTORY
              </span>
              <h3 className="text-xl font-black text-slate-950 tracking-tight">
                Thank You, {buyerUser.ownerName}!
              </h3>
              <p className="text-xs text-slate-600">
                Your wholesale order has been broadcasted to <span className="font-bold text-slate-900">{createdOrder.sellerName}</span>.
              </p>
            </div>

            {/* Receipt Summary Capsule */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-black text-slate-900">{createdOrder.orderNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Logistics Tracking ID:</span>
                <span className="font-mono font-black text-emerald-700">{createdOrder.trackingNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Carrier Partner:</span>
                <span className="font-bold text-slate-800">{createdOrder.courierPartner}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Paid (incl. 18% GST):</span>
                <span className="font-mono font-black text-slate-950">₹{createdOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-left text-[11px] flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Automatic 4-Stage Live Tracking is now activated in your <strong>Profile › Orders</strong> tab.
              </span>
            </div>

          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          {checkoutStage === 'form' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="flex-1 py-3 bg-slate-950 hover:bg-black text-white font-black text-xs rounded-full flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
              >
                <span>Authorize & Pay ₹{totalAmount.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {checkoutStage === 'success' && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-slate-950 hover:bg-black text-white font-black text-xs rounded-full shadow-lg transition cursor-pointer"
            >
              Done & View In Orders Tab
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
