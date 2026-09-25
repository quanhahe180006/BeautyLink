import React, { useState } from 'react';
import { X, TicketPercent, Copy, Check, Clock, Sparkles } from 'lucide-react';
import { VOUCHERS } from '../data/mockData';

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVoucher: (code: string) => void;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({
  isOpen,
  onClose,
  onApplyVoucher,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleUse = (code: string) => {
    onApplyVoucher(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#B42D58] via-[#D28474] to-[#EB0F51] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TicketPercent className="w-5 h-5 text-white" />
            <div>
              <h3 className="text-base font-extrabold tracking-tight">Ví Voucher & Mã Giảm Giá</h3>
              <p className="text-[11px] text-pink-100/90 font-medium">Săn mã ưu đãi độc quyền từ BeautyPink</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3.5">
          {VOUCHERS.map((v) => (
            <div
              key={v.code}
              className="p-4 rounded-2xl border border-pink-200/90 bg-gradient-to-r from-pink-50/50 via-white to-rose-50/30 flex items-start justify-between gap-3 shadow-sm hover:border-pink-300 transition-all"
            >
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 rounded bg-pink-100 text-[#B42D58] text-[10px] font-bold">
                  {v.tag}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1 leading-snug">
                  {v.title}
                </h4>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5">
                  <span>{v.minOrder}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3 text-[#EB0F51]" />
                    {v.expiry}
                  </span>
                </div>
                <div className="mt-2 text-xs font-mono font-bold text-[#EB0F51] bg-white px-2.5 py-1 rounded-lg border border-pink-200 inline-block">
                  {v.code}
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(v.code)}
                  className="px-3 py-1.5 rounded-xl border border-pink-200 hover:border-pink-300 text-xs font-semibold text-slate-700 bg-white hover:bg-pink-50 transition-colors flex items-center gap-1"
                >
                  {copiedCode === v.code ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleUse(v.code)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#EB0F51] to-[#B42D58] text-white text-xs font-bold shadow hover:opacity-90 transition-opacity"
                >
                  Dùng ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
