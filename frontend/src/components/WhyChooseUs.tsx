import React from 'react';
import { Search, ThumbsUp, CalendarClock, CreditCard, ShieldCheck } from 'lucide-react';

export const WhyChooseUs: React.FC = React.memo(() => {
  const features = [
    {
      id: 1,
      title: 'Tìm kiếm nơi làm đẹp',
      description:
        'Khám phá và tìm kiếm Spa, Salon, Thẩm mỹ, Phòng khám uy tín gần bạn chỉ trong vài giây.',
      icon: Search,
      bg: 'from-pink-100 to-rose-50',
      iconColor: 'text-[#EB0F51]',
    },
    {
      id: 2,
      title: 'Các địa điểm uy tín',
      description:
        'Mua đa dạng dịch vụ làm đẹp uy tín, an toàn với các đánh giá xác thực từ người dùng thật.',
      icon: ThumbsUp,
      bg: 'from-rose-100 to-pink-50',
      iconColor: 'text-[#B42D58]',
    },
    {
      id: 3,
      title: 'Đặt lịch trực tuyến',
      description:
        'Đặt lịch làm đẹp trực tuyến nhanh chóng 30s. Chọn trước chuyên viên, không cần chờ đợi.',
      icon: CalendarClock,
      bg: 'from-fuchsia-100 to-pink-50',
      iconColor: 'text-[#a21caf]',
    },
    {
      id: 4,
      title: 'Thanh toán đa kênh',
      description:
        'Thanh toán online tiện lợi, bảo mật cao qua MoMo, VNPay, thẻ tín dụng hoặc thanh toán tại quầy.',
      icon: CreditCard,
      bg: 'from-pink-100 to-purple-50',
      iconColor: 'text-[#EB0F51]',
    },
  ];

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Vì sao nên chọn <span className="bg-gradient-to-r from-[#B42D58] to-[#EB0F51] bg-clip-text text-transparent">BeautyPink</span> ?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Hệ sinh thái công nghệ giúp phái đẹp an tâm trải nghiệm dịch vụ chất lượng cao nhất
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.id}
              className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-pink-100/80 shadow-sm hover:shadow-md hover:border-pink-300 transition-all group"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${f.bg} flex items-center justify-center ${f.iconColor} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner`}
              >
                <Icon className="w-8 h-8" />
              </div>

              <h3 className="text-base font-bold text-slate-800 group-hover:text-[#B42D58] transition-colors">
                {f.title}
              </h3>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {f.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
});

WhyChooseUs.displayName = 'WhyChooseUs';
