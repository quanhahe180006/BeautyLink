import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BadgeCheck, CalendarDays, CheckCircle2, Clock3, LoaderCircle, MapPin, ShieldCheck, Sparkles, Star, UserRound, X } from 'lucide-react';
import { getApiErrorMessage } from '../lib/api';
import { platformApi } from '../services/platformApi';
import type { BeautyService, CurrentUser, Practitioner, ServiceCategory } from '../types';

interface ServicePageProps {
  category: ServiceCategory;
  locationId: number | null;
  locationLabel: string;
  currentUser: CurrentUser | null;
  onBack: () => void;
  onNeedLogin: () => void;
  onBookingCreated: (message: string) => void;
}

const formatMoney = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
const localDate = (offsetDays = 0) => {
  const value = new Date();
  value.setDate(value.getDate() + offsetDays);
  const offset = value.getTimezoneOffset();
  return new Date(value.getTime() - offset * 60_000).toISOString().slice(0, 10);
};

export const ServicePage: React.FC<ServicePageProps> = ({ category, locationId, locationLabel, currentUser, onBack, onNeedLogin, onBookingCreated }) => {
  const [services, setServices] = useState<BeautyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingService, setBookingService] = useState<BeautyService | null>(null);

  useEffect(() => {
    setLoading(true); setError('');
    platformApi.services(category.slug, locationId)
      .then(setServices)
      .catch((requestError) => setError(getApiErrorMessage(requestError, 'Không thể tải dịch vụ.')))
      .finally(() => setLoading(false));
  }, [category.slug, locationId]);

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-pink-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-extrabold text-slate-700 hover:bg-pink-50 hover:text-pink-700"><ArrowLeft className="h-4 w-4" /> Trang chủ</button>
          <div className="flex items-center gap-2 text-lg font-black"><Sparkles className="h-5 w-5 text-pink-600" /> Beauty<span className="-ml-2 text-pink-600">Link</span></div>
          <div className="hidden items-center gap-1.5 text-xs font-bold text-slate-500 sm:flex"><MapPin className="h-4 w-4 text-pink-600" /> {locationLabel}</div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <img src={category.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-[#8d1549]/45" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.24em] text-pink-300">Dịch vụ chuyên biệt</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">{category.name}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{category.description}</p>
          <div className="mt-7 flex flex-wrap gap-3 text-xs font-bold text-white/85">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 backdrop-blur"><BadgeCheck className="h-4 w-4 text-emerald-300" /> Nhà cung cấp đã xác minh</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 backdrop-blur"><CalendarDays className="h-4 w-4 text-pink-300" /> Lịch trống theo thời gian thực</span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-7 flex items-end justify-between">
          <div><p className="text-xs font-extrabold uppercase tracking-wider text-pink-600">Đang phục vụ tại {locationLabel}</p><h2 className="mt-1 text-2xl font-black">Chọn gói phù hợp với bạn</h2></div>
          {!loading && <span className="text-sm font-bold text-slate-400">{services.length} dịch vụ</span>}
        </div>

        {loading && <div className="grid h-56 place-items-center"><LoaderCircle className="h-8 w-8 animate-spin text-pink-600" /></div>}
        {error && <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 text-sm font-semibold text-rose-700">{error}</div>}
        {!loading && !error && services.length === 0 && <div className="rounded-3xl border border-pink-100 bg-white p-10 text-center"><MapPin className="mx-auto h-9 w-9 text-pink-400" /><h3 className="mt-4 text-lg font-black">Chưa có đối tác tại khu vực này</h3><p className="mt-2 text-sm text-slate-500">Hãy chọn khu vực gần đó hoặc quay lại sau.</p></div>}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article key={service.id} className="overflow-hidden rounded-[1.75rem] border border-pink-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-900/10">
              <div className="relative h-52 overflow-hidden"><img src={service.imageUrl} alt={service.name} className="h-full w-full object-cover" /><span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-extrabold text-slate-800 shadow"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {service.rating.toFixed(1)}</span></div>
              <div className="p-5">
                <p className="text-xs font-bold text-pink-600">{service.supplierName}</p>
                <h3 className="mt-1.5 text-xl font-black leading-tight">{service.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{service.description}</p>
                <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-slate-500"><span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" /> {service.durationMinutes} phút</span><span className="inline-flex min-w-0 items-center gap-1"><MapPin className="h-4 w-4 shrink-0" /><span className="truncate">{service.supplierAddress}</span></span></div>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4"><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Từ</p><p className="text-lg font-black text-pink-700">{formatMoney(service.price)}</p></div><button onClick={() => setBookingService(service)} className="rounded-2xl bg-slate-900 px-5 py-3 text-xs font-extrabold text-white transition hover:bg-pink-700">Chọn lịch</button></div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {bookingService && <BookingDialog service={bookingService} currentUser={currentUser} onClose={() => setBookingService(null)} onNeedLogin={onNeedLogin} onCreated={(code) => { setBookingService(null); onBookingCreated(`Đặt lịch thành công · Mã ${code}`); }} />}
    </div>
  );
};

export function BookingDialog({ service, currentUser, onClose, onNeedLogin, onCreated }: { service: BeautyService; currentUser: CurrentUser | null; onClose: () => void; onNeedLogin: () => void; onCreated: (code: string) => void }) {
  const [practitioner, setPractitioner] = useState<Practitioner | null>(service.practitioners[0] || null);
  const [date, setDate] = useState(localDate(1));
  const [slots, setSlots] = useState<string[]>([]);
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!practitioner || !date) return;
    setLoadingSlots(true); setTime(''); setError('');
    platformApi.availability(service.id, practitioner.id, date)
      .then((result) => setSlots(result.availableSlots.map((slot) => slot.slice(0, 5))))
      .catch((requestError) => setError(getApiErrorMessage(requestError, 'Không thể tải lịch trống.')))
      .finally(() => setLoadingSlots(false));
  }, [service.id, practitioner, date]);

  const canSubmit = Boolean(currentUser && currentUser.role === 'CUSTOMER' && practitioner && time);
  const confirm = async () => {
    if (!currentUser) { onNeedLogin(); return; }
    if (currentUser.role !== 'CUSTOMER') { setError('Chỉ tài khoản khách hàng có thể đặt lịch.'); return; }
    if (!practitioner || !time) return;
    setSubmitting(true); setError('');
    try {
      const booking = await platformApi.createBooking({ serviceId: service.id, practitionerId: practitioner.id, appointmentDate: date, startTime: time, note: note.trim() || undefined });
      onCreated(booking.bookingCode);
    } catch (requestError) { setError(getApiErrorMessage(requestError, 'Không thể xác nhận lịch hẹn.')); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 p-6"><div><p className="text-xs font-extrabold uppercase tracking-wider text-pink-600">Xác nhận lịch hẹn</p><h2 className="mt-1 text-xl font-black">{service.name}</h2><p className="mt-1 text-sm text-slate-500">{service.supplierName}</p></div><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-pink-50 hover:text-pink-700"><X className="h-4 w-4" /></button></div>
        <div className="space-y-5 p-6">
          <div><label className="mb-2 block text-xs font-black text-slate-700">Chuyên viên</label><div className="grid gap-2 sm:grid-cols-2">{service.practitioners.map((person) => <button key={person.id} onClick={() => setPractitioner(person)} className={`flex items-center gap-3 rounded-2xl border p-3 text-left ${practitioner?.id === person.id ? 'border-pink-500 bg-pink-50' : 'border-slate-200'}`}><span className="grid h-9 w-9 place-items-center rounded-full bg-white"><UserRound className="h-4 w-4 text-pink-600" /></span><span><span className="block text-sm font-extrabold">{person.displayName}</span><span className="block text-[11px] text-slate-500">{person.specialty}</span></span></button>)}</div></div>
          <label className="block"><span className="mb-2 block text-xs font-black text-slate-700">Ngày hẹn</span><input type="date" min={localDate()} value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-pink-400" /></label>
          <div><span className="mb-2 block text-xs font-black text-slate-700">Khung giờ còn trống</span>{loadingSlots ? <LoaderCircle className="h-5 w-5 animate-spin text-pink-600" /> : slots.length ? <div className="grid grid-cols-4 gap-2">{slots.map((slot) => <button key={slot} onClick={() => setTime(slot)} className={`rounded-xl border px-2 py-2.5 text-xs font-extrabold ${time === slot ? 'border-pink-600 bg-pink-600 text-white' : 'border-slate-200 hover:border-pink-300'}`}>{slot}</button>)}</div> : <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">Không còn khung giờ trong ngày này.</p>}</div>
          <label className="block"><span className="mb-2 block text-xs font-black text-slate-700">Ghi chú <span className="font-normal text-slate-400">(không bắt buộc)</span></span><textarea maxLength={500} value={note} onChange={(event) => setNote(event.target.value)} className="min-h-20 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-pink-400" placeholder="Dị ứng, yêu cầu đặc biệt..." /></label>
          {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</p>}
          {!currentUser && <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800"><strong>Đăng nhập để giữ chỗ.</strong> Lựa chọn hiện tại sẽ được giữ trên trang.</div>}
          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-5"><div><p className="text-[10px] font-bold uppercase text-slate-400">Thanh toán mô phỏng</p><p className="text-xl font-black text-pink-700">{formatMoney(service.price)}</p></div><button onClick={confirm} disabled={Boolean(currentUser) && !canSubmit || submitting} className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-slate-900 px-6 text-sm font-extrabold text-white hover:bg-pink-700 disabled:opacity-40">{submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : currentUser ? <CheckCircle2 className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}{currentUser ? 'Xác nhận đặt lịch' : 'Đăng nhập để đặt'}</button></div>
        </div>
      </div>
    </div>
  );
}
