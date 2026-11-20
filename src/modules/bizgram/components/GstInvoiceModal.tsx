import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Download, Building2 } from 'lucide-react';
import type { BizOrder, BizUser } from '../../../types';

interface GstInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: BizOrder | null;
  currentUser: BizUser;
}

export const GstInvoiceModal: React.FC<GstInvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
  currentUser,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const cgst = Math.round(order.gstAmount / 2);
  const sgst = order.gstAmount - cgst;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-2xl animate-in fade-in duration-200 select-none">
      
      <div 
        className="w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl border-2 border-white flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold text-xs">
              GST
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Tax Invoice / B2B Supply Bill</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Rule 46 CGST
                </span>
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">
                Invoice #{order.orderNumber} • Date: {order.createdAt}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-900 font-sans print:p-0">
          
          {/* Top Brand & Verification Banner */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <div className="text-xl font-black tracking-tight text-slate-950">
                SHINEGAH<span className="text-xs text-slate-500 ml-1">™</span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                The Next-Gen Business Social & Trade Network
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                CIN: U72900TN2026PTC148902 • GSTIN: 33AABCS1429B1Z2
              </div>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>VERIFIED B2B SETTLEMENT</span>
              </span>
              <div className="text-[11px] font-mono text-slate-600 mt-1">
                Payment: <strong className="text-slate-900 uppercase">{order.paymentMethod.replace('_', ' ')}</strong> ({order.paymentStatus})
              </div>
            </div>
          </div>

          {/* Supplier & Recipient 2-Column Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Supplier Details */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Supplier (Seller Details)
              </div>
              <div className="font-extrabold text-slate-900 text-sm">
                {order.sellerName}
              </div>
              <div className="text-slate-600 font-mono text-[11px]">
                GSTIN: 33AABCS1429B1Z2
              </div>
              <div className="text-slate-500 text-[10px]">
                Tamil Nadu, India • Verified Registered B2B Entity
              </div>
            </div>

            {/* Buyer Details */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Billed & Shipped To (Buyer)
              </div>
              <div className="font-extrabold text-slate-900 text-sm">
                {order.buyerName}
              </div>
              <div className="text-slate-600 font-mono text-[11px]">
                GSTIN: {order.buyerGstin || '33AAECS5482M1Z8'}
              </div>
              <div className="text-slate-500 text-[10px] line-clamp-2">
                {order.buyerAddress}
              </div>
              <div className="text-slate-500 text-[10px] font-mono">
                Phone: {order.buyerPhone}
              </div>
            </div>
          </div>

          {/* Logistics & Tracking Info */}
          <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-blue-900 font-bold">Courier Logistics Partner: </span>
              <span className="font-semibold text-slate-900">{order.courierPartner || 'DTDC Express Cargo'}</span>
            </div>
            <div>
              <span className="text-blue-900 font-bold">Consignment Tracking #: </span>
              <span className="font-mono font-black text-blue-950">{order.trackingNumber || 'SHN-TRK-98421'}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Item Description</th>
                  <th className="p-3">HSN/SAC</th>
                  <th className="p-3 text-right">Qty</th>
                  <th className="p-3 text-right">Rate (₹)</th>
                  <th className="p-3 text-right">Taxable Amt (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                <tr>
                  <td className="p-3 font-mono">01</td>
                  <td className="p-3">
                    <div className="font-extrabold text-slate-900">{order.productName}</div>
                    <div className="text-[10px] text-slate-500">Commercial Wholesale Supply Agreement</div>
                  </td>
                  <td className="p-3 font-mono text-slate-600">998314</td>
                  <td className="p-3 text-right font-mono font-bold">{order.qty}</td>
                  <td className="p-3 text-right font-mono">₹{order.unitPrice.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-950">₹{order.subtotal.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Grand Total */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span>Taxable Value:</span>
                <span className="font-mono font-bold text-slate-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Central GST (CGST @ 9%):</span>
                <span className="font-mono font-bold text-slate-900">₹{cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>State GST (SGST @ 9%):</span>
                <span className="font-mono font-bold text-slate-900">₹{sgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-300 flex items-center justify-between font-black text-sm text-slate-950">
                <span>Total Amount (INR):</span>
                <span className="font-mono text-base text-slate-950">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Authorized Signature & Footer Note */}
          <div className="pt-4 border-t border-slate-200 flex items-end justify-between text-[11px] text-slate-500">
            <div>
              <p>This is a computer-generated GST tax invoice.</p>
              <p>Governed under Section 31 of CGST Act, 2017.</p>
            </div>
            <div className="text-right space-y-1">
              <div className="font-mono text-[9px] text-emerald-700 uppercase tracking-wider font-bold">
                ✓ Digitally Signed & Authenticated
              </div>
              <div className="font-extrabold text-slate-900">For {order.sellerName}</div>
              <div className="text-[10px] text-slate-500">Authorized Signatory</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
