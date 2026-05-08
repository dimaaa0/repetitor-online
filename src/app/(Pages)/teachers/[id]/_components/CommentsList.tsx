"use client";

import { useState } from "react";
import { commentType } from "../page"; // импортируем интерфейс из главной страницы

export default function CommentsList({ comments }: { comments: commentType[] }) {
  const [visibleCount, setVisibleCount] = useState(3);

  const showMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  if (comments.length === 0) {
    return <p className="text-slate-400 italic text-center py-4">Отзывов пока нет. Будьте первым!</p>;
  }

  return (
    <div className="space-y-8">
      {comments.slice(0, visibleCount).map((comment, index) => (
        <div className="space-y-6" key={index}>
          <div className="group sm:p-6 p-0 rounded-3xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-slate-100 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {comment.profiles?.avatar_url ? (
                  <img 
                    src={comment.profiles.avatar_url} 
                    className="w-10 h-10 rounded-full object-cover" 
                    alt="avatar"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {comment.profiles?.name?.[0] || "A"}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-slate-900">
                    {comment.profiles?.name} {comment.profiles?.surname}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {new Date(comment.created_at).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-slate-600 hyphens-auto text-justify whitespace-pre-line">
              {comment.content}
            </p>
          </div>
        </div>
      ))}

      {visibleCount < comments.length && (
        <button
          onClick={showMore}
          className="w-full py-4 cursor-pointer text-slate-500 font-semibold hover:text-blue-600 transition-colors border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-200"
        >
          Показать еще (+5) — осталось {comments.length - visibleCount}
        </button>
      )}
    </div>
  );
}