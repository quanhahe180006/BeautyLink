import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, Eye, EyeOff, LoaderCircle, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { getApiErrorMessage } from '../lib/api';
import { platformApi } from '../services/platformApi';
import type { CurrentUser, LocationOption } from '../types';

interface SupplierRegisterPageProps {
  onBack: () => void;
  onSuccess: (user: CurrentUser) => void;
  onLogin: () => void;
}

const businessTypes = ['Makeup Studio', 'Spa & Dưỡng sinh', 'Thẩm mỹ viện & Clinic', 'Nail & Mi', 'Salon tóc'];

export const SupplierRegisterPage: React.FC<SupplierRegisterPageProps> = ({ onBack, onSuccess, onLogin }) => {
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [form, setForm] = useState({
    ownerName: '', phone: '', email: '', password: '', confirmPassword: '',
    businessName: '', businessType: businessTypes[0], locationId: '', addressLine: '',
    description: '', specialty: '',
  });

  useEffect(() => {
    platformApi.locations().then(setCities).catch((requestError) => setError(getApiErrorMessage(requestError)));
  }, []);

  const canSubmit = useMemo(() => Boolean(
    form.ownerName.trim() && form.phone.trim() && form.email.trim() && form.password.length >= 8 &&
    form.password === form.confirmPassword && form.businessName.trim() && form.locationId &&
    form.addressLine.trim() && accepted
  ), [form, accepted]);

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận chưa khớp.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await platformApi.registerSupplier({
        ownerName: form.ownerName.trim(), phone: form.phone.trim(), email: form.email.trim(), password: form.password,
        businessName: form.businessName.trim(), businessType: form.businessType,
        locationId: Number(form.locationId), addressLine: form.addressLine.trim(),
        description: form.description.trim() || undefined, specialty: form.specialty.trim() || undefined,
      });
      onSuccess({
        id: result.auth.user.id, name: result.auth.user.fullName, phone: result.auth.user.phone,
        email: result.auth.user.email || undefined, role: result.auth.user.role,
        loyaltyPoints: result.auth.user.loyaltyPoints,
      });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-slate-900">
      <header className="border-b border-pink-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#EB0F51]"><ArrowLeft className="h-4 w-4" /> Trang chủ</button>
          <span className="text-xl font-black tracking-tight">Beauty<span className="text-[#EB0F51]">Link</span> <span className="text-sm text-slate-400">Partner</span></span>
          <button onClick={onLogin} className="text-sm font-extrabold text-[#B42D58] hover:text-[#EB0F51]">Đăng nhập đối tác</button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:py-14">
        <section className="rounded-[2rem] bg-gradient-to-br from-[#B42D58] via-[#EB0F51] to-[#D28474] p-8 text-white shadow-xl shadow-pink-900/10 lg:sticky lg:top-8 lg:h-fit lg:p-10">
          <div className="mb-8 grid h-14 w-14 place-items-center rounded-2xl bg-white/15"><Building2 className="h-7 w-7" /></div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-pink-100">BeautyLink for Business</p>
          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">Đưa dịch vụ của bạn đến đúng khách hàng.</h1>
          <p className="mt-4 text-sm leading-6 text-pink-50/90">Tạo gian hàng, quản lý đội ngũ và chủ động giờ nhận lịch trong một nơi. Đăng ký hoàn toàn miễn phí.</p>
          <div className="mt-8 space-y-4">
            {[
              ['Tài khoản vận hành ngay', 'Dashboard và lịch làm việc được tạo ngay sau đăng ký.'],
              ['Lịch thông minh', 'Thiết lập giờ làm, giờ nghỉ và độ dài khung giờ cho từng chuyên viên.'],
              ['Duyệt trước khi hiển thị', 'Hồ sơ ở trạng thái chờ duyệt và chưa xuất hiện công khai.'],
            ].map(([title, text]) => <div key={title} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="text-sm font-black">{title}</p><p className="mt-0.5 text-xs leading-5 text-pink-50/80">{text}</p></div></div>)}
          </div>
          <div className="mt-9 flex items-center gap-2 rounded-2xl bg-white/10 p-4 text-xs font-semibold"><ShieldCheck className="h-5 w-5 shrink-0" />Thông tin của bạn được bảo vệ và chỉ dùng để vận hành gian hàng.</div>
        </section>

        <section className="rounded-[2rem] border border-pink-100 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          <div className="mb-7"><div className="flex items-center gap-2 text-[#EB0F51]"><Sparkles className="h-4 w-4" /><span className="text-xs font-black uppercase tracking-widest">Đăng ký nhà cung cấp</span></div><h2 className="mt-2 text-2xl font-black sm:text-3xl">Tạo hồ sơ đối tác</h2><p className="mt-2 text-sm text-slate-500">Mất khoảng 3 phút. Các trường có dấu * là bắt buộc.</p></div>
          <form onSubmit={submit} className="space-y-7">
            <FormSection number="01" title="Thông tin người đại diện">
              <Field label="Họ và tên *"><input required value={form.ownerName} onChange={(e) => update('ownerName', e.target.value)} placeholder="Nguyễn Minh Anh" className="field" /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Số điện thoại *"><input required type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="09xxxxxxxx" className="field" /></Field>
                <Field label="Email *"><input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="partner@example.com" className="field" /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Mật khẩu *"><div className="relative"><input required minLength={8} type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Ít nhất 8 ký tự" className="field pr-11" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></Field>
                <Field label="Xác nhận mật khẩu *"><input required minLength={8} type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} className="field" /></Field>
              </div>
            </FormSection>

            <FormSection number="02" title="Thông tin cơ sở">
              <Field label="Tên cơ sở / thương hiệu *"><input required value={form.businessName} onChange={(e) => update('businessName', e.target.value)} placeholder="Ví dụ: Mây Beauty Studio" className="field" /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Mô hình kinh doanh *"><select value={form.businessType} onChange={(e) => update('businessType', e.target.value)} className="field bg-white">{businessTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
                <Field label="Thành phố *"><select required value={form.locationId} onChange={(e) => update('locationId', e.target.value)} className="field bg-white"><option value="">Chọn thành phố</option>{cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</select></Field>
              </div>
              <Field label="Địa chỉ cơ sở *"><div className="relative"><MapPin className="absolute left-3 top-3.5 h-4 w-4 text-[#D28474]" /><input required value={form.addressLine} onChange={(e) => update('addressLine', e.target.value)} placeholder="Số nhà, tên đường, phường/quận" className="field pl-10" /></div></Field>
              <Field label="Chuyên môn chính"><input value={form.specialty} onChange={(e) => update('specialty', e.target.value)} placeholder="Ví dụ: Trang điểm cô dâu, chăm sóc da" className="field" /></Field>
              <Field label="Giới thiệu ngắn"><textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Điểm nổi bật, kinh nghiệm và phong cách phục vụ..." className="field resize-none" /></Field>
            </FormSection>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-pink-50 p-4 text-xs leading-5 text-slate-600"><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#EB0F51]" /><span>Tôi xác nhận thông tin là chính xác và đồng ý với điều khoản dành cho đối tác BeautyLink.</span></label>
            {error && <p role="alert" className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</p>}
            <button disabled={!canSubmit || submitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#EB0F51] px-6 py-4 text-sm font-black text-white shadow-lg shadow-pink-600/20 transition hover:bg-[#B42D58] disabled:cursor-not-allowed disabled:opacity-45">{submitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <>Tạo tài khoản đối tác <ArrowRight className="h-4 w-4" /></>}</button>
          </form>
        </section>
      </main>
    </div>
  );
};

function FormSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <fieldset className="space-y-4"><legend className="mb-4 flex items-center gap-3 text-sm font-black"><span className="grid h-8 w-8 place-items-center rounded-xl bg-pink-50 text-xs text-[#EB0F51]">{number}</span>{title}</legend>{children}</fieldset>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-extrabold text-slate-700">{label}</span>{children}</label>;
}
