import { MessageCircle } from "lucide-react";

interface BecomeTeacherModalProps {
  onClose: () => void;
  isClosing?: boolean; // Новый проп для запуска анимации выхода
}

const BecomeTeacherModal = ({
  onClose,
  isClosing,
}: BecomeTeacherModalProps) => {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm
                ${isClosing ? "animate-[fadeOut_0.3s_ease-in_forwards]" : "animate-[fadeIn_0.3s_ease-out]"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl w-full max-w-lg border border-slate-100 flex flex-col max-h-[95vh] overflow-hidden
                    ${isClosing
            ? "animate-[slideDown_0.3s_ease-in_forwards] sm:animate-[zoomOut_0.2s_ease-in_forwards]"
            : "animate-[slideUp_0.8s_cubic-bezier(0.16,1,0.3,1)] sm:animate-[zoomIn_0.3s_ease-out]"
          }`}
      >
        <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 px-2">
              Как стать учителем?
            </h2>
            <p className="text-slate-500 mt-1 text-xs sm:text-base px-4">
              4 простых шага к преподаванию
            </p>
          </div>

          <div className="space-y-5">
            {/* Шаги 1 и 2 */}
            {[
              {
                n: 1,
                t: "Зарегистрируйтесь",
                d: "Создайте личный профиль преподавателя.",
              },
              {
                n: 2,
                t: "Создайте объявление",
                d: "Опишите ваши навыки и предметы.",
              },
              {
                n: 3,
                t: "Оплатите ежемесячную подписку",
                d: "20 000 UZS / месяц",
              },
            ].map((s) => (
              <div key={s.n} className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 text-xs sm:text-base">
                  {s.n}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-slate-800 text-sm sm:text-base leading-tight">
                    {s.t}
                  </h4>
                  <p className="text-[11px] sm:text-sm text-slate-500 mt-0.5">
                    {s.d}
                  </p>
                </div>
              </div>
            ))}

            {/* Шаг 3 */}
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shadow-md text-xs sm:text-base">
                4
              </div>
              <div className="bg-slate-100 p-3 sm:p-4 rounded-2xl border border-slate-100 w-full min-w-0">
                <h4 className="font-semibold text-slate-800 text-sm sm:text-base">
                  Отправьте чек
                </h4>
                <p className="text-[11px] sm:text-sm text-slate-600 mt-1 leading-normal">
                  Для активации отправьте чек и ваш ID пользователя в поддержку:
                </p>
                <a
                  href="https://t.me/dimaaa_o"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 bg-[#229ED9] hover:bg-[#1e8dbf] text-white rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-95 shadow-sm"
                >
                  <MessageCircle size={16} className="sm:w-[18px]" />
                  <span>В Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors text-sm"
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

export default BecomeTeacherModal;
