import React from 'react'

const StudentSkeleton = () => {
    return (

        <div className="relative bg-white rounded-3xl border border-slate-200 p-2 pb-4 sm:p-6 md:p-8 animate-pulse shadow-sm">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">

                    {/* Header: Аватар + Имя + Дата */}
                    <div className="flex items-center gap-2 mb-3">
                        {/* Кружок аватара */}
                        <div className="w-8 h-8 bg-blue-100 rounded-full shrink-0" />
                        {/* Имя */}
                        <div className="h-4 bg-slate-200 rounded-md w-24" />
                    </div>

                    {/* Title: Адаптивная высота заголовка */}
                    {/* h-7 для мобилок, md:h-8 для десктопа (соответствует тексту 2xl) */}
                    <div className="h-7 md:h-8 bg-slate-200 rounded-lg w-3/4 mb-3" />

                    <div className="space-y-4 mb-6">
                        <div className="h-4 bg-slate-100 rounded-md w-full" />
                        <div className="h-4 bg-slate-100 rounded-md 5/6-full" />
                    </div>

                    {/* Footer: Предмет, Бюджет и Кнопка */}
                    <div className="flex flex-wrap justify-between gap-6 items-center pt-6 border-t border-slate-50">

                        {/* Инфо-блоки (Предмет и Бюджет) */}
                        <div className="flex gap-4">
                            {/* Предмет */}
                            <div className="flex items-center gap-2">
                                <div className="p-2 w-9 h-9 bg-indigo-50 rounded-lg shrink-0" />
                                <div className="space-y-1">
                                    <div className="h-2.5 bg-slate-100 rounded-md w-12" />
                                    <div className="h-4 bg-slate-200 rounded-md w-20" />
                                </div>
                            </div>
                            {/* Бюджет */}
                            <div className="flex items-center gap-2">
                                <div className="p-2 w-9 h-9 bg-emerald-50 rounded-lg shrink-0" />
                                <div className="space-y-1">
                                    <div className="h-2.5 bg-slate-100 rounded-md w-12" />
                                    <div className="h-4 bg-slate-200 rounded-md w-16" />
                                </div>
                            </div>
                        </div>

                        {/* Кнопка: Адаптивная ширина как в оригинале */}
                        <div className="flex flex-row md:flex-col justify-end md:justify-center items-center gap-3 w-full md:w-auto">
                            {/* w-full на мобилках, md:w-44 на десктопе */}
                            <div className="h-[52px] bg-blue-600/20 rounded-2xl w-full md:w-44" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentSkeleton