import React from 'react';
import { Mail, Github, Send } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="mt-auto py-8 px-4 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Логотип или Название */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">Р</span>
                    </div>
                    <span className="font-bold text-slate-900 tracking-tight">
                        Репетитор онлайн
                    </span>
                </div>

                {/* Контакты */}
                <div className="flex items-center gap-4">
                    <p className="text-sm font-medium text-slate-500 mr-2">Связаться со мной:</p>

                    <a
                        href="https://t.me/your_username"
                        target="_blank"
                        className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                        title="Telegram"
                    >
                        <Send className="w-5 h-5" />
                    </a>

                    <a
                        href="mailto:example@mail.com"
                        className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                        title="Email"
                    >
                        <Mail className="w-5 h-5" />
                    </a>

                    <a
                        href="https://github.com/your_github"
                        target="_blank"
                        className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                        title="GitHub"
                    >
                        <Github className="w-5 h-5" />
                    </a>
                </div>

                {/* Копирайт */}
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} • Сделано с любовью
                </div>
            </div>
        </footer>
    );
};

export default Footer;