import React, { useState } from 'react';
import { ADMIN_CONFIG } from '../config/admin';
import { Lock, KeyRound, ArrowLeft, ShieldAlert } from 'lucide-react';

interface AdminLoginModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_CONFIG.ADMIN_PIN) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  const handleKeypadPress = (val: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + val);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border-2 border-slate-200">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3.5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/30">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Akses Panel Panitia
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Masukkan PIN keamanan panitia untuk mengelola voting dan hasil.
          </p>
        </div>

        {/* Input PIN Display */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="flex justify-center gap-3 mb-5">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`h-14 w-12 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all ${
                  error
                    ? 'border-rose-400 bg-rose-50 text-rose-600 animate-shake'
                    : pin.length > idx
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-300 bg-slate-50 text-slate-400'
                }`}
              >
                {pin.length > idx ? '●' : ''}
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 text-center animate-scale-in">
              <ShieldAlert className="h-4 w-4" />
              <span>PIN salah! Silakan coba kembali.</span>
            </div>
          )}

          {/* Virtual Keypad yang Besar & Ramah Laptop Touchscreen / Mouse */}
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypadPress(digit)}
                className="h-12 sm:h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-blue-600 active:text-white font-black text-xl text-slate-800 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 sm:h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer active:scale-95"
            >
              Hapus
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="h-12 sm:h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-blue-600 active:text-white font-black text-xl text-slate-800 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => setPin('')}
              className="h-12 sm:h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer active:scale-95"
            >
              Reset
            </button>
          </div>

          {/* Tombol Aksi Bawah */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-3.5 rounded-2xl border-2 border-slate-300 text-slate-700 text-sm font-extrabold hover:bg-slate-100 transition-colors cursor-pointer active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Batal</span>
            </button>
            <button
              type="submit"
              disabled={pin.length < 4}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-sm font-black shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
            >
              <KeyRound className="h-4 w-4" />
              <span>Buka Panel</span>
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-[11px] font-medium text-slate-400">
          PIN default: <strong className="font-bold text-slate-600">1234</strong> (dapat disesuaikan pada <code>src/config/admin.ts</code>)
        </p>
      </div>
    </div>
  );
};
