import React, { useState, useEffect } from 'react';

interface FilterState {
    filters: {
        subject: string;
        maxPrice: number;
    };
    setFilters: React.Dispatch<React.SetStateAction<{
        subject: string;
        maxPrice: number;
    }>>;
}

const FilterPanel = ({ filters, setFilters }: FilterState) => {


    const [filtersState, setFiltersState] = useState(filters);


    return (
        <div className="bg-white absolute left-10 p-6 rounded-2xl border border-gray-100 shadow-sm w-full md:w-72">
            <h3 className="text-lg font-bold mb-4">Фильтры</h3>

            {/* Выбор предмета */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Предмет</label>
                <select
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.subject}
                    onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                >
                    <option value="">Все предметы</option>
                    <option value="Математика">Математика</option>
                    <option value="Физика">Физика</option>
                    <option value="Русский язык">Русский язык</option>
                </select>
            </div>

            {/* Цена до... */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цена до: <span className="font-bold">{filters.maxPrice.toLocaleString()} UZS</span>
                </label>
                <input
                    type="range"
                    min="0"
                    max="500000"
                    step="5000"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                />
            </div>

            <button
                className="w-full py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
                onClick={() => setFilters({ subject: '', maxPrice: 500000 })}
            >
                Сбросить все
            </button>
        </div>
    );
};

export default FilterPanel;