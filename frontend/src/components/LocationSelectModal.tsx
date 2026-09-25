import React, { useEffect, useState } from 'react';
import { Check, LoaderCircle, MapPin, X } from 'lucide-react';
import { getApiErrorMessage } from '../lib/api';
import { platformApi } from '../services/platformApi';
import type { LocationOption } from '../types';

interface LocationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocationId: number | null;
  required?: boolean;
  onSelectLocation: (location: LocationOption, label: string) => void;
}

const supportedCities = new Set(['ha-noi', 'ho-chi-minh']);

export const LocationSelectModal: React.FC<LocationSelectModalProps> = ({
  isOpen,
  onClose,
  selectedLocationId,
  required = false,
  onSelectLocation,
}) => {
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [choice, setChoice] = useState<LocationOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError('');
    platformApi.locations()
      .then((items) => {
        const available = items.filter((item) => supportedCities.has(item.slug));
        setCities(available);
        setChoice(available.find((item) => item.id === selectedLocationId) || null);
      })
      .catch((requestError) => setError(getApiErrorMessage(requestError, 'Không thể tải danh sách thành phố.')))
      .finally(() => setLoading(false));
  }, [isOpen, selectedLocationId]);

  if (!isOpen) return null;

  const confirm = () => {
    if (!choice) return;
    onSelectLocation(choice, choice.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="location-title">
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-2xl">
        <div className="relative bg-[#FFF0F3] px-6 py-7 sm:px-8">
          {!required && <button onClick={onClose} className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-500 shadow-sm hover:text-[#B42D58]" aria-label="Đóng"><X className="h-4 w-4" /></button>}
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EB0F51] text-white shadow-lg shadow-pink-500/20"><MapPin className="h-5 w-5" /></span>
          <h2 id="location-title" className="mt-5 text-2xl font-black tracking-tight text-slate-900">Chọn thành phố của bạn</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">BeautyLink hiện phục vụ tại Hà Nội và Thành phố Hồ Chí Minh.</p>
        </div>

        <div className="p-6 sm:p-8">
          {loading ? <div className="grid h-36 place-items-center"><LoaderCircle className="h-7 w-7 animate-spin text-[#EB0F51]" /></div> : (
            <div className="grid gap-3 sm:grid-cols-2">
              {cities.map((city) => {
                const selected = choice?.id === city.id;
                return <button key={city.id} type="button" onClick={() => setChoice(city)} className={`flex min-h-28 items-center justify-between rounded-3xl border p-5 text-left transition ${selected ? 'border-[#EB0F51] bg-[#FFF0F3] text-[#B42D58] shadow-sm ring-2 ring-pink-100' : 'border-slate-200 bg-white text-slate-700 hover:border-pink-300 hover:bg-pink-50'}`}><span><span className="block text-base font-black">{city.slug === 'ha-noi' ? 'Hà Nội' : 'TP. Hồ Chí Minh'}</span><span className="mt-1 block text-xs font-medium text-slate-500">Xem dịch vụ trong thành phố</span></span>{selected && <span className="grid h-7 w-7 place-items-center rounded-full bg-[#EB0F51] text-white"><Check className="h-4 w-4" /></span>}</button>;
              })}
            </div>
          )}
          {error && <p className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}
          <button type="button" onClick={confirm} disabled={!choice || loading} className="mt-6 min-h-12 w-full rounded-2xl bg-[#EB0F51] px-6 text-sm font-extrabold text-white shadow-lg shadow-pink-500/20 transition hover:bg-[#B42D58] disabled:cursor-not-allowed disabled:opacity-40">Xác nhận thành phố</button>
        </div>
      </div>
    </div>
  );
};
