import React, { useState } from 'react';
import { X, Users, Heart, MessageCircle, Star, Sparkles, Send } from 'lucide-react';

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityModal: React.FC<CommunityModalProps> = ({ isOpen, onClose }) => {
  const [likes, setLikes] = useState<Record<number, number>>({ 1: 42, 2: 89, 3: 27 });
  const [hasLiked, setHasLiked] = useState<Record<number, boolean>>({});
  const [newComment, setNewComment] = useState('');

  if (!isOpen) return null;

  const toggleLike = (id: number) => {
    if (hasLiked[id]) {
      setLikes((prev) => ({ ...prev, [id]: prev[id] - 1 }));
      setHasLiked((prev) => ({ ...prev, [id]: false }));
    } else {
      setLikes((prev) => ({ ...prev, [id]: prev[id] + 1 }));
      setHasLiked((prev) => ({ ...prev, [id]: true }));
    }
  };

  const posts = [
    {
      id: 1,
      author: 'Mai Phương (Q.3, TP.HCM)',
      avatar: 'MP',
      salon: 'An Miên Spa Dưỡng Sinh',
      service: 'Gội đầu bồ kết 12 vị + Đả thông cổ vai gáy',
      content:
        'Hôm nay đi làm về mỏi nhừ người, book qua BeautyPink được giảm 50k mã BEAUTYPINK50. Không gian thơm mùi sả chanh cực kỳ thư thái, bạn kỹ thuật viên massage rất êm tay!',
      rating: 5,
      time: '2 giờ trước',
    },
    {
      id: 2,
      author: 'Thu Thảo (Cầu Giấy, Hà Nội)',
      avatar: 'TT',
      salon: 'Lotus Wellness Clinic',
      service: 'Làm sạch mụn lưng chuẩn y khoa',
      content:
        'Đã điều trị được 2 buổi, mụn lưng giảm hẳn 80% không để lại vết thâm. Phòng khám chuẩn y tế sạch sẽ 10/10 nha cả nhà!',
      rating: 5,
      time: '5 giờ trước',
    },
    {
      id: 3,
      author: 'Ngọc Hân (Hải Châu, Đà Nẵng)',
      avatar: 'NH',
      salon: 'Euphorea Salon',
      service: 'Nail móng thạch hồng sen ombre',
      content:
        'Mẫu nail hồng sen xinh ngất ngây, sơn gel bóng đẹp bền màu hơn 3 tuần rồi vẫn nguyên vẹn.',
      rating: 5,
      time: '1 ngày trước',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#B42D58] via-[#D28474] to-[#EB0F51] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-white" />
            <div>
              <h3 className="text-base font-extrabold tracking-tight">Cộng Đồng Làm Đẹp & Đánh Giá</h3>
              <p className="text-[11px] text-pink-100/90 font-medium">Chia sẻ trải nghiệm thực tế từ hội chị em</p>
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
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-2xl border border-pink-100 bg-pink-50/20 space-y-2.5 hover:border-pink-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-[#B42D58] text-white flex items-center justify-center text-xs font-bold">
                    {post.avatar}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{post.author}</h5>
                    <span className="text-[10px] text-slate-400">{post.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: post.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>

              <div className="bg-white p-2 rounded-xl border border-pink-100 text-[11px] text-[#B42D58] font-semibold flex items-center justify-between">
                <span>📍 {post.salon}</span>
                <span className="text-slate-500 font-normal truncate max-w-[150px]">
                  {post.service}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{post.content}</p>

              <div className="pt-2 flex items-center gap-4 text-xs text-slate-500 border-t border-pink-50">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    hasLiked[post.id] ? 'text-[#EB0F51] font-bold' : 'hover:text-[#EB0F51]'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      hasLiked[post.id] ? 'fill-[#EB0F51]' : ''
                    }`}
                  />
                  <span>{likes[post.id]} Yêu thích</span>
                </button>
                <div className="flex items-center gap-1.5 hover:text-slate-700 cursor-pointer">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Bình luận</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input box */}
        <div className="p-4 border-t border-pink-100 bg-white flex gap-2">
          <input
            type="text"
            placeholder="Chia sẻ cảm nhận làm đẹp của bạn..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 px-4 py-2 text-xs rounded-full border border-pink-200 focus:outline-none focus:border-[#EB0F51]"
          />
          <button
            onClick={() => {
              if (newComment.trim()) {
                alert('Cảm ơn bạn! Đánh giá đã được gửi duyệt thành công.');
                setNewComment('');
              }
            }}
            className="px-4 py-2 rounded-full bg-[#EB0F51] text-white text-xs font-bold flex items-center gap-1 hover:opacity-90"
          >
            <Send className="w-3 h-3" />
            <span>Đăng</span>
          </button>
        </div>
      </div>
    </div>
  );
};
