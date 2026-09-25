import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, Phone, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { getApiErrorMessage } from '../lib/api';
import { platformApi } from '../services/platformApi';
import type { CurrentUser } from '../types';

interface AuthPageProps {
  initialMode: 'login' | 'register';
  onBackToHome: () => void;
  onSuccess: (user: CurrentUser) => void;
}

const mapUser = (user: { id: number; fullName: string; phone: string; email?: string | null; role: CurrentUser['role']; loyaltyPoints: number }): CurrentUser => ({
  id: user.id,
  name: user.fullName,
  phone: user.phone,
  email: user.email || undefined,
  role: user.role,
  loyaltyPoints: user.loyaltyPoints,
  memberTier: user.loyaltyPoints >= 1000 ? 'VIP' : 'Standard',
});

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode, onBackToHome, onSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const normalizedIdentifier = identifier.replace(/[\s.-]/g, '');
    if (mode === 'register' && password !== confirmPassword) {
      setError('Mật khẩu xác nhận chưa khớp.');
      return;
    }
    setLoading(true);
    try {
      const response = mode === 'login'
        ? await platformApi.login(identifier.trim(), password)
        : await platformApi.register({ fullName: fullName.trim(), phone: normalizedIdentifier, email: email.trim() || undefined, password });
      onSuccess(mapUser(response.user));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Không thể đăng nhập. Vui lòng kiểm tra lại thông tin.'));
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await platformApi.login('0900000001', 'Demo123!');
      onSuccess(mapUser(response.user));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Hãy khởi động backend để dùng tài khoản demo.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-[1.05fr_.95fr] bg-[#FFF0F3]">
      <section className="hidden lg:flex relative overflow-hidden bg-slate-950 p-12 text-white">
        <img src="https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=1400&q=88" alt="Chuyên viên trang điểm BeautyLink" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-[#6b153f]/60 to-[#EB0F51]/35" />
        <div className="relative z-10 flex w-full flex-col justify-between">
          <button onClick={onBackToHome} className="flex w-fit items-center gap-3 text-left" type="button">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 backdrop-blur"><Sparkles className="h-5 w-5" /></span>
            <span className="text-2xl font-black">Beauty<span className="text-pink-300">Link</span></span>
          </button>
          <div className="max-w-xl pb-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-pink-200">Đặt lịch làm đẹp đáng tin cậy</p>
            <h1 className="text-5xl font-black leading-[1.08]">Một tài khoản.<br />Mọi trải nghiệm làm đẹp.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/75">Khám phá chuyên viên đã xác minh, xem lịch trống thực tế và quản lý mọi cuộc hẹn tại một nơi.</p>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <button type="button" onClick={onBackToHome} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-pink-700">
            <ArrowLeft className="h-4 w-4" /> Về trang chủ
          </button>
          <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-2xl shadow-pink-900/10 sm:p-8">
            <div className="mb-7">
              <p className="text-sm font-bold text-pink-600">{mode === 'login' ? 'Chào mừng trở lại' : 'Bắt đầu với BeautyLink'}</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900">{mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{mode === 'login' ? 'Tiếp tục quản lý lịch hẹn của bạn.' : 'Đăng ký miễn phí trong chưa đầy một phút.'}</p>
            </div>

            <form className="space-y-4" onSubmit={submit}>
              {mode === 'register' && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">Họ và tên</span>
                  <span className="relative block"><UserRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" /><input required minLength={2} value={fullName} onChange={(event) => setFullName(event.target.value)} className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100" placeholder="Nguyễn Minh Anh" /></span>
                </label>
              )}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">{mode === 'login' ? 'Số điện thoại hoặc email' : 'Số điện thoại'}</span>
                <span className="relative block"><Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" /><input required value={identifier} onChange={(event) => setIdentifier(event.target.value)} className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100" placeholder={mode === 'login' ? '0900000001 hoặc email' : '09xxxxxxxx'} /></span>
              </label>
              {mode === 'register' && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">Email <span className="font-normal text-slate-400">(không bắt buộc)</span></span>
                  <span className="relative block"><Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100" placeholder="ban@example.com" /></span>
                </label>
              )}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">Mật khẩu</span>
                <span className="relative block"><LockKeyhole className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" /><input required minLength={8} type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-11 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100" placeholder="Tối thiểu 8 ký tự" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3.5 top-3.5 text-slate-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span>
              </label>
              {mode === 'register' && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">Xác nhận mật khẩu</span>
                  <input required minLength={8} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100" />
                </label>
              )}
              {error && <div role="alert" className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div>}
              <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#B42D58] to-[#EB0F51] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-pink-500/25 transition hover:-translate-y-0.5 disabled:opacity-60">
                {loading && <LoaderCircle className="h-4 w-4 animate-spin" />} {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
              </button>
            </form>

            {mode === 'login' && <button type="button" disabled={loading} onClick={demoLogin} className="mt-3 w-full rounded-2xl border border-pink-200 bg-pink-50 py-3 text-xs font-bold text-pink-700 hover:bg-pink-100">Dùng tài khoản khách hàng demo</button>}
            <div className="mt-6 flex items-center justify-center gap-1 text-sm text-slate-500">
              {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="font-extrabold text-pink-700">{mode === 'login' ? 'Đăng ký' : 'Đăng nhập'}</button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-[11px] font-semibold text-slate-400"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Mật khẩu được mã hóa, phiên đăng nhập được bảo vệ</div>
          </div>
        </div>
      </section>
    </main>
  );
};
