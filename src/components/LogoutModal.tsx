import { LogOut, ShieldAlert } from "lucide-react";
import React, { useState, useEffect } from 'react';

interface LogoutModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutModal({ show, onConfirm, onCancel }: LogoutModalProps) {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
      onClick={onCancel} // Close modal on backdrop click
    >
      <div
        className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl w-full max-w-sm m-4 p-8 transform transition-all duration-300
                    ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Icon and Title */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 border-2 border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut size={32} className="text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Xác nhận Đăng xuất
          </h3>
        </div>

        {/* Warning Message */}
        <p className="text-white/70 text-center text-base leading-relaxed mb-8">
          Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không? Bạn sẽ cần đăng nhập lại để tiếp tục.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row-reverse gap-4">
          {/* Confirm Button (Primary Action, styled red for warning) */}
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black/20 font-semibold"
            aria-label="Confirm logout"
          >
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
          
          {/* Cancel Button (Secondary Action) */}
          <button
            onClick={onCancel}
            className="flex-1 bg-white/10 hover:bg-white/20 border border-transparent text-white/80 hover:text-white px-4 py-3 rounded-lg transition-colors duration-300 font-medium"
            aria-label="Cancel logout"
          >
            Ở lại
          </button>
        </div>
      </div>
    </div>
  );
}