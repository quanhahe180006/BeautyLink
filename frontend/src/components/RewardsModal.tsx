import React, { useState } from 'react';
import { X, Gift, Sparkles, Award, CheckCircle } from 'lucide-react';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({ isOpen, onClose }) => {
  const [points, setPoints] = useState(380);
  const [redeemed, setRedeemed] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const rewardItems = [
    {
      id: 'r-1',
      title: 'Voucher Giảm 50K dịch vụ bất kỳ',
      cost: 150,
      description: 'Áp dụng cho hóa đơn từ 200k tại tất cả đối tác BeautyPink',
      badge: 'Phổ biến nhất',
    },
    {
      id: 'r-2',
      title: 'Tặng 1 Hộp Mặt Nạ Collagen Hoa Hồng',
      cost: 250,
      description: 'Nhận quà trực tiếp tại quầy check-in khi sử dụng dịch vụ',
      badge: 'Quà tặng',
    },
    {
      id: 'r-3',
      title: 'Miễn Phí 1 Buổi Xông Hơi Thảo Dược 45p',
      cost: 350,
      description: 'Trải nghiệm xông hơi đá muối thải độc toàn thân',
      badge: 'Đặc quyền VIP',
    },
  ];

  const handleRedeem = (item: (typeof rewardItems)[0]) => {
    if (points >= item.cost) {
      setPoints((prev) => prev - item.cost);
      setRedeemed((prev) => ({ ...prev, [item.id]: true }));
    } else {
      alert('Bạn chưa đủ điểm tích lũy để đổi phần quà này. Hãy đặt lịch làm đẹp để tích thêm điểm nhé!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#B42D58] via-[#D28474] to-[#EB0F51] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-white" />
            <div>
              <h3 className="text-base font-extrabold tracking-tight">BeautyPink Rewards Club</h3>
              <p className="text-[11px] text-pink-100/90 font-medium">Tích lũy điểm làm đẹp & nhận quà VIP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Points balance status banner */}
        <div className="p-4 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100/80 border-b border-pink-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Số điểm của bạn
            </span>
            <div className="text-2xl font-black text-[#B42D58] flex items-center gap-1.5">
              <span>{points}</span>
              <span className="text-xs font-semibold text-pink-600">Điểm Sen</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-white text-[#EB0F51] text-xs font-extrabold border border-pink-200 shadow-sm">
            Hạng: Rose VIP
          </span>
        </div>

        {/* Rewards list */}
        <div className="p-5 overflow-y-auto space-y-3">
          {rewardItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-pink-100 bg-white hover:border-pink-300 transition-all flex items-start justify-between gap-3 shadow-sm"
            >
              <div className="flex-1">
                <span className="px-2 py-0.5 rounded bg-pink-100 text-[#B42D58] text-[10px] font-bold">
                  {item.badge}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                <div className="mt-2 text-xs font-bold text-[#EB0F51]">
                  Yêu cầu: {item.cost} Điểm Sen
                </div>
              </div>

              <button
                onClick={() => handleRedeem(item)}
                disabled={redeemed[item.id] || points < item.cost}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  redeemed[item.id]
                    ? 'bg-emerald-100 text-emerald-700 cursor-default'
                    : points < item.cost
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#EB0F51] to-[#B42D58] text-white hover:opacity-90 shadow'
                }`}
              >
                {redeemed[item.id] ? 'Đã đổi quà' : 'Đổi ngay'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
