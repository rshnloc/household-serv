import React, { useEffect, useState } from 'react';
import { X, Printer, ShieldCheck, CheckCircle2, Lock, FileText } from 'lucide-react';
import { api } from '../services/api';

interface ReceiptModalProps {
  bookingId: number | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ bookingId, onClose }) => {
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookingId) {
      setLoading(true);
      api.getPaymentReceipt(bookingId)
        .then(setReceipt)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [bookingId]);

  if (!bookingId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold">Escrow Tax Invoice & Receipt</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Content */}
        {loading || !receipt ? (
          <div className="p-10 text-center text-xs text-slate-400">Loading invoice...</div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
              <div>
                <h3 className="font-black text-xl text-slate-900">HomeAssist Marketplace</h3>
                <p className="text-xs text-slate-500">Verified Household Trade Network</p>
                <p className="text-[11px] text-slate-400 font-mono mt-1">Invoice: {receipt.invoice_number}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  {receipt.payment_status}
                </span>
                <p className="text-xs text-slate-500 mt-1">{receipt.date}</p>
                <p className="text-[11px] font-mono text-slate-400">Escrow ID: {receipt.escrow_id}</p>
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="font-bold text-slate-800 block mb-0.5">Customer / Property:</span>
                <p>{receipt.customer_name}</p>
                <p className="text-slate-400 text-[11px]">{receipt.service_address}</p>
              </div>
              <div>
                <span className="font-bold text-slate-800 block mb-0.5">Verified Contractor:</span>
                <p>{receipt.pro_business_name}</p>
                <p className="text-slate-400 text-[11px]">License: {receipt.pro_license}</p>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Itemized Scope Breakdown
              </span>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                {receipt.line_items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between p-2.5 border-b border-slate-100 last:border-none">
                    <span className="text-slate-700">{item.description}</span>
                    <span className="font-bold text-slate-900">${item.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between p-3 bg-slate-50 font-extrabold text-sm text-slate-900">
                  <span>Total Amount:</span>
                  <span className="text-emerald-600">${receipt.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Guarantee Note */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{receipt.escrow_guarantee_text}</span>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
