import React from "react";
import { Mail, Send } from "lucide-react";
import { useTranslations } from "next-intl";

const Footer: React.FC = () => {
  const t = useTranslations('Footer');
  return (
    <footer className="mt-auto py-6 px-4 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col justify-center md:flex-row items-center gap-6">
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-slate-500 mr-2">
            {t('contactUs')}
          </p>
          <a
            href="https://t.me/dimaaa_o"
            target="_blank"
            className="p-[2px] h-[38px] w-[38px] flex items-center justify-center bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
            title="Telegram"
          >
            <Send className="w-5 h-5" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
