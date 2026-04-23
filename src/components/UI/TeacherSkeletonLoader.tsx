import { Heart } from "lucide-react";

const TeacherSkeleton = () => (
  <div className="group bg-white rounded-3xl border border-slate-200 p-2 pb-4 sm:p-6 md:p-8 animate-pulse shadow-sm flex flex-col h-full">
    {/* Header: Avatar + Info + Rating */}
    <div className="flex justify-end">
      <button className="flex items-center gap-1  mb-2 p-2 rounded-xl bg-slate-50  transition duration-300  hover:bg-blue-50 ">
        <Heart className="w-5 h-5 text-slate-200 fill-slate-400" />
        <span className="text-xs font-bold animate-pulse text-slate-200">
          ...
        </span>
      </button>
    </div>
    <div className="flex items-center gap-4 mb-4">
      {/* Аватар */}
      <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0" />

      {/* Текст: Имя и Предмет */}
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-slate-200 rounded-md w-3/4" />
        <div className="h-4 bg-slate-100 rounded-md w-1/2" />
      </div>

      {/* Плашка рейтинга (лайков) */}
      <div className="w-12 h-12 bg-slate-50 rounded-2xl border border-slate-100" />
    </div>

    {/* Description: Grow позволяет этому блоку занимать всё свободное место */}
    <div className="p-4 bg-slate-50 rounded-2xl mb-6 grow">
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded-full w-full" />
        <div className="h-3 bg-slate-200 rounded-full w-5/6" />
        <div className="h-3 bg-slate-200 rounded-full w-6/6" />
        <div className="h-3 bg-slate-200 rounded-full w-4/6" />
        <div className="h-3 bg-slate-200 rounded-full w-5/6" />
        <div className="h-3 bg-slate-200 rounded-full w-4/6" />
      </div>
    </div>

    {/* Footer: Price + Button */}
    <div className="mt-auto pt-5 border-t border-slate-50 flex justify-between items-center">
      <div className="space-y-1">
        <div className="h-10 bg-slate-200 mb-2 rounded-md w-24" />
        <div className="h-4 bg-slate-100 rounded-md w-14" />
      </div>
      <div className="h-12 bg-slate-200 rounded-xl w-32" />
    </div>
  </div>
);

export default TeacherSkeleton;
