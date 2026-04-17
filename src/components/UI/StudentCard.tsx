import React from "react";
import { BookOpen, MessageCircle, Wallet } from "lucide-react";
import Skeleton from "./SkeletonLoader";

const StudentCard = ({
  student,
  isLoading,
}: {
  student: any;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <div className="relative bg-white rounded-3xl border border-slate-100 p-2 pb-4 sm:p-6 md:p-8 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:-translate-y-1 group">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
              {student?.name?.[0] ?? "?"}
            </div>
            <span className="text-sm font-bold text-slate-500">
              {student.name}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {student.postedAt}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
            {student.title}
          </h3>

          <p className="text-slate-600 leading-relaxed mb-6 max-w-3xl">
            {student.description}
          </p>

          <div className="flex flex-wrap gap-6 items-center pt-6 border-t border-slate-50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <BookOpen size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">
                  Предмет
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {student.subject}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Wallet size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">
                  Бюджет
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {student.price?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col justify-end md:justify-center items-center gap-3">
          <button className="flex-1 md:flex-none w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
            <MessageCircle size={18} />
            Откликнуться
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
