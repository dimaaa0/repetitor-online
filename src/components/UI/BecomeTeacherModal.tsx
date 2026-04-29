import { MessageCircle } from 'lucide-react';

interface BecomeTeacherModalProps {
    onClose: () => void;
}

const BecomeTeacherModal = ({ onClose }: BecomeTeacherModalProps) => {
    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[999] animate-[fadeIn_0.3s_ease-out] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white animate-[slideUp_1s_cubic-bezier(0.16,1,0.3,1)] sm:animate-[zoomIn_0.3s_ease-out] rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl w-full max-w-lg border border-slate-100 flex flex-col max-h-[95vh] overflow-hidden"
            >
                {/* Контентная область с прокруткой */}
                <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar">

                    {/* Заголовок */}
                    <div className="text-center mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 px-2">Как стать учителем?</h2>
                        <p className="text-slate-500 mt-1 text-xs sm:text-base px-4">3 простых шага к преподаванию</p>
                    </div>

                    {/* Список шагов */}
                    <div className="space-y-5">

                        {/* Шаг 1 */}
                        <div className="flex gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 text-xs sm:text-base">
                                1
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-semibold text-slate-800 text-sm sm:text-base leading-tight">Зарегистрируйтесь</h4>
                                <p className="text-[11px] sm:text-sm text-slate-500 mt-0.5">Создайте личный профиль преподавателя.</p>
                            </div>
                        </div>

                        {/* Шаг 2 */}
                        <div className="flex gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 text-xs sm:text-base">
                                2
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-semibold text-slate-800 text-sm sm:text-base leading-tight">Создайте объявление</h4>
                                <p className="text-[11px] sm:text-sm text-slate-500 mt-0.5">Опишите ваши навыки и предметы.</p>
                            </div>
                        </div>

                        {/* Шаг 3 - Оплата */}
                        <div className="flex gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shadow-md text-xs sm:text-base">
                                3
                            </div>
                            <div className="bg-slate-100 p-3 sm:p-4 rounded-2xl border border-slate-100 w-full min-w-0">
                                <h4 className="font-semibold text-slate-800 text-sm sm:text-base">Приобритите подписку</h4>
                                <p className="text-[11px] sm:text-sm text-slate-600 mt-1 leading-normal">
                                    Для активации отправьте чек в поддержку:
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

                {/* Подвал с кнопкой закрытия - зафиксирован снизу */}
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
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes zoomIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default BecomeTeacherModal;