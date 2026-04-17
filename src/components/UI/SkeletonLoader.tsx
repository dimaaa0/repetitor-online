const Skeleton = () => (
  <div className="group bg-white rounded-3xl border border-gray-100 p-2 pb-4 sm:p-6 md:p-8 animate-pulse shadow-sm flex flex-col h-full">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-slate-200 rounded-md w-3/4" />
        <div className="h-4 bg-slate-100 rounded-md w-1/2" />
      </div>
      <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
    </div>
    <div className="h-24 bg-slate-50 rounded-2xl mb-6" />
    <div className="flex justify-between items-center pt-5 border-t border-slate-50 mt-auto">
      <div className="space-y-1">
        <div className="h-6 bg-slate-200 rounded-md w-20" />
        <div className="h-3 bg-slate-100 rounded-md w-12" />
      </div>
      <div className="h-12 bg-slate-200 rounded-xl w-32" />
    </div>
  </div>
);

export default Skeleton;
