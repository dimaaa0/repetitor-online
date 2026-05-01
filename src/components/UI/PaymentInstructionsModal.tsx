import { CreditCard, Send, Copy, X } from "lucide-react";

interface PaymentInstructionsModalProps {
  onClose: () => void;
  isClosing?: boolean;
  userId: string;
}

const PaymentInstructionsModal = ({
  onClose,
  isClosing,
  userId,
}: PaymentInstructionsModalProps) => {

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Здесь можно добавить уведомление об успехе
  };

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm
                ${isClosing ? "animate-[fadeOut_0.3s_ease-in_forwards]" : "animate-[fadeIn_0.3s_ease-out]"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl w-full max-w-lg border border-slate-100 flex flex-col max-h-[95vh] overflow-hidden
                    ${isClosing
            ? "animate-[slideDown_0.3s_ease-in_forwards] sm:animate-[zoomOut_0.2s_ease-in_forwards]"
            : "animate-[slideUp_1s_cubic-bezier(0.16,1,0.3,1)] sm:animate-[zoomIn_0.3s_ease-out]"
          }`}
      >
        {/* Декоративная полоска для мобилок */}

        <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mb-4 border border-blue-100">
              <CreditCard className="text-blue-600" size={32} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 px-2">
              Активация подписки
            </h2>
            <p className="text-slate-500 mt-1 text-xs sm:text-base px-4">
              Оплатите доступ в 2 простых шага
            </p>
          </div>

          <div className="space-y-6">
            {/* Шаг 1: Перевод */}
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 text-sm sm:text-base">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 text-sm sm:text-base leading-tight">
                  Переведите 20 000 UZS / Месяц
                </h4>
                <p className="text-[11px] sm:text-sm text-slate-500 mt-1">
                  На карту (Uzcard/Humo) или через Payme/Click:
                </p>
                <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group">
                  <span className="font-mono font-bold text-slate-700 tracking-wider text-sm sm:text-base">
                    4916 9903 1909 4485
                  </span>
                  <button
                    onClick={() => copyToClipboard("4916990319094485")}
                    className="p-2 cursor-pointer hover:bg-white rounded-lg transition-colors text-blue-600"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Шаг 2: Подтверждение */}
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 text-sm sm:text-base">
                2
              </div>
              <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h4 className="font-semibold text-slate-800 text-sm sm:text-base">
                  Отправьте чек и ID
                </h4>
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-100 mt-2">
                  <code className="text-xs font-mono text-blue-600 font-bold block truncate max-w-[150px] sm:max-w-[280px]">
                    ID: {userId || "загрузка..."}
                  </code>
                  <button onClick={() => copyToClipboard(userId)} className="cursor-pointer text-slate-400 hover:text-blue-600">
                    <Copy size={14} />
                  </button>
                </div>
                <p className="text-[11px] sm:text-sm text-slate-600 mt-3 leading-normal">
                  Для мгновенной активации перейдите в поддержку:
                </p>
                <a
                  href="https://t.me/dimaaa_o"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 w-full py-3 bg-[#229ED9] hover:bg-[#1e8dbf] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-sm"
                >
                  <Send size={16} />
                  <span>Отправить в Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3 cursor-pointer bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors text-sm"
          >
            Понятно
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes slideDown { from { transform: translateY(0); } to { transform: translateY(100%); } }
        @keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes zoomOut { from { transform: scale(1); opacity: 1; } to { transform: scale(0.95); opacity: 0; } }
      `}</style>
    </div>
  );
};

export default PaymentInstructionsModal;