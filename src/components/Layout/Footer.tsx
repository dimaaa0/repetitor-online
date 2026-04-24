import React from "react";
import { Mail, Send } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-8 px-4 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col justify-center md:flex-row items-center gap-6">
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-slate-500 mr-2">
            Связаться со мной:
          </p>

          <a
            href="https://t.me/dimaaaoo"
            target="_blank"
            className="p-[2px] h-[38px] w-[38px] flex items-center justify-center bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
            title="Telegram"
          >
            <Send className="w-5 h-5" strokeWidth={1.5} />
          </a>

          <a
            href="https://github.com/dimaaa0?tab=repositories"
            title="Github"
            className="p-[2px] h-[38px] w-[38px] flex items-center justify-center bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
