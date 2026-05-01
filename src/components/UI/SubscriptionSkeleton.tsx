import React from 'react';

const SubscriptionSkeleton = () => {
    return (
        <div className="bg-white flex flex-col justify-between rounded-2xl py-6 shadow-sm border border-gray-100 p-4 pb-6 sm:p-6 md:p-8 animate-pulse">
            {/* Заголовок и Статус */}
            <div className="flex justify-between items-start mb-6">
                <div className="h-4 w-32 bg-gray-100 rounded" />
                <div className="w-[60px] h-[25px] bg-gray-100 rounded-lg border border-gray-200" />
            </div>

            {/* Блок с ценой */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
                <div className="flex flex-col gap-2">
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                    <div className="h-6 w-32 bg-gray-100 rounded" />
                </div>
            </div>

            {/* Нижний блок (имитация дат) */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                <div className="flex flex-row items-end h-full gap-2 justify-center">
                    <div className="h-3 w-12 bg-gray-50 rounded" />
                    <div className="h-4 w-16 bg-gray-100 rounded" />
                </div>
                <div className="flex flex-row items-end h-full gap-2 justify-center">
                    <div className="h-3 w-12 bg-gray-50 rounded" />
                    <div className="h-4 w-16 bg-gray-100 rounded" />
                </div>
            </div>
        </div>
    );
};

export default SubscriptionSkeleton;