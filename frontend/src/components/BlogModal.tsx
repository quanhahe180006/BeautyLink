import React from 'react';
import { X, Sparkles, BookOpen, Clock, Heart, Share2 } from 'lucide-react';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const articles = [
    {
      id: 1,
      title: 'Top 5 Liệu Trình Trị Mụn Lưng & Chăm Da Khoa Học Mùa Nắng Nóng',
      author: 'Bác Sĩ Lê Minh Thư - Da Liễu',
      time: '6 phút đọc',
      category: 'Chăm Sóc Da',
      summary:
        'Mụn lưng xuất hiện chủ yếu do bít tắc tuyến bã nhờn kết hợp mồ hôi và vi khuẩn P.acnes. Khám phá quy trình làm sạch sâu bằng acid salicylic và ánh sáng sinh học dịu nhẹ.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 2,
      title: 'Gội Đầu Dưỡng Sinh Đông Y Có Thực Sự Giúp Giảm Căng Thẳng & Ngủ Sâu?',
      author: 'Master Thảo Mộc Hương',
      time: '4 phút đọc',
      category: 'Dưỡng Sinh',
      summary:
        'Kết hợp nước cốt bồ kết cô đặc cùng kỹ thuật day ấn 14 huyệt vị vùng đầu - cổ - vai gáy giúp lưu thông khí huyết, giải tỏa áp lực công việc ngay sau 60 phút.',
      image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 3,
      title: 'Xu Hướng Phun Môi Tự Nhiên Collagen & Điêu Khắc Lông Mày 2026',
      author: 'Chuyên gia Bella Phun Xăm',
      time: '5 phút đọc',
      category: 'Phun Xăm',
      summary:
        'Tone hồng sen đào và hồng baby tự nhiên đang dẫn đầu xu hướng làm đẹp năm nay, mang lại vẻ rạng rỡ trẻ trung mà không cần makeup cầu kỳ.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#B42D58] via-[#D28474] to-[#EB0F51] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-white" />
            <div>
              <h3 className="text-base font-extrabold tracking-tight">Blog Làm Đẹp & Cẩm Nang Sắc Đẹp</h3>
              <p className="text-[11px] text-pink-100/90 font-medium">Bí quyết dưỡng nhan từ các chuyên gia da liễu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4">
          {articles.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-pink-100 bg-pink-50/20 hover:border-pink-300 transition-all flex flex-col sm:flex-row gap-4"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full sm:w-36 h-28 object-cover rounded-xl border border-pink-100"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded bg-pink-100 text-[#B42D58]">
                      {item.category}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-slate-400 font-medium flex items-center justify-between">
                  <span>Tác giả: {item.author}</span>
                  <span className="text-[#EB0F51] font-bold cursor-pointer hover:underline">
                    Đọc tiếp →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
