"use client";

import Link from "next/link";
import { MoveLeft, SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[75vh] flex items-center justify-center px-4 font-sans">
            <div className="max-w-md w-full text-center">
                {/* Заголовки */}
                <h1 className="text-8xl font-black text-slate-200 mb-4 select-none">404</h1>
                <h2 className="text-2xl font-bold text-slate-800 mb-4 uppercase tracking-tight">
                    Преподаватель не найден
                </h2>

                {/* Описание */}
                <p className="text-slate-500 mb-12 leading-relaxed px-6">
                    К сожалению, профиль этого учителя был удален или ссылка содержит ошибку.
                    Вернитесь к списку, чтобы подобрать другого наставника.
                </p>

                {/* Кнопка в стиле твоих основных форм */}
                <div className="flex justify-center">
                    <Link
                        href="/teachers"
                        className="group flex items-center justify-center gap-3 w-full max-w-[300px] h-[58px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-200/50"
                    >
                        <MoveLeft className="h-5 w-5 group-hover:-translate-x-2 transition-transform duration-300" />
                        <span>Ко всем учителям</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}