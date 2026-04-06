"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
    textToCopy: string;
    label?: string;
}

export default function CopyButton({ textToCopy, label = "ID" }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Ошибка при копировании: ", err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`
        group cursor-pointer relative flex items-center gap-2 px-4 py-2 
        rounded-xl mt-4 font-bold text-xs transition-all duration-300
        border shadow-sm active:scale-95
        ${copied
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-emerald-100"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/30"}
      `}
        >
            <div className="relative w-4 h-4">
                <Check
                    size={16}
                    className={`absolute inset-0 transition-all duration-300 transform ${copied ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-45"
                        }`}
                />
                <Copy
                    size={16}
                    className={`absolute inset-0 transition-all duration-300 transform ${copied ? "scale-0 opacity-0 rotate-45" : "scale-100 opacity-100 rotate-0"
                        }`}
                />
            </div>

            <span className="truncate max-w-[120px]">
                {copied ? "Скопировано!" : `Копировать ${label}`}
            </span>
        </button>
    );
}